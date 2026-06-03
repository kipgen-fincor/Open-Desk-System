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
import { CalendarDays, CheckCircle2, Map as MapIcon, XCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

type DeskBooking = {
  id: string;
  booking_date: string;
  desk_id: string;
  status: string;
  office_desks?: {
    desk_code: string | null;
    office_zones?: { zone_code: string | null } | null;
  } | null;
};

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
        .select(
          "id, booking_date, desk_id, status, office_desks(desk_code, office_zones(zone_code))",
        )
        .eq("user_id", user!.id)
        .eq("status", "confirmed")
        .gte("booking_date", today)
        .order("booking_date", { ascending: true });
      if (error) throw error;
      return data as unknown as DeskBooking[];
    },
  });

  const holidayMap = new Map(holidays.map((h) => [h.holiday_date, h.holiday_name]));
  const bookingMap = new Map(myBookings.map((b) => [b.booking_date, b]));

  const selectedISO = selected ? toISODate(selected) : undefined;
  const status = selectedISO ? evaluateDate(selectedISO, holidayMap) : null;
  const existingBooking = selectedISO ? bookingMap.get(selectedISO) : null;
  const canOpenMap = !!selectedISO && (!!existingBooking || status?.kind === "ok");

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

  const openDeskMap = () => {
    if (!selectedISO) return;
    navigate({ to: "/book/$date", params: { date: selectedISO } });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] xl:gap-6">
      <Card className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Pick a date</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose a bookable workday.</p>
          </div>
          <div className="hidden rounded-full bg-primary/10 p-2 text-primary sm:block">
            <CalendarDays className="h-5 w-5" />
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          startMonth={parseISODate(today)}
          className="w-full rounded-xl bg-transparent p-0 [--cell-size:2.45rem] sm:[--cell-size:2.75rem]"
          classNames={{
            root: "w-full",
            months: "w-full",
            month: "w-full",
            table: "w-full border-separate border-spacing-1",
            weekdays: "grid grid-cols-7 gap-1",
            weekday:
              "flex h-8 items-center justify-center rounded-lg text-xs font-medium text-muted-foreground",
            week: "grid grid-cols-7 gap-1",
            day: "aspect-square p-0",
            today: "rounded-xl bg-primary/10 text-primary [&_button]:font-semibold",
            disabled:
              "rounded-xl bg-muted/45 text-muted-foreground/45 opacity-100 [&_button]:cursor-not-allowed",
            day_button:
              "rounded-xl transition-colors hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 data-[selected-single=true]:rounded-xl",
          }}
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
              "rounded-xl bg-destructive/15 text-destructive hover:bg-destructive/20 [&_button]:rounded-xl",
            weekend: "rounded-xl bg-muted/40 text-muted-foreground/55",
            booked:
              "rounded-xl bg-primary/15 text-primary ring-1 ring-primary/45 [&_button]:rounded-xl",
          }}
        />
        <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          <LegendDot color="bg-primary" label="You have a booking" />
          <LegendDot color="bg-muted-foreground/40" label="Weekend / unavailable" />
          <LegendDot color="bg-destructive" label="Public holiday" />
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Selected date
              </p>
              <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
                {selectedISO ? formatDateLong(selectedISO) : "No date selected"}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {existingBooking ? (
                  <>
                    <StatusBadge status={{ kind: "booked" }} />
                    <Badge
                      variant="outline"
                      className="rounded-full border-primary/25 bg-primary/10 text-primary"
                    >
                      Desk {formatDeskLabel(existingBooking)}
                    </Badge>
                  </>
                ) : (
                  status && <StatusBadge status={status} />
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-48">
              {canOpenMap && (
                <Button
                  className="w-full gap-2 bg-primary hover:bg-primary/90"
                  onClick={openDeskMap}
                >
                  <MapIcon className="h-4 w-4" />
                  Browse Desk / Room
                </Button>
              )}
              {existingBooking && canCancel(selectedISO!) && (
                <Button
                  variant="outline"
                  className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleCancel(existingBooking.id, selectedISO!)}
                >
                  <XCircle className="h-4 w-4" />
                  Cancel booking
                </Button>
              )}
              {existingBooking && !canCancel(selectedISO!) && (
                <Badge variant="secondary" className="justify-center rounded-full py-1.5">
                  Cancellation locked
                </Badge>
              )}
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Your upcoming bookings</h3>
            <Badge variant="outline" className="rounded-full">
              {myBookings.length}
            </Badge>
          </div>
          {myBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/25 p-4 text-sm text-muted-foreground">
              No upcoming bookings.
            </div>
          ) : (
            <ul className="space-y-3">
              {myBookings.map((b) => (
                <li
                  key={b.id}
                  className="grid gap-3 rounded-xl border border-border/70 bg-background/55 p-3 sm:grid-cols-[76px_1fr_auto] sm:items-center"
                >
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="text-xs font-medium uppercase">
                      {parseISODate(b.booking_date).toLocaleDateString(undefined, {
                        month: "short",
                      })}
                    </span>
                    <span className="text-xl font-semibold leading-none">
                      {parseISODate(b.booking_date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold">
                      Desk {formatDeskLabel(b)}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDateLong(b.booking_date)}</span>
                      <Badge className="rounded-full bg-success/20 text-success-foreground">
                        Confirmed
                      </Badge>
                    </div>
                  </div>
                  {canCancel(b.booking_date) ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
                      onClick={() => handleCancel(b.id, b.booking_date)}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="w-fit rounded-full">
                      Locked
                    </Badge>
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
  | { kind: "booked" }
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
      <Badge className="rounded-full bg-success/25 text-success-foreground">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Available
      </Badge>
    );
  if (status.kind === "booked")
    return (
      <Badge className="rounded-full bg-primary text-primary-foreground">Confirmed booking</Badge>
    );
  if (status.kind === "past")
    return (
      <Badge variant="secondary" className="rounded-full">
        Past date
      </Badge>
    );
  if (status.kind === "weekend")
    return (
      <Badge variant="secondary" className="rounded-full">
        Weekend — bookings disabled
      </Badge>
    );
  if (status.kind === "too-far")
    return (
      <Badge variant="secondary" className="rounded-full">
        Only 7 days ahead allowed
      </Badge>
    );
  return (
    <Badge className="rounded-full bg-destructive/15 text-destructive">
      Holiday: {status.name}
    </Badge>
  );
}

function formatDeskLabel(booking: DeskBooking) {
  const zone = booking.office_desks?.office_zones?.zone_code;
  const desk = booking.office_desks?.desk_code;
  if (zone && desk) return `${zone}-${desk}`;
  return desk ?? "—";
}
