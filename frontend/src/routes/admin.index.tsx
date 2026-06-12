import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, CalendarCheck, DoorOpen, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { todayISODateIST } from "@/lib/date-utils";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

type ZoneDesk = {
  id: string;
  office_zones?: { zone_code: string | null; description: string | null } | null;
};

type ZoneBooking = {
  desk_id: string | null;
  office_desks?: ZoneDesk | null;
};

type ZoneOccupancy = {
  zoneKey: string;
  zoneName: string;
  occupied: number;
  total: number;
  percentage: number;
};

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
        meetingRooms,
        todaysRoomBookings,
        zoneDesks,
        zoneBookings,
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
          .from("office_rooms")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("room_bookings")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed")
          .eq("booking_date", today),
        supabase
          .from("office_desks")
          .select("id, office_zones(zone_code, description)")
          .eq("is_active", true)
          .order("desk_code"),
        supabase
          .from("office_bookings")
          .select("desk_id, office_desks(id, office_zones(zone_code, description))")
          .eq("status", "confirmed")
          .eq("booking_date", today),
      ]);

      const zonesByName = new Map<string, { occupied: number; total: number }>();
      const typedZoneDesks = (zoneDesks.data ?? []) as unknown as ZoneDesk[];
      const typedZoneBookings = (zoneBookings.data ?? []) as unknown as ZoneBooking[];

      for (const desk of typedZoneDesks) {
        const zoneKey = formatAdminZoneKey(desk.office_zones);
        const zone = zonesByName.get(zoneKey) ?? { occupied: 0, total: 0 };
        zone.total += 1;
        zonesByName.set(zoneKey, zone);
      }

      for (const booking of typedZoneBookings) {
        const zoneKey = formatAdminZoneKey(booking.office_desks?.office_zones);
        const zone = zonesByName.get(zoneKey) ?? { occupied: 0, total: 0 };
        zone.occupied += 1;
        zonesByName.set(zoneKey, zone);
      }

      const zoneOccupancy = Array.from(zonesByName, ([zoneKey, zone]) => ({
        zoneKey,
        zoneName: zoneKey,
        occupied: zone.occupied,
        total: zone.total,
        percentage: zone.total ? Math.min(100, Math.round((zone.occupied / zone.total) * 100)) : 0,
      })).sort((a, b) => a.zoneName.localeCompare(b.zoneName));

      return {
        users: users.count ?? 0,
        desks: desks.count ?? 0,
        activeDeskBookings: activeDeskBookings.count ?? 0,
        todaysDeskBookings: todaysDeskBookings.count ?? 0,
        meetingRooms: meetingRooms.count ?? 0,
        todaysRoomBookings: todaysRoomBookings.count ?? 0,
        zoneOccupancy,
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
      iconTone: "bg-[#EAF5F7] text-[#3D8791]",
    },
    {
      label: "Upcoming bookings",
      value: dashboard?.activeDeskBookings,
      helper: "Confirmed desk reservations",
      icon: CalendarCheck,
      iconTone: "bg-[#EAF5F7] text-[#3D8791]",
    },
    {
      label: "Meeting rooms",
      value: dashboard?.meetingRooms,
      helper: `${dashboard?.todaysRoomBookings ?? 0} room bookings today`,
      icon: DoorOpen,
      iconTone: "bg-[#EAF5F7] text-[#3D8791]",
    },
  ];

  return (
    <div className="space-y-5">
      <Card className="rounded-[20px] border border-[#DDE7EC] bg-[#EEF5F7] p-3 shadow-[0_14px_36px_rgba(15,23,42,0.07)]">
        <div className="grid gap-3 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex items-center gap-4 rounded-[16px] border border-[#DDE7EC] bg-white px-4 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.045)]"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${kpi.iconTone}`}
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

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Today's occupancy</h3>
              <p className="mt-1 text-sm text-muted-foreground">{today}</p>
            </div>
            <div className="rounded-[14px] bg-[#EAF5F7] p-2.5 text-[#3D8791]">
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

        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold">Occupancy by zone</h3>
              <p className="mt-1 text-sm text-muted-foreground">{today}</p>
            </div>
            <div className="rounded-[14px] bg-[#EAF5F7] p-2.5 text-[#3D8791]">
              <Building2 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {(dashboard?.zoneOccupancy ?? []).length === 0 ? (
              <div className="rounded-[12px] border border-border/70 bg-[#F8FBFC] px-3 py-2.5 text-sm text-muted-foreground">
                No zones available.
              </div>
            ) : (
              dashboard?.zoneOccupancy.map((zone) => (
                <ZoneOccupancyItem key={zone.zoneName} zone={zone} />
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

function formatAdminZoneKey(
  zone?: { zone_code: string | null; description: string | null } | null,
) {
  return zone?.zone_code || zone?.description || "Unassigned";
}

function formatAdminZoneName(zoneKey: string) {
  const normalized = zoneKey.trim().toLowerCase();
  if (normalized === "a" || normalized === "zone a") return "Analytics";
  if (normalized === "b" || normalized === "zone b") return "Advisory";
  return zoneKey;
}

function ZoneOccupancyItem({ zone }: { zone: ZoneOccupancy }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{formatAdminZoneName(zone.zoneName)}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {zone.occupied} / {zone.total} desks
          </div>
        </div>
        <div className="text-sm font-semibold text-primary">{zone.percentage}%</div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${zone.percentage}%` }}
        />
      </div>
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
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-border/70 bg-[#F8FBFC] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
