import { Link, useRouterState } from "@tanstack/react-router";
import { Calendar, Shield, ClipboardList, DoorOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ProfileMenu } from "@/components/profile-menu";
import { cn } from "@/lib/utils";

export function AppNavbar() {
  const { profile } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const navItem = (to: string, label: string, Icon: typeof Calendar) => {
    const active = path === to || (to !== "/" && path.startsWith(to));
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active ? "bg-[#0E7A8A] text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white",
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-900 text-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img src="/fincor-logo.webp" alt="Fincor Logo" className="h-8 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItem("/", "Desk Booking", Calendar)}
            {navItem("/rooms", "Room Booking", DoorOpen)}
            {navItem("/my-bookings", "My Bookings", ClipboardList)}
            {profile?.user_role === "admin" && navItem("/admin", "Admin", Shield)}
          </nav>
        </div>

        <ProfileMenu />
      </div>
    </header>
  );
}
