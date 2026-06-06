import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useParams, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-B9H2tZp4.mjs";
import { u as useAuth, B as Button, j as cn, s as supabase, D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, L as Label, S as Select, g as SelectTrigger, h as SelectValue, e as SelectContent, f as SelectItem, T as Textarea, b as DialogFooter } from "./router-BFWygh1D.mjs";
import { B as Badge } from "./badge-DiqzpQTy.mjs";
import { a as isWithinBookingWindow, i as isWeekend, f as formatDateLong, c as canCancel } from "./date-utils-DlrBZFJO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { O as OfficeMapBookingView } from "./office-map-booking-view-Dehdumgv.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger } from "./tabs-DTZmFI-d.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-CQ5TTuH3.mjs";
import { A as ArrowLeft, n as Monitor, a as ArrowUpDown, L as Lock, p as Presentation } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-tabs.mjs";
function buildTimeSlots(startH = 8, endH = 20) {
  const out = [];
  for (let h = startH; h <= endH; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === endH && m > 0) break;
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
}
const DESK_TIME_SLOTS = buildTimeSlots();
const FULL_DAY_START = "09:00";
const FULL_DAY_END = "17:00";
function formatTimeLabel(time) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
function formatTimeRange(start, end) {
  return `${formatTimeLabel(start)} – ${formatTimeLabel(end)}`;
}
function BookDeskDialog({
  desk,
  defaultDate,
  onClose
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const date = defaultDate;
  const [timeMode, setTimeMode] = reactExports.useState("full");
  const [startTime, setStartTime] = reactExports.useState(FULL_DAY_START);
  const [endTime, setEndTime] = reactExports.useState(FULL_DAY_END);
  const [message, setMessage] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [submitError, setSubmitError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setSubmitError(null);
  }, [defaultDate, desk.id]);
  reactExports.useEffect(() => {
    if (timeMode === "full") {
      setStartTime(FULL_DAY_START);
      setEndTime(FULL_DAY_END);
    }
  }, [timeMode]);
  const effectiveStart = timeMode === "full" ? FULL_DAY_START : startTime;
  const effectiveEnd = timeMode === "full" ? FULL_DAY_END : endTime;
  const minDurationInvalid = effectiveEnd <= effectiveStart;
  const dateBlocked = !isWithinBookingWindow(date) || isWeekend(date);
  const { data: holiday } = useQuery({
    queryKey: ["holiday", date],
    queryFn: async () => {
      const { data } = await supabase.from("office_holidays").select("holiday_name").eq("holiday_date", date).maybeSingle();
      return data?.holiday_name;
    }
  });
  const { data: deskTaken } = useQuery({
    queryKey: ["desk-booking-check", desk.id, date],
    queryFn: async () => {
      const { data } = await supabase.from("office_bookings").select("id, user_id").eq("desk_id", desk.id).eq("booking_date", date).eq("status", "confirmed").maybeSingle();
      return data;
    }
  });
  const { data: myBookingForDate } = useQuery({
    queryKey: ["my-booking-for-date", date, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("office_bookings").select("id, desk_id").eq("user_id", user.id).eq("booking_date", date).eq("status", "confirmed").maybeSingle();
      return data;
    }
  });
  const dateError = reactExports.useMemo(() => {
    if (holiday) return `Public holiday: ${holiday}`;
    if (isWeekend(date)) return "Weekends are not bookable";
    if (!isWithinBookingWindow(date)) return "Outside 7-day booking window";
    return null;
  }, [date, holiday]);
  const timeError = reactExports.useMemo(() => {
    if (minDurationInvalid) return "End time must be after start time";
    return null;
  }, [minDurationInvalid]);
  const availabilityError = reactExports.useMemo(() => {
    if (deskTaken && deskTaken.user_id !== user?.id) {
      return "This desk is already booked for the selected date";
    }
    if (myBookingForDate && myBookingForDate.desk_id !== desk.id) {
      return "You already have another desk booking on this date";
    }
    return null;
  }, [desk.id, deskTaken, myBookingForDate, user?.id]);
  const startSlots = DESK_TIME_SLOTS.filter((s) => s !== "20:00");
  const endSlots = DESK_TIME_SLOTS.filter((s) => s > effectiveStart);
  const invalidateBookingQueries = async (bookingDate, userId) => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["bookings", bookingDate] }),
      qc.invalidateQueries({ queryKey: ["my-booking-for-date", bookingDate, userId] }),
      qc.invalidateQueries({ queryKey: ["my-bookings", userId] }),
      qc.invalidateQueries({ queryKey: ["all-my-bookings", userId] }),
      qc.invalidateQueries({ queryKey: ["desk-booking-check", desk.id, bookingDate] })
    ]);
  };
  const submit = async () => {
    if (!user) return;
    setSubmitError(null);
    if (dateBlocked || dateError) {
      setSubmitError(dateError ?? "This date isn't bookable");
      return;
    }
    if (timeError) {
      setSubmitError(timeError);
      return;
    }
    if (availabilityError) {
      setSubmitError(availabilityError);
      return;
    }
    setBusy(true);
    const timeLabel = formatTimeRange(effectiveStart, effectiveEnd);
    const notesParts = [`Time: ${timeLabel}`];
    const trimmedMessage = message.trim();
    if (trimmedMessage) notesParts.push(trimmedMessage);
    const bookingNotes = notesParts.join("\n");
    const { data: inserted, error } = await supabase.from("office_bookings").insert({
      user_id: user.id,
      desk_id: desk.id,
      booking_date: date,
      status: "confirmed",
      booking_notes: bookingNotes
    }).select("id").single();
    setBusy(false);
    if (error || !inserted) {
      const msg = error?.message ?? "Could not create booking";
      setSubmitError(msg);
      return;
    }
    const deskLabel = `${desk.office_zones.zone_code}-${desk.desk_code}`;
    toast.success(`Seat confirmed — ${deskLabel} on ${formatDateLong(date)} (${timeLabel})`, {
      duration: 4e3
    });
    await invalidateBookingQueries(date, user.id);
    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: inserted.id,
        action_type: "created",
        performed_by_user_id: user.id,
        action_notes: `Booking created for ${date} ${effectiveStart}-${effectiveEnd}`,
        action: "created",
        table_name: "office_bookings",
        record_id: inserted.id
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg sm:rounded-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Book desk ",
        desk.office_zones.zone_code,
        "-",
        desk.desk_code
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: formatDateLong(date) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border bg-muted/30 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase text-muted-foreground", children: [
          "Zone ",
          desk.office_zones.zone_code,
          desk.office_zones.description ? ` · ${desk.office_zones.description}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-lg font-semibold", children: desk.desk_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeskFeatureList, { desk })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: timeMode === "full" ? "default" : "outline",
              onClick: () => {
                setTimeMode("full");
                setSubmitError(null);
              },
              children: [
                "Full day (",
                formatTimeRange(FULL_DAY_START, FULL_DAY_END),
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: timeMode === "custom" ? "default" : "outline",
              onClick: () => {
                setTimeMode("custom");
                setSubmitError(null);
              },
              children: "Custom time"
            }
          )
        ] }),
        timeMode === "custom" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Start" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: startTime,
                onValueChange: (v) => {
                  setStartTime(v);
                  if (endTime <= v) {
                    const i = DESK_TIME_SLOTS.indexOf(v);
                    setEndTime(DESK_TIME_SLOTS[i + 1] ?? "20:00");
                  }
                  setSubmitError(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: startSlots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "End" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: endTime,
                onValueChange: (v) => {
                  setEndTime(v);
                  setSubmitError(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: endSlots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                ]
              }
            ),
            timeError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: timeError })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: formatTimeRange(FULL_DAY_START, FULL_DAY_END) }),
        dateError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: dateError }),
        availabilityError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: availabilityError }),
        submitError && !dateError && !availabilityError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: submitError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bd-message", children: "Additional message (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "bd-message",
            rows: 2,
            value: message,
            onChange: (e) => setMessage(e.target.value),
            placeholder: "Any notes for your booking…"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: submit,
          disabled: busy || !!dateBlocked || !!dateError || !!timeError || !!availabilityError,
          children: busy ? "Confirming…" : "Confirm seat"
        }
      )
    ] })
  ] }) });
}
function DeskFeatureList({ desk }) {
  const items = [
    { icon: Monitor, label: "Monitor", on: desk.has_monitor },
    { icon: ArrowUpDown, label: "Standing", on: desk.has_standing_desk },
    { icon: Lock, label: "Locker", on: desk.has_locker },
    { icon: Presentation, label: "Whiteboard", on: desk.has_whiteboard }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: cn(
        "gap-1 text-xs",
        !it.on && "opacity-40"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "h-3 w-3" }),
        it.label
      ]
    },
    it.label
  )) });
}
function BookPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookView, {}) });
}
function BookView() {
  const {
    date
  } = useParams({
    from: "/book/$date"
  });
  const qc = useQueryClient();
  const {
    user
  } = useAuth();
  const [view, setView] = reactExports.useState("map");
  const [selectedDesk, setSelectedDesk] = reactExports.useState(null);
  const dateBlocked = !isWithinBookingWindow(date) || isWeekend(date);
  const {
    data: holiday
  } = useQuery({
    queryKey: ["holiday", date],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("office_holidays").select("holiday_name").eq("holiday_date", date).maybeSingle();
      return data?.holiday_name;
    }
  });
  const {
    data: desks = [],
    isLoading: desksLoading
  } = useQuery({
    queryKey: ["desks"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_desks").select("id, desk_code, has_monitor, has_standing_desk, has_locker, has_whiteboard, is_active, zone_id, office_zones(zone_code, description)").eq("is_active", true).order("desk_code");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: bookings = []
  } = useQuery({
    queryKey: ["bookings", date],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_bookings").select("id, desk_id, user_id, status, user_profiles!office_bookings_user_id_fkey(full_name, email)").eq("booking_date", date).eq("status", "confirmed");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: myBookingForDate
  } = useQuery({
    queryKey: ["my-booking-for-date", date, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("office_bookings").select("id, desk_id, booking_date").eq("user_id", user.id).eq("booking_date", date).eq("status", "confirmed").maybeSingle();
      return data;
    }
  });
  const bookedMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const b of bookings) {
      m.set(b.desk_id, {
        id: b.id,
        user_id: b.user_id,
        name: b.user_profiles?.full_name || b.user_profiles?.email || "Booked"
      });
    }
    return m;
  }, [bookings]);
  const cancelBooking = async (bookingId) => {
    if (!user) return;
    if (!canCancel(date)) {
      toast.error("Cancellation closed (after 6 PM IST)");
      return;
    }
    const {
      error
    } = await supabase.from("office_bookings").update({
      status: "cancelled",
      cancelled_by_user_id: user.id
    }).eq("id", bookingId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Booking cancelled");
    qc.invalidateQueries({
      queryKey: ["bookings", date]
    });
    qc.invalidateQueries({
      queryKey: ["my-booking-for-date", date, user.id]
    });
    qc.invalidateQueries({
      queryKey: ["my-bookings", user.id]
    });
    qc.invalidateQueries({
      queryKey: ["all-my-bookings", user.id]
    });
    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: bookingId,
        action_type: "cancelled",
        performed_by_user_id: user.id,
        action_notes: `Booking cancelled for date ${date}`,
        action: "cancelled",
        table_name: "office_bookings",
        record_id: bookingId
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
  };
  const openDeskDialog = (desk) => {
    if (!user) return;
    if (holiday || dateBlocked) {
      toast.error("This date isn't bookable");
      return;
    }
    setSelectedDesk(desk);
  };
  const selectionBlocked = (mine) => !!holiday || dateBlocked || !!myBookingForDate && !mine;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", asChild: true, className: "-ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }),
          " Back to calendar"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-semibold", children: formatDateLong(date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2", children: [
          holiday ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-destructive text-destructive-foreground", children: [
            "Public holiday: ",
            holiday
          ] }) : dateBlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: isWeekend(date) ? "Weekend — bookings disabled" : "Outside 7-day window" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground", children: "Bookable" }),
          myBookingForDate && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground", children: "You have a booking" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: view, onValueChange: (v) => setView(v), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "map", children: "Map" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "table", children: "Table" })
      ] }) })
    ] }),
    desksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-sm text-muted-foreground", children: "Loading desks…" }) : view === "map" ? /* @__PURE__ */ jsxRuntimeExports.jsx(OfficeMapBookingView, { desks, bookedMap, currentUserId: user?.id, disabledForBooking: (_, mine) => selectionBlocked(mine), onSelectDesk: (desk) => openDeskDialog(desk), mode: "desk" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Desk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Zone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: desks.map((d) => {
        const booked = bookedMap.get(d.id);
        const mine = booked && booked.user_id === user?.id;
        const disabled = selectionBlocked(!!mine);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: d.desk_code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: d.office_zones.zone_code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureIcons, { desk: d }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: mine ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground", children: "Your booking" }) : booked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-destructive text-destructive-foreground", children: [
            "Booked — ",
            booked.name
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground", children: "Available" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: mine ? canCancel(date) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => cancelBooking(booked.id), children: "Cancel" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Active · Locked" }) : booked ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", disabled, onClick: () => openDeskDialog(d), children: "Select" }) })
        ] }, d.id);
      }) })
    ] }) }),
    selectedDesk && /* @__PURE__ */ jsxRuntimeExports.jsx(BookDeskDialog, { desk: selectedDesk, defaultDate: date, onClose: () => setSelectedDesk(null) })
  ] });
}
function FeatureIcons({
  desk
}) {
  const items = [{
    icon: Monitor,
    label: "Monitor",
    on: desk.has_monitor
  }, {
    icon: ArrowUpDown,
    label: "Standing",
    on: desk.has_standing_desk
  }, {
    icon: Lock,
    label: "Locker",
    on: desk.has_locker
  }, {
    icon: Presentation,
    label: "Whiteboard",
    on: desk.has_whiteboard
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: it.label, className: cn("inline-flex h-6 w-6 items-center justify-center rounded border", it.on ? "border-secondary/40 bg-accent/40 text-foreground" : "border-border bg-muted text-muted-foreground/40"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "h-3.5 w-3.5" }) }, it.label)) });
}
export {
  BookPage as component
};
