import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { todayISODateIST } from "@/lib/date-utils";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const today = todayISODateIST();
  const { data: stats } = useQuery({
    queryKey: ["admin-stats", today],
    queryFn: async () => {
      const [users, desks, activeBookings, upcomingHolidays, meetingRooms] = await Promise.all([
        supabase.from("user_profiles").select("id", { count: "exact", head: true }),
        supabase.from("office_desks").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("office_bookings").select("id", { count: "exact", head: true })
          .eq("status", "confirmed").gte("booking_date", today),
        supabase.from("office_holidays").select("id", { count: "exact", head: true }).gte("holiday_date", today),
        supabase.from("office_rooms").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      return {
        users: users.count ?? 0,
        desks: desks.count ?? 0,
        activeBookings: activeBookings.count ?? 0,
        upcomingHolidays: upcomingHolidays.count ?? 0,
        meetingRooms: meetingRooms.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Total employees", value: stats?.users },
    { label: "Total desks", value: stats?.desks },
    { label: "Active bookings", value: stats?.activeBookings },
    { label: "Upcoming holidays", value: stats?.upcomingHolidays },
    { label: "Total meeting rooms", value: stats?.meetingRooms },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <Card key={c.label} className="p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</div>
          <div className="mt-2 text-3xl font-semibold text-primary">
            {c.value ?? "—"}
          </div>
        </Card>
      ))}
    </div>
  );
}
