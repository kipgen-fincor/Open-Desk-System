import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-ClAvyAop.mjs";
import { C as Card } from "./card-C89kbWPr.mjs";
import { u as useAuth, B as Button, s as supabase } from "./router-ZrQEyTVT.mjs";
import { B as Badge } from "./badge-DpPrSDL1.mjs";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DE1ZPB4n.mjs";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-8pY7VAnP.mjs";
import { b as todayISODateIST, f as formatDateLong, c as canCancel } from "./date-utils-DlrBZFJO.mjs";
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
import "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-alert-dialog.mjs";
function MyBookings() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "My bookings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "desks", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "desks", children: "Desks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "rooms", children: "Rooms" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "desks", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeskBookings, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "rooms", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoomBookings, {}) })
    ] })
  ] });
}
function DeskBookings() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const today = todayISODateIST();
  const {
    data: bookings = []
  } = useQuery({
    queryKey: ["all-my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_bookings").select("id, booking_date, status, booking_notes, office_desks(desk_code, office_zones(zone_code))").eq("user_id", user.id).order("booking_date", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  const upcoming = bookings.filter((b) => b.booking_date >= today && b.status === "confirmed");
  const cancel = async (id, date) => {
    if (!canCancel(date)) {
      toast.error("Cancellation closed (after 6 PM IST on booking day)");
      return;
    }
    if (!user) return;
    const {
      error
    } = await supabase.from("office_bookings").update({
      status: "cancelled",
      cancelled_by_user_id: user.id
    }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Booking cancelled");
      qc.invalidateQueries({
        queryKey: ["all-my-bookings", user.id]
      });
      qc.invalidateQueries({
        queryKey: ["my-bookings", user.id]
      });
      try {
        await supabase.from("office_audit_logs").insert({
          booking_id: id,
          action_type: "cancelled",
          performed_by_user_id: user.id,
          action_notes: `Booking cancelled for date ${date}`,
          action: "cancelled",
          table_name: "office_bookings",
          record_id: id
        });
      } catch (e) {
        console.error("Audit log insert failed", e);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: upcoming.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No upcoming desk bookings." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: upcoming.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-wrap items-center justify-between gap-3 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: formatDateLong(b.booking_date) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        "Desk ",
        b.office_desks?.office_zones?.zone_code,
        "-",
        b.office_desks?.desk_code,
        b.booking_notes ? ` · ${formatBookingNotes(b.booking_notes)}` : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground capitalize", children: b.status }),
      canCancel(b.booking_date) ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => cancel(b.id, b.booking_date), children: "Cancel" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Locked" })
    ] })
  ] }, b.id)) }) });
}
function RoomBookings() {
  const {
    user
  } = useAuth();
  const today = todayISODateIST();
  const [confirmCancel, setConfirmCancel] = reactExports.useState(null);
  const {
    data: bookings = [],
    refetch
  } = useQuery({
    queryKey: ["my-room-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("room_bookings").select("id, booking_date, start_time, end_time, title, status, office_rooms(room_code, room_name)").eq("user_id", user.id).order("booking_date", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const upcoming = bookings.filter((b) => b.booking_date >= today && b.status === "confirmed");
  const doCancel = async () => {
    if (!confirmCancel || !user) return;
    const id = confirmCancel.id;
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
    await refetch();
    try {
      await supabase.from("room_audit_logs").insert({
        room_booking_id: id,
        action_type: "cancelled",
        performed_by_user_id: user.id,
        action_notes: `Room booking cancelled`,
        action: "cancelled",
        table_name: "room_bookings",
        record_id: id
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: upcoming.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No upcoming room bookings." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: upcoming.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-wrap items-center justify-between gap-3 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
          b.office_rooms?.room_code,
          " — ",
          b.office_rooms?.room_name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          formatDateLong(b.booking_date),
          " · ",
          b.start_time?.slice(0, 5),
          "–",
          b.end_time?.slice(0, 5),
          b.title ? ` · ${b.title}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground capitalize", children: b.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setConfirmCancel({
          id: b.id,
          date: b.booking_date
        }), children: "Cancel" })
      ] })
    ] }, b.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirmCancel, onOpenChange: (v) => !v && setConfirmCancel(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Cancel room booking?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will release the slot. The booking will remain in your history as cancelled." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Keep booking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: doCancel, children: "Cancel booking" })
      ] })
    ] }) })
  ] });
}
function formatBookingNotes(notes) {
  const firstLine = notes.split("\n")[0]?.trim() ?? notes;
  return firstLine.replace(/^Time:\s*/i, "");
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MyBookings, {}) });
export {
  SplitComponent as component
};
