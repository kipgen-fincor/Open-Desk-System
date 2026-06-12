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
  { to: "/admin/bookings", label: "Desk Bookings" },
  { to: "/admin/room-bookings", label: "Room Bookings" },
  { to: "/admin/zones", label: "Zones" },
  { to: "/admin/desks", label: "Desks" },
  { to: "/admin/rooms", label: "Rooms" },
  { to: "/admin/holidays", label: "Holidays" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/audit", label: "Audit Logs" },
] as const;

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#121B2D]">Admin</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Manage zones, desks, holidays, users and review audit logs.
        </p>
      </div>
      <nav className="flex flex-wrap gap-1 rounded-[16px] border border-border bg-white p-1 shadow-sm">
        {tabs.map((t) => {
          const active = path === t.to;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "rounded-[12px] px-3 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-[#EAF5F7] text-[#006D7E]"
                  : "text-muted-foreground hover:bg-[#F6F8FB] hover:text-foreground",
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
