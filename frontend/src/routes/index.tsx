import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/lib/supabase";
import {
  daysFromTodayIST,
  formatDateLong,
  isWeekend,
  isWithinBookingWindow,
  parseISODate,
  toISODate,
  todayISODateIST,
} from "@/lib/date-utils";
import { useAuth } from "@/lib/auth-context";
import {
  Armchair,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Lightbulb,
  MapPin,
  MoreVertical,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

type DeskBooking = {
  id: string;
  booking_date: string;
  booking_notes: string | null;
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

  const { data: myBookings = [] } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_bookings")
        .select(
          "id, booking_date, booking_notes, desk_id, status, office_desks(desk_code, office_zones(zone_code))",
        )
        .eq("user_id", user!.id)
        .eq("status", "confirmed")
        .gte("booking_date", today)
        .order("booking_date", { ascending: true });
      if (error) throw error;
      return data as unknown as DeskBooking[];
    },
  });

  const { data: deskSummary } = useQuery({
    queryKey: ["desk-booking-home-summary", today],
    queryFn: async () => {
      const [activeDesks, todaysBookings] = await Promise.all([
        supabase
          .from("office_desks")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("office_bookings")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed")
          .eq("booking_date", today),
      ]);

      return {
        totalDesks: activeDesks.count ?? 0,
        bookedToday: todaysBookings.count ?? 0,
      };
    },
  });

  const holidayMap = new Map(holidays.map((h) => [h.holiday_date, h.holiday_name]));
  const bookingMap = new Map(myBookings.map((b) => [b.booking_date, b]));

  const selectedISO = selected ? toISODate(selected) : undefined;
  const status = selectedISO ? evaluateDate(selectedISO, holidayMap) : null;
  const existingBooking = selectedISO ? bookingMap.get(selectedISO) : null;
  const canOpenMap = !!selectedISO && (!!existingBooking || status?.kind === "ok");
  const todaysPersonalBookings = myBookings.filter((booking) => booking.booking_date === today);
  const nextBooking = myBookings[0] ?? null;
  const availableDesks = Math.max(
    (deskSummary?.totalDesks ?? 0) - (deskSummary?.bookedToday ?? 0),
    0,
  );
  const displayName = user?.email?.split("@")[0] ?? "there";

  const openDeskMap = () => {
    if (!selectedISO) return;
    navigate({ to: "/book/$date", params: { date: selectedISO } });
  };

  return (
    <div className="-mx-4 -my-6 min-h-[calc(100vh-3.5rem)] bg-[#F6F8FB] px-4 py-6 text-[#121B2D] sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[390px_minmax(0,1fr)] xl:gap-6">
        <Card className="h-fit rounded-[18px] border border-[#DDE7EC] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-semibold text-[#121B2D]">Select booking date</h2>
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#DCE8EE] bg-[#F8FBFC] text-[#3D8791] shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>

          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            showOutsideDays={false}
            className="mx-auto w-full bg-white p-0 [--cell-size:2.55rem] sm:[--cell-size:2.9rem]"
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full space-y-4",
              month_caption:
                "flex h-9 items-center justify-center text-[18px] font-bold text-[#3D8791]",
              caption_label: "text-[18px] font-bold text-[#3D8791]",
              nav: "absolute left-0 right-0 top-0 flex items-center justify-center",
              button_previous:
                "absolute left-[26%] top-0 flex h-9 w-9 items-center justify-center rounded-full text-[#3D8791] transition hover:bg-[#E9F5F7] sm:left-[7.6rem]",
              button_next:
                "absolute right-[26%] top-0 flex h-9 w-9 items-center justify-center rounded-full text-[#3D8791] transition hover:bg-[#E9F5F7] sm:right-[7.6rem]",
              table: "w-full border-separate border-spacing-y-2",
              weekdays: "grid grid-cols-7 gap-1",
              weekday: "flex h-7 items-center justify-center text-xs font-bold text-[#3D8791]",
              weeks: "flex flex-col gap-1.5",
              week: "grid grid-cols-7 gap-1",
              day: "flex h-[var(--cell-size)] items-center justify-center p-0",
              day_button:
                "h-full w-full rounded-[10px] border-2 border-[#C7CAD7] bg-[#F0F0F6] text-sm font-semibold text-[#7A8492] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7),0_1px_2px_rgba(15,23,42,0.12)] transition hover:border-[#8DBCC4] hover:bg-[#EAF5F7] hover:text-[#3D8791] focus-visible:ring-2 focus-visible:ring-[#3D8791]/35 data-[selected-single=true]:border-[#3D8791] data-[selected-single=true]:bg-[#3D8791] data-[selected-single=true]:text-white data-[selected-single=true]:shadow-[0_8px_18px_rgba(61,135,145,0.28)] sm:rounded-[12px] sm:text-base",
              today:
                "[&_button]:border-[#F5B9B8] [&_button]:bg-[#FFF0F0] [&_button]:text-[#F06A6A]",
              disabled: "opacity-100 [&_button]:cursor-not-allowed [&_button]:text-[#AEB4BE]",
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
                "[&_button]:border-[#F5B9B8] [&_button]:bg-[#FFF0F0] [&_button]:text-[#F06A6A]",
              weekend: "[&_button]:text-[#9AA8BA]",
              booked:
                "[&_button]:border-[#8DBCC4] [&_button]:bg-[#EAF5F7] [&_button]:text-[#3D8791]",
            }}
          />

          <div className="mt-5 rounded-[10px] bg-[#EAF5F7] px-4 py-3 text-[#3D8791]">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 shrink-0" />
              <p className="text-[13px] font-medium">
                Tip: You can book desks up to 7 days in advance.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="overflow-hidden rounded-[18px] border border-[#E4EAF0] bg-white shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
            <div className="relative px-5 py-4 sm:px-6">
              <div className="relative z-10 max-w-xl">
                <h1 className="text-2xl font-bold leading-tight text-[#121B2D] sm:text-[26px]">
                  {getGreeting()}, {displayName}
                </h1>
                <p className="mt-1 text-sm font-medium text-[#65748A]">
                  Let&apos;s find you the perfect workspace for today.
                </p>
              </div>
            </div>

            <div className="grid gap-3 border-t border-[#EEF2F5] bg-white px-4 pb-4 pt-3 sm:grid-cols-3 sm:px-5">
              <SummaryCard
                icon={Armchair}
                label="Available desks"
                value={availableDesks}
                helper="Desks available"
                tone="teal"
              />
              <SummaryCard
                icon={CalendarCheck}
                label="Today's bookings"
                value={todaysPersonalBookings.length}
                helper="Confirmed"
                tone="teal"
              />
              <SummaryCard
                icon={Clock3}
                label="Next booking"
                value={nextBooking ? formatBookingTime(nextBooking.booking_notes) : "None"}
                helper={nextBooking ? "Today" : "No desk booked"}
                tone="teal"
              />
            </div>
          </Card>

          <Card className="rounded-[18px] border border-[#DDE7EC] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.07)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EAF5F7] text-[#3D8791]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#121B2D]">Browse desks</h2>
                  <p className="mt-0.5 max-w-xl text-sm font-medium text-[#65748A]">
                    Open the desk map for{" "}
                    {selectedISO ? formatDateLong(selectedISO) : "your selected date"}.
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {existingBooking ? (
                      <StatusBadge status={{ kind: "booked" }} />
                    ) : (
                      status && <StatusBadge status={status} />
                    )}
                  </div>
                </div>
              </div>
              <Button
                className="h-10 gap-2 rounded-[12px] border border-[#3D8791] bg-[#3D8791] px-5 font-semibold text-[#07111F] shadow-[0_10px_22px_rgba(61,135,145,0.22)] hover:bg-[#3D8791] hover:text-[#07111F]"
                disabled={!canOpenMap}
                onClick={openDeskMap}
              >
                Browse desks
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="rounded-[18px] border border-[#DDE7EC] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.07)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#121B2D]">Your upcoming booking</h3>
                <p className="mt-1 text-sm font-medium text-[#65748A]">
                  Confirmed desk reservations.
                </p>
              </div>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-10 gap-2 rounded-[12px] border-[#3D8791] bg-[#3D8791] px-4 font-semibold text-[#07111F] shadow-[0_10px_22px_rgba(61,135,145,0.18)] hover:bg-[#3D8791] hover:text-[#07111F]"
              >
                <Link to="/my-bookings">
                  View all desk bookings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {myBookings.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-[#CAD8E0] bg-[#F8FBFC] p-5 text-sm font-medium text-[#65748A]">
                No upcoming bookings.
              </div>
            ) : (
              <ul className="space-y-3">
                {myBookings.map((booking) => (
                  <UpcomingBookingCard key={booking.id} booking={booking} />
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: typeof Armchair;
  label: string;
  value: string | number;
  helper: string;
  tone: "teal" | "blue" | "amber";
}) {
  const tones = {
    teal: "bg-[#E6F5F2] text-[#3D8791]",
    blue: "bg-[#E6F5F2] text-[#3D8791]",
    amber: "bg-[#E6F5F2] text-[#3D8791]",
  };

  return (
    <div className="flex min-h-[78px] items-center gap-3 rounded-[14px] bg-[#FBFCFE] p-3 shadow-[0_8px_22px_rgba(15,23,42,0.045)] ring-1 ring-[#EEF2F5]">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold text-[#121B2D]">{label}</div>
        <div className="mt-1 truncate text-[22px] font-bold leading-none text-[#121B2D]">
          {value}
        </div>
        <div className="mt-1 truncate text-xs font-medium text-[#65748A]">{helper}</div>
      </div>
    </div>
  );
}

function UpcomingBookingCard({ booking }: { booking: DeskBooking }) {
  const date = parseISODate(booking.booking_date);
  const details = getBookingDetails(booking);

  return (
    <li className="grid gap-4 rounded-[16px] border border-[#E1E8EE] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:grid-cols-[88px_minmax(0,1fr)_112px] sm:items-center">
      <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-[14px] bg-[#EAF5F7] text-[#3D8791]">
        <span className="text-sm font-bold uppercase">
          {date.toLocaleDateString(undefined, { weekday: "short" })}
        </span>
        <span className="mt-1 text-3xl font-bold leading-none">{date.getDate()}</span>
        <span className="mt-1 text-sm font-bold uppercase">
          {date.toLocaleDateString(undefined, { month: "short" })}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="truncate text-xl font-bold text-[#121B2D]">
            Desk {formatDeskLabel(booking)}
          </h4>
          <Badge className="rounded-full bg-[#DDF6E7] px-2.5 py-1 text-xs font-bold text-[#15824C]">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            {formatStatus(booking.status)}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-[#65748A]">
          {details.map((detail) => (
            <span key={detail.label} className="flex items-center gap-1.5">
              <detail.icon className="h-4 w-4 text-[#3D8791]" />
              {detail.value}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden justify-self-end sm:block">
        <div className="relative h-[82px] w-[102px] overflow-hidden rounded-[14px] bg-[#F2F6FA]">
          <div className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#3D8791]">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>
          <div className="absolute bottom-3 left-6 h-10 w-16 rounded-t-md bg-white shadow-sm" />
          <div className="absolute bottom-10 left-8 h-7 w-12 rounded-t-md bg-[#3A4657]" />
          <div className="absolute bottom-4 right-5 h-9 w-3 rounded-t-full bg-[#5BB18F]" />
          <div className="absolute bottom-4 right-8 h-12 w-3 rounded-t-full bg-[#79BDA8]" />
          <MoreVertical className="absolute right-3 top-3 h-5 w-5 text-[#3D8791]" />
        </div>
      </div>
    </li>
  );
}

function getBookingDetails(booking: DeskBooking) {
  const zone = booking.office_desks?.office_zones?.zone_code;
  const desk = booking.office_desks?.desk_code;
  const details = [
    zone ? { label: "zone", value: `Zone ${zone}`, icon: MapPin } : null,
    desk ? { label: "desk", value: `Desk ${desk}`, icon: Armchair } : null,
    { label: "date", value: formatDateLong(booking.booking_date), icon: CalendarCheck },
    { label: "time", value: formatBookingTime(booking.booking_notes), icon: Clock3 },
  ];

  return details.filter(Boolean) as { label: string; value: string; icon: typeof Armchair }[];
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
      <Badge className="rounded-full bg-[#DDF6E7] px-3 py-1 text-[#15824C]">
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
        Available
      </Badge>
    );
  if (status.kind === "booked")
    return (
      <Badge className="rounded-full bg-[#EAF5F7] px-3 py-1 text-[#3D8791] hover:bg-[#EAF5F7] hover:text-[#3D8791]">
        Confirmed booking
      </Badge>
    );
  if (status.kind === "past")
    return (
      <Badge variant="secondary" className="rounded-full px-3 py-1">
        Past date
      </Badge>
    );
  if (status.kind === "weekend")
    return (
      <Badge variant="secondary" className="rounded-full px-3 py-1">
        Weekend, bookings disabled
      </Badge>
    );
  if (status.kind === "too-far")
    return (
      <Badge variant="secondary" className="rounded-full px-3 py-1">
        Only 7 days ahead allowed
      </Badge>
    );
  return (
    <Badge className="rounded-full bg-[#FFF1F1] px-3 py-1 text-[#D92D20]">
      Holiday: {status.name}
    </Badge>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDeskLabel(booking: DeskBooking) {
  const zone = booking.office_desks?.office_zones?.zone_code;
  const desk = booking.office_desks?.desk_code;
  if (zone && desk) return `${zone}-${desk}`;
  return desk ?? "unknown";
}

function formatBookingTime(notes: string | null) {
  const timeLine = notes?.split("\n").find((line) => /^Time:\s*/i.test(line));
  return timeLine?.replace(/^Time:\s*/i, "") || "Full day";
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
