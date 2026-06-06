import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-B9H2tZp4.mjs";
import { O as OfficeMapBookingView } from "./office-map-booking-view-Dehdumgv.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { u as useAuth, D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, L as Label, I as Input, S as Select, g as SelectTrigger, h as SelectValue, e as SelectContent, f as SelectItem, T as Textarea, b as DialogFooter, B as Button, s as supabase, j as cn } from "./router-BFWygh1D.mjs";
import { B as Badge } from "./badge-DiqzpQTy.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger } from "./tabs-DTZmFI-d.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-CQ5TTuH3.mjs";
import { b as todayISODateIST, a as isWithinBookingWindow, i as isWeekend, f as formatDateLong } from "./date-utils-DlrBZFJO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as Users, q as Projector, p as Presentation, V as Video } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("animate-pulse rounded-md bg-primary/10", className), ...props });
}
function RoomsPage() {
  const [view, setView] = reactExports.useState("map");
  const [bookingRoom, setBookingRoom] = reactExports.useState(null);
  const {
    data: desks = []
  } = useQuery({
    queryKey: ["desks-for-room-map"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_desks").select("id, desk_code, office_zones(zone_code, description)").eq("is_active", true).order("desk_code");
      if (error) throw error;
      return data;
    }
  });
  const {
    data: rooms = [],
    isLoading
  } = useQuery({
    queryKey: ["office-rooms"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_rooms").select("id, room_code, room_name, room_type, capacity, has_projector, has_whiteboard, has_video_conf, is_active").eq("is_active", true).order("room_code");
      if (error) throw error;
      return data;
    }
  });
  const meetingRooms = rooms.filter((r) => r.room_type === "meeting_room");
  const callRooms = rooms.filter((r) => r.room_type === "call_room");
  const emptyBookedMap = reactExports.useMemo(() => /* @__PURE__ */ new Map(), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Room Booking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Book meeting rooms and call booths from the office map." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: view, onValueChange: (v) => setView(v), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "map", children: "Map" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "table", children: "Table" })
      ] }) })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 text-sm text-muted-foreground", children: "Loading rooms..." }) : view === "map" ? /* @__PURE__ */ jsxRuntimeExports.jsx(OfficeMapBookingView, { desks, rooms, bookedMap: emptyBookedMap, disabledForBooking: () => true, onSelectDesk: () => void 0, onSelectRoom: setBookingRoom, mode: "room" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Room" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Capacity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: [...meetingRooms, ...callRooms].map((room) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: room.room_code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: room.room_name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: room.room_type === "meeting_room" ? "Meeting Room" : "Call Booth" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
          room.capacity
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoomFeatureBadges, { room }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => setBookingRoom(room), children: "Book" }) })
      ] }, room.id)) })
    ] }) }),
    bookingRoom && /* @__PURE__ */ jsxRuntimeExports.jsx(BookRoomDialog, { room: bookingRoom, onClose: () => setBookingRoom(null) })
  ] });
}
function RoomFeatureBadges({
  room
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 text-xs", children: [
    room.has_projector && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Projector, { className: "h-3 w-3" }),
      " Projector"
    ] }),
    room.has_whiteboard && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Presentation, { className: "h-3 w-3" }),
      " Whiteboard"
    ] }),
    room.has_video_conf && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-3 w-3" }),
      " Video Conf"
    ] })
  ] });
}
function buildSlots(startH = 8, endH = 20) {
  const out = [];
  for (let h = startH; h <= endH; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === endH && m > 0) break;
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
}
const ALL_SLOTS = buildSlots();
const TIMELINE_START_MINUTES = 8 * 60;
const TIMELINE_END_MINUTES = 20 * 60;
const TIMELINE_TOTAL_MINUTES = TIMELINE_END_MINUTES - TIMELINE_START_MINUTES;
const TIMELINE_PX_PER_MINUTE = 1.5;
const TIMELINE_HEIGHT = TIMELINE_TOTAL_MINUTES * TIMELINE_PX_PER_MINUTE;
function timeToMinutes(time) {
  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
}
function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
function rangesOverlap(startA, endA, startB, endB) {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(endA) > timeToMinutes(startB);
}
function BookRoomDialog({
  room,
  onClose
}) {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const today = todayISODateIST();
  const [date, setDate] = reactExports.useState(today);
  const [startTime, setStartTime] = reactExports.useState("09:00");
  const [endTime, setEndTime] = reactExports.useState("09:15");
  const [title, setTitle] = reactExports.useState("");
  const [attendees, setAttendees] = reactExports.useState(2);
  const [notes, setNotes] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [timeInteracted, setTimeInteracted] = reactExports.useState(false);
  const startSlots = ALL_SLOTS.filter((s) => s !== "20:00");
  const endSlots = ALL_SLOTS.filter((s) => s > startTime);
  const minDurationInvalid = endTime <= startTime;
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
    data: existing = [],
    isFetching: existingFetching
  } = useQuery({
    queryKey: ["room-bookings", room.id, date],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("room_bookings").select("id, start_time, end_time, title, user_profiles!room_bookings_user_id_fkey(full_name)").eq("room_id", room.id).eq("booking_date", date).eq("status", "confirmed").order("start_time");
      if (error) throw error;
      return data;
    }
  });
  const selectedTimeOverlaps = reactExports.useMemo(() => !minDurationInvalid && existing.some((b) => rangesOverlap(startTime, endTime, b.start_time, b.end_time)), [endTime, existing, minDurationInvalid, startTime]);
  const previewConflicts = timeInteracted && selectedTimeOverlaps;
  const selectTimelineStart = (slot) => {
    setTimeInteracted(true);
    setStartTime(slot);
    if (endTime <= slot) {
      const i = ALL_SLOTS.indexOf(slot);
      setEndTime(ALL_SLOTS[i + 1] ?? "20:00");
    }
  };
  const submit = async () => {
    if (!user) return;
    if (dateBlocked) {
      toast.error("This date isn't bookable");
      return;
    }
    if (holiday) {
      toast.error("That date is a public holiday");
      return;
    }
    if (minDurationInvalid) {
      toast.error("Minimum booking duration is 15 minutes");
      return;
    }
    if (attendees < 1 || attendees > room.capacity) {
      toast.error(`Attendees must be 1–${room.capacity}`);
      return;
    }
    setBusy(true);
    const {
      data: inserted,
      error
    } = await supabase.from("room_bookings").insert({
      room_id: room.id,
      user_id: user.id,
      booking_date: date,
      start_time: startTime,
      end_time: endTime,
      title: title.trim() || null,
      attendees_count: attendees,
      status: "confirmed",
      booking_notes: notes.trim() || null
    }).select("id").single();
    setBusy(false);
    if (error || !inserted) {
      const msg = error?.message || "";
      const bookingError = error;
      const detail = (bookingError?.details || "") + " " + msg;
      if (bookingError?.code === "23P01" || /overlap|exclude|conflict/i.test(msg)) {
        if (/no_user_room_overlap/i.test(detail)) {
          toast.error("You already have a room booking during this time. Please finish or cancel your existing booking before booking another room.");
        } else {
          toast.error("This room is already booked for that time slot. Please choose a different time.");
        }
      } else {
        toast.error(msg || "Could not create booking");
      }
      return;
    }
    toast.success(`Booked ${room.room_code}`);
    qc.invalidateQueries({
      queryKey: ["room-bookings", room.id, date]
    });
    qc.invalidateQueries({
      queryKey: ["my-room-bookings", user.id]
    });
    try {
      await supabase.from("room_audit_logs").insert({
        room_booking_id: inserted.id,
        action_type: "created",
        performed_by_user_id: user.id,
        action_notes: `Room booking created for ${date} ${startTime}-${endTime}`,
        action: "created",
        table_name: "room_bookings",
        record_id: inserted.id
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-h-[calc(100dvh-3rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "shrink-0 border-b border-border px-4 py-3 pr-10 sm:px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      "Book ",
      room.room_code,
      " — ",
      room.room_name
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rb-date", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "rb-date", type: "date", value: date, min: today, onChange: (e) => setDate(e.target.value) }),
          holiday && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive", children: [
            "Public holiday: ",
            holiday
          ] }),
          isWeekend(date) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Weekends are not bookable" }),
          !isWithinBookingWindow(date) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Outside 7-day booking window" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "rb-att", children: [
            "Attendees (max ",
            room.capacity,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "rb-att", type: "number", min: 1, max: room.capacity, value: attendees, onChange: (e) => setAttendees(Number(e.target.value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Start" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: startTime, onValueChange: (v) => {
            setTimeInteracted(true);
            setStartTime(v);
            if (endTime <= v) {
              const i = ALL_SLOTS.indexOf(v);
              setEndTime(ALL_SLOTS[i + 1] ?? "20:00");
            }
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: startSlots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "End" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: endTime, onValueChange: (v) => {
            setTimeInteracted(true);
            setEndTime(v);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: endSlots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
          ] }),
          minDurationInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Minimum booking duration is 15 minutes" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rb-title", children: "Title (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "rb-title", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Sprint Planning" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rb-notes", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "rb-notes", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value), className: "min-h-16" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RoomDayTimeline, { date, bookings: existing, isLoading: existingFetching, startTime, endTime, title, conflicts: previewConflicts, onSelectStart: selectTimelineStart }),
      previewConflicts && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Conflicts with an existing booking" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "shrink-0 gap-2 border-t border-border px-4 py-3 sm:px-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy || dateBlocked || !!holiday || previewConflicts, children: busy ? "Booking…" : "Confirm booking" })
    ] })
  ] }) });
}
function RoomDayTimeline({
  date,
  bookings,
  isLoading,
  startTime,
  endTime,
  title,
  conflicts,
  onSelectStart
}) {
  const scrollRef = reactExports.useRef(null);
  const hours = Array.from({
    length: 12
  }, (_, i) => i + 8);
  reactExports.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [date]);
  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const rawMinutes = Math.floor((event.clientY - rect.top) / TIMELINE_PX_PER_MINUTE);
    const snappedMinutes = Math.floor(rawMinutes / 15) * 15;
    const absoluteMinutes = TIMELINE_START_MINUTES + snappedMinutes;
    const cappedMinutes = Math.min(absoluteMinutes, TIMELINE_END_MINUTES - 15);
    onSelectStart(minutesToTime(cappedMinutes));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "block", children: [
      "Timeline on ",
      formatDateLong(date)
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-md border border-border p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: scrollRef, className: "max-h-[min(34vh,15rem)] overflow-y-auto rounded-md border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid cursor-pointer grid-cols-[56px_1fr]", style: {
      height: TIMELINE_HEIGHT
    }, onClick: handleClick, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative border-r border-border bg-muted/35", children: hours.map((hour) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 right-0 px-2 pt-1 text-xs font-medium text-muted-foreground", style: {
        top: (hour * 60 - TIMELINE_START_MINUTES) * TIMELINE_PX_PER_MINUTE,
        height: 60 * TIMELINE_PX_PER_MINUTE
      }, children: [
        String(hour).padStart(2, "0"),
        ":00"
      ] }, hour)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        hours.map((hour) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 border-b border-border", style: {
          top: (hour * 60 - TIMELINE_START_MINUTES) * TIMELINE_PX_PER_MINUTE,
          height: 60 * TIMELINE_PX_PER_MINUTE
        }, children: [15, 30, 45].map((minute) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 border-t border-dashed border-border/70", style: {
          top: minute * TIMELINE_PX_PER_MINUTE
        } }, minute)) }, hour)),
        bookings.map((booking, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineBlock, { booking, index }, booking.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewTimelineBlock, { startTime, endTime, title, conflicts })
      ] })
    ] }) })
  ] });
}
function TimelineBlock({
  booking,
  index
}) {
  const top = (timeToMinutes(booking.start_time) - TIMELINE_START_MINUTES) * TIMELINE_PX_PER_MINUTE;
  const height = Math.max((timeToMinutes(booking.end_time) - timeToMinutes(booking.start_time)) * TIMELINE_PX_PER_MINUTE, 22);
  const profile = Array.isArray(booking.user_profiles) ? booking.user_profiles[0] : booking.user_profiles;
  const label = `${booking.title || "Booked"} · ${profile?.full_name || "Employee"} · ${booking.start_time.slice(0, 5)}–${booking.end_time.slice(0, 5)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: (event) => event.stopPropagation(), className: index % 2 === 0 ? "absolute left-2 right-2 overflow-hidden rounded-md bg-primary px-2 py-1 text-xs font-medium leading-tight text-primary-foreground shadow-sm" : "absolute left-2 right-2 overflow-hidden rounded-md bg-destructive px-2 py-1 text-xs font-medium leading-tight text-destructive-foreground shadow-sm", style: {
    top,
    height
  }, title: label, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: label }) });
}
function PreviewTimelineBlock({
  startTime,
  endTime,
  title,
  conflicts
}) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (end <= start) return null;
  const top = (start - TIMELINE_START_MINUTES) * TIMELINE_PX_PER_MINUTE;
  const height = Math.max((end - start) * TIMELINE_PX_PER_MINUTE, 22);
  const label = `${title.trim() || "New booking"} · ${startTime}–${endTime}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: (event) => event.stopPropagation(), className: conflicts ? "absolute left-4 right-4 overflow-hidden rounded-md border border-destructive bg-destructive/75 px-2 py-1 text-xs font-medium leading-tight text-destructive-foreground shadow-sm" : "absolute left-4 right-4 overflow-hidden rounded-md border border-primary bg-primary/75 px-2 py-1 text-xs font-medium leading-tight text-primary-foreground shadow-sm", style: {
    top,
    height
  }, title: label, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: label }) });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoomsPage, {}) });
export {
  BookRoomDialog,
  SplitComponent as component
};
