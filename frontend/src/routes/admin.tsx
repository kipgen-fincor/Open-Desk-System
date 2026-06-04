import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: () => (
    <AppShell adminOnly>
      <AdminLayout />
    </AppShell>
  ),
});

const tabs = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/room-bookings", label: "Room bookings" },
  { to: "/admin/zones", label: "Zones" },
  { to: "/admin/desks", label: "Desks" },
  { to: "/admin/holidays", label: "Holidays" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/audit", label: "Audit logs" },
] as const;

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Manage zones, desks, holidays, users and review audit logs.
        </p>
      </div>
      <nav className="flex flex-wrap gap-1 border-b border-border">
        {tabs.map((t) => {
          const active = path === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "rounded-t-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      <Outlet />
    </div>
  );
}
