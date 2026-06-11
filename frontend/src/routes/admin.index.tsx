import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarClock,
  DoorOpen,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { formatDateLong, todayISODateIST } from "@/lib/date-utils";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const today = todayISODateIST();
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["admin-dashboard", today],
    queryFn: async () => {
      const [
        users,
        desks,
        activeDeskBookings,
        todaysDeskBookings,
        upcomingHolidays,
        meetingRooms,
        todaysRoomBookings,
      ] = await Promise.all([
        supabase.from("user_profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("office_desks")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("office_bookings")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed")
          .gte("booking_date", today),
        supabase
          .from("office_bookings")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed")
          .eq("booking_date", today),
        supabase
          .from("office_holidays")
          .select("id, holiday_date, holiday_name", { count: "exact" })
          .gte("holiday_date", today)
          .order("holiday_date", { ascending: true })
          .limit(1),
        supabase
          .from("office_rooms")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("room_bookings")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed")
          .eq("booking_date", today),
      ]);

      return {
        users: users.count ?? 0,
        desks: desks.count ?? 0,
        activeDeskBookings: activeDeskBookings.count ?? 0,
        todaysDeskBookings: todaysDeskBookings.count ?? 0,
        upcomingHolidays: upcomingHolidays.count ?? 0,
        nextHoliday: upcomingHolidays.data?.[0] ?? null,
        meetingRooms: meetingRooms.count ?? 0,
        todaysRoomBookings: todaysRoomBookings.count ?? 0,
      };
    },
  });

  const deskOccupancy = dashboard?.desks
    ? Math.min(100, Math.round((dashboard.todaysDeskBookings / dashboard.desks) * 100))
    : 0;
  const occupiedDesks = dashboard?.todaysDeskBookings ?? 0;
  const totalDesks = dashboard?.desks ?? 0;
  const availableDesks = Math.max(totalDesks - occupiedDesks, 0);

  const kpis = [
    {
      label: "Employees",
      value: dashboard?.users,
      helper: "Registered profiles",
      icon: Users,
      iconTone: "bg-primary/10 text-primary",
    },
    {
      label: "Active desks",
      value: dashboard?.desks,
      helper: `${dashboard?.todaysDeskBookings ?? 0} booked today`,
      icon: BriefcaseBusiness,
      iconTone: "bg-success/20 text-success-foreground",
    },
    {
      label: "Upcoming bookings",
      value: dashboard?.activeDeskBookings,
      helper: "Confirmed desk reservations",
      icon: CalendarCheck,
      iconTone: "bg-secondary/15 text-secondary",
    },
    {
      label: "Meeting rooms",
      value: dashboard?.meetingRooms,
      helper: `${dashboard?.todaysRoomBookings ?? 0} room bookings today`,
      icon: DoorOpen,
      iconTone: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-5">
      <Card className="rounded-lg border-border/80 bg-card p-4 shadow-sm">
        <div className="grid gap-0 sm:grid-cols-2 md:grid-cols-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex items-center gap-4 px-4 py-3 first:pl-0 last:pr-0 md:border-l md:border-border/70 md:first:border-l-0"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${kpi.iconTone}`}
              >
                <kpi.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-muted-foreground">{kpi.label}</div>
                <div className="mt-1 text-2xl font-semibold leading-none tracking-tight">
                  {kpi.value ?? "..."}
                </div>
                <div className="mt-2 truncate text-xs text-muted-foreground">{kpi.helper}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Card className="rounded-lg border-border/80 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Today's occupancy</h3>
              <p className="mt-1 text-sm text-muted-foreground">{today}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-[12rem_minmax(0,1fr)] md:items-center">
            <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(var(--primary) ${deskOccupancy * 3.6}deg, var(--muted) 0deg)`,
                }}
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-border/70" />
              <div className="absolute inset-5 rounded-full bg-card shadow-inner" />
              <div className="relative text-center">
                <div className="text-4xl font-semibold tracking-tight text-primary">
                  {isLoading ? "..." : `${deskOccupancy}%`}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">occupied</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">
                  {occupiedDesks} of {totalDesks} desks
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current confirmed desk usage for today.
                </p>
              </div>
              <div className="grid gap-2">
                <OccupancyLegendItem
                  colorClass="bg-primary"
                  label="Occupied desks"
                  value={occupiedDesks}
                />
                <OccupancyLegendItem
                  colorClass="bg-muted"
                  label="Available desks"
                  value={availableDesks}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border-border/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent p-2.5 text-accent-foreground">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Calendar watch</h3>
              <p className="text-sm text-muted-foreground">Upcoming holiday impact</p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-border/70 bg-muted/30 p-4">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-semibold tracking-tight">
                {dashboard?.upcomingHolidays ?? "..."}
              </div>
              <div className="text-sm text-muted-foreground">upcoming holidays</div>
            </div>
            {dashboard?.nextHoliday && (
              <div className="mt-5 flex items-start gap-3 border-t border-border/70 pt-4 text-sm">
                <div className="mt-0.5 rounded-md bg-background p-2 text-primary">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{dashboard.nextHoliday.holiday_name}</div>
                  <div className="text-muted-foreground">
                    {formatDateLong(dashboard.nextHoliday.holiday_date)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

function OccupancyLegendItem({
  colorClass,
  label,
  value,
}: {
  colorClass: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
