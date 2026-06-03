import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/lib/supabase";
import {
  canCancel,
  daysFromTodayIST,
  formatDateLong,
  isWeekend,
  isWithinBookingWindow,
  parseISODate,
  toISODate,
  todayISODateIST,
} from "@/lib/date-utils";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <AppShell>
      <CalendarView />
    </AppShell>
  );
}

function CalendarView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = todayISODateIST();
  const [selected, setSelected] = useState<Date | undefined>(parseISODate(today));

  const { data: holidays = [] } = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_holidays")
        .select("holiday_date, holiday_name");
      if (error) throw error;
      return data as { holiday_date: string; holiday_name: string }[];
    },
  });

  const { data: myBookings = [], refetch: refetchBookings } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_bookings")
        .select("id, booking_date, desk_id, status, office_desks(desk_code, office_zones(zone_code))")
        .eq("user_id", user!.id)
        .eq("status", "confirmed")
        .gte("booking_date", today)
        .order("booking_date", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  const holidayMap = new Map(holidays.map((h) => [h.holiday_date, h.holiday_name]));
  const bookingMap = new Map(myBookings.map((b) => [b.booking_date, b]));

  const selectedISO = selected ? toISODate(selected) : undefined;
  const status = selectedISO ? evaluateDate(selectedISO, holidayMap) : null;
  const existingBooking = selectedISO ? bookingMap.get(selectedISO) : null;

  const handleCancel = async (bookingId: string, dateIso: string) => {
    if (!canCancel(dateIso)) {
      toast.error("Cancellation closed (after 6 PM IST on booking day)");
      return;
    }
    const { error } = await supabase
      .from("office_bookings")
      .update({ status: "cancelled", cancelled_by_user_id: user?.id })
      .eq("id", bookingId);
    if (error) toast.error(error.message);
    else {
      toast.success("Booking cancelled");
      refetchBookings();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <Card className="p-4">
        <h2 className="mb-3 text-base font-semibold">Pick a date</h2>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          startMonth={parseISODate(today)}
          disabled={(d) => {
            const iso = toISODate(d);
            return !isWithinBookingWindow(iso);
          }}
          modifiers={{
            holiday: (d) => holidayMap.has(toISODate(d)),
            weekend: (d) => isWeekend(toISODate(d)),
            booked: (d) => bookingMap.has(toISODate(d)),
          }}
          modifiersClassNames={{
            holiday:
              "bg-destructive text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground",
            weekend: "text-muted-foreground/60",
            booked: "ring-2 ring-primary",
          }}
        />
        <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          <LegendDot color="bg-primary" label="You have a booking" />
          <LegendDot color="bg-muted-foreground/40" label="Weekend / unavailable" />
          <LegendDot color="bg-destructive" label="Public holiday" />
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Selected date
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                {selectedISO ? formatDateLong(selectedISO) : "—"}
              </h2>
              {status && <StatusBadge status={status} />}
            </div>
            <div className="flex flex-wrap gap-2">
              {existingBooking ? (
                <>
                  <Badge className="bg-destructive text-destructive-foreground">
                    Booked: {existingBooking.office_desks?.office_zones?.zone_code}-
                    {existingBooking.office_desks?.desk_code}
                  </Badge>
                  {canCancel(selectedISO!) && (
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(existingBooking.id, selectedISO!)}
                    >
                      Cancel booking
                    </Button>
                  )}
                </>
              ) : (
                status?.kind === "ok" && (
                  <Button
                    onClick={() => navigate({ to: "/book/$date", params: { date: selectedISO! } })}
                  >
                    Check available desks
                  </Button>
                )
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-base font-semibold">Your upcoming bookings</h3>
          {myBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming bookings.</p>
          ) : (
            <ul className="divide-y divide-border">
              {myBookings.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <div className="font-medium">{formatDateLong(b.booking_date)}</div>
                    <div className="text-sm text-muted-foreground">
                      Desk {b.office_desks?.office_zones?.zone_code}-{b.office_desks?.desk_code}
                    </div>
                  </div>
                  {canCancel(b.booking_date) ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(b.id, b.booking_date)}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Badge variant="secondary">Locked</Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

type DateStatus =
  | { kind: "ok" }
  | { kind: "past" }
  | { kind: "weekend" }
  | { kind: "holiday"; name: string }
  | { kind: "too-far" };

function evaluateDate(iso: string, holidays: Map<string, string>): DateStatus {
  if (daysFromTodayIST(iso) < 0) return { kind: "past" };
  if (!isWithinBookingWindow(iso)) return { kind: "too-far" };
  if (isWeekend(iso)) return { kind: "weekend" };
  if (holidays.has(iso)) return { kind: "holiday", name: holidays.get(iso)! };
  return { kind: "ok" };
}

function StatusBadge({ status }: { status: DateStatus }) {
  if (status.kind === "ok")
    return (
      <Badge className="mt-2 bg-success text-success-foreground">Available for booking</Badge>
    );
  if (status.kind === "past")
    return <Badge variant="secondary" className="mt-2">Past date</Badge>;
  if (status.kind === "weekend")
    return <Badge variant="secondary" className="mt-2">Weekend — bookings disabled</Badge>;
  if (status.kind === "too-far")
    return <Badge variant="secondary" className="mt-2">Only 7 days ahead allowed</Badge>;
  return (
    <Badge className="mt-2 bg-destructive text-destructive-foreground">
      Holiday: {status.name}
    </Badge>
  );
}

function addDays(iso: string, n: number) {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}
