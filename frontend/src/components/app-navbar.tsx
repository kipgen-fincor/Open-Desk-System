import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Calendar, Shield, ClipboardList, DoorOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AppNavbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const initials = (profile?.full_name || profile?.email || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const navItem = (to: string, label: string, Icon: typeof Calendar) => {
    const active = path === to || (to !== "/" && path.startsWith(to));
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "text-primary-foreground/80 hover:bg-primary/80 hover:text-primary-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-primary text-primary-foreground shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            DeskBook
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItem("/", "Calendar", Calendar)}
            {navItem("/rooms", "Rooms", DoorOpen)}
            {navItem("/my-bookings", "My Bookings", ClipboardList)}
            {profile?.user_role === "admin" && navItem("/admin", "Admin", Shield)}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium leading-tight">
              {profile?.full_name || profile?.email}
            </div>
            <div className="text-xs leading-tight text-primary-foreground/70">
              {profile?.user_role === "admin" ? "Administrator" : "Employee"}
            </div>
          </div>
          <Avatar className="h-9 w-9 border border-primary-foreground/20">
            <AvatarFallback className="bg-accent text-accent-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
            onClick={async () => {
              await signOut();
              navigate({ to: "/auth" });
            }}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
