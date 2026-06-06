import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-C89kbWPr.mjs";
import { u as useAuth, B as Button, s as supabase, D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, L as Label, S as Select, g as SelectTrigger, h as SelectValue, e as SelectContent, f as SelectItem, b as DialogFooter } from "./router-ZrQEyTVT.mjs";
import { B as Badge } from "./badge-DpPrSDL1.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-BxQP3X5p.mjs";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-8pY7VAnP.mjs";
import { f as formatDateLong } from "./date-utils-DlrBZFJO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
function AdminRoomBookings() {
  const qc = useQueryClient();
  const {
    user
  } = useAuth();
  const [confirmCancel, setConfirmCancel] = reactExports.useState(null);
  const [changeBooking, setChangeBooking] = reactExports.useState(null);
  const {
    data: bookings = []
  } = useQuery({
    queryKey: ["admin-all-room-bookings"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("room_bookings").select("id, room_id, booking_date, start_time, end_time, attendees_count, title, status, user_profiles!room_bookings_user_id_fkey(full_name, email), office_rooms(room_code, room_name)").order("booking_date", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const doCancel = async () => {
    if (!confirmCancel || !user) return;
    const id = confirmCancel;
    const {
      error
    } = await supabase.from("room_bookings").update({
      status: "cancelled",
      cancelled_by_user_id: user.id
    }).eq("id", id);
    setConfirmCancel(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Room booking cancelled");
    qc.invalidateQueries({
      queryKey: ["admin-all-room-bookings"]
    });
    try {
      await supabase.from("room_audit_logs").insert({
        room_booking_id: id,
        action_type: "cancelled_by_admin",
        performed_by_user_id: user.id,
        action_notes: "Cancelled by admin",
        action: "cancelled",
        table_name: "room_bookings",
        record_id: id
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "All room bookings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Room" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Attendees" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: bookings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 8, className: "text-center text-sm text-muted-foreground", children: "No room bookings." }) }) : bookings.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: b.user_profiles?.full_name || b.user_profiles?.email || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
          b.office_rooms?.room_code,
          " — ",
          b.office_rooms?.room_name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDateLong(b.booking_date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-xs", children: [
          b.start_time?.slice(0, 5),
          "–",
          b.end_time?.slice(0, 5)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: b.attendees_count ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: b.title || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: b.status === "confirmed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground capitalize", children: b.status }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-destructive text-destructive-foreground capitalize", children: b.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right space-x-2", children: b.status === "confirmed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setChangeBooking(b), children: "Change Room" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setConfirmCancel(b.id), children: "Cancel" })
        ] }) })
      ] }, b.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirmCancel, onOpenChange: (v) => !v && setConfirmCancel(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Cancel this room booking?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "The room slot will be released. This action is logged in the audit trail." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Keep" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: doCancel, children: "Cancel booking" })
      ] })
    ] }) }),
    changeBooking && /* @__PURE__ */ jsxRuntimeExports.jsx(ChangeRoomDialog, { booking: changeBooking, onClose: () => {
      setChangeBooking(null);
      qc.invalidateQueries({
        queryKey: ["admin-all-room-bookings"]
      });
    } })
  ] });
}
function ChangeRoomDialog({
  booking,
  onClose
}) {
  const {
    user: admin
  } = useAuth();
  const [roomId, setRoomId] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const date = booking.booking_date;
  const start = booking.start_time;
  const end = booking.end_time;
  const oldRoomCode = booking.office_rooms?.room_code ?? "—";
  const {
    data: allRooms = []
  } = useQuery({
    queryKey: ["admin-active-rooms"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("office_rooms").select("id, room_code, room_name").eq("is_active", true).order("room_code");
      return data ?? [];
    }
  });
  const {
    data: dayBookings = []
  } = useQuery({
    queryKey: ["admin-room-bookings-day", date],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("room_bookings").select("id, room_id, start_time, end_time").eq("booking_date", date).eq("status", "confirmed");
      return data ?? [];
    }
  });
  const conflictingRoomIds = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const b of dayBookings) {
      if (b.id === booking.id) continue;
      if (b.start_time < end && b.end_time > start) {
        set.add(b.room_id);
      }
    }
    return set;
  }, [dayBookings, booking.id, start, end]);
  const availableRooms = reactExports.useMemo(() => allRooms.filter((r) => !conflictingRoomIds.has(r.id) && r.id !== booking.room_id), [allRooms, conflictingRoomIds, booking.room_id]);
  const submit = async () => {
    if (!admin) return;
    if (!roomId) {
      toast.error("Select a room");
      return;
    }
    setBusy(true);
    const newRoom = allRooms.find((r) => r.id === roomId);
    const newRoomCode = newRoom?.room_code ?? "—";
    const {
      error
    } = await supabase.from("room_bookings").update({
      room_id: roomId
    }).eq("id", booking.id);
    setBusy(false);
    if (error) {
      if (error?.code === "23P01") {
        toast.error("That room is already booked for this time slot.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success(`Room successfully changed to ${newRoomCode}`);
    try {
      await supabase.from("room_audit_logs").insert({
        room_booking_id: booking.id,
        action_type: "room_changed_by_admin",
        performed_by_user_id: admin.id,
        action_notes: `Room changed from ${oldRoomCode} to ${newRoomCode}`,
        action: "updated",
        table_name: "room_bookings",
        record_id: booking.id
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Change room" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground space-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Employee:" }),
          " ",
          booking.user_profiles?.full_name || booking.user_profiles?.email || "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Current room:" }),
          " ",
          oldRoomCode,
          " — ",
          booking.office_rooms?.room_name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Date:" }),
          " ",
          formatDateLong(date)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Time:" }),
          " ",
          start?.slice(0, 5),
          "–",
          end?.slice(0, 5)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "New room" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: roomId, onValueChange: setRoomId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select available room" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: availableRooms.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 text-xs text-muted-foreground", children: "No other rooms available for this time" }) : availableRooms.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: r.id, children: [
            r.room_code,
            " — ",
            r.room_name
          ] }, r.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy || !roomId, children: busy ? "Saving…" : "Change room" })
    ] })
  ] }) });
}
export {
  AdminRoomBookings as component
};
