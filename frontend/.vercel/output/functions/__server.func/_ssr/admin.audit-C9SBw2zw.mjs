import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { B as Badge } from "./badge-DiqzpQTy.mjs";
import { B as Button, j as cn, s as supabase } from "./router-BFWygh1D.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-CQ5TTuH3.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
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
function AuditAdmin() {
  const [filter, setFilter] = reactExports.useState("all");
  const {
    data: rows = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: async () => {
      const [deskLogs, roomLogs] = await Promise.all([supabase.from("office_audit_logs").select("id, action, action_type, created_at, booking_type, booking_id, user_profiles!office_audit_logs_performed_by_user_id_fkey(full_name)").order("created_at", {
        ascending: false
      }), supabase.from("room_audit_logs").select("id, action, action_type, created_at, room_booking_id, user_profiles!room_audit_logs_performed_by_user_id_fkey(full_name)").order("created_at", {
        ascending: false
      })]);
      if (deskLogs.error) throw deskLogs.error;
      if (roomLogs.error) throw roomLogs.error;
      const rawDeskLogs = deskLogs.data ?? [];
      const rawRoomLogs = roomLogs.data ?? [];
      const bookingIds = Array.from(new Set(rawDeskLogs.map((r) => r.booking_id).filter((v) => v !== null && v !== void 0)));
      const roomBookingIds = Array.from(new Set(rawRoomLogs.map((r) => r.room_booking_id).filter((v) => v !== null && v !== void 0)));
      const deskCodeByBookingId = {};
      if (bookingIds.length > 0) {
        const {
          data: officeBookings,
          error: officeBookingsError
        } = await supabase.from("office_bookings").select("id, desk_id").in("id", bookingIds);
        if (officeBookingsError) throw officeBookingsError;
        const typedOfficeBookings = officeBookings ?? [];
        const deskIds = Array.from(new Set(typedOfficeBookings.map((b) => b.desk_id).filter((v) => !!v)));
        let desks = [];
        if (deskIds.length > 0) {
          const {
            data: officeDesks,
            error: officeDesksError
          } = await supabase.from("office_desks").select("id, desk_code").in("id", deskIds);
          if (officeDesksError) throw officeDesksError;
          desks = officeDesks ?? [];
        }
        const deskCodeById = {};
        for (const d of desks) deskCodeById[d.id] = d.desk_code ?? null;
        for (const b of typedOfficeBookings) {
          deskCodeByBookingId[b.id] = b.desk_id ? deskCodeById[b.desk_id] ?? null : null;
        }
      }
      const roomNameByBookingId = {};
      if (roomBookingIds.length > 0) {
        const {
          data: roomBookings,
          error: roomBookingsError
        } = await supabase.from("room_bookings").select("id, room_id").in("id", roomBookingIds);
        if (roomBookingsError) throw roomBookingsError;
        const typedRoomBookings = roomBookings ?? [];
        const roomIds = Array.from(new Set(typedRoomBookings.map((b) => b.room_id).filter((v) => !!v)));
        let rooms = [];
        if (roomIds.length > 0) {
          const {
            data: officeRooms,
            error: officeRoomsError
          } = await supabase.from("office_rooms").select("id, room_name, room_code").in("id", roomIds);
          if (officeRoomsError) throw officeRoomsError;
          rooms = officeRooms ?? [];
        }
        const roomNameById = {};
        for (const r of rooms) {
          roomNameById[r.id] = {
            name: r.room_name ?? null,
            code: r.room_code ?? null
          };
        }
        for (const b of typedRoomBookings) {
          const rr = b.room_id ? roomNameById[b.room_id] : void 0;
          roomNameByBookingId[b.id] = rr?.name ?? rr?.code ?? null;
        }
      }
      const deskRows = rawDeskLogs.map((r) => ({
        id: r.id,
        action: r.action ?? r.action_type ?? "—",
        created_at: r.created_at,
        user: getUserFullName(r.user_profiles),
        source: "desk",
        booking: r.booking_id ? deskCodeByBookingId[r.booking_id] ?? null : null
      }));
      const roomRows = rawRoomLogs.map((r) => ({
        id: r.id,
        action: r.action ?? r.action_type ?? "—",
        created_at: r.created_at,
        user: getUserFullName(r.user_profiles),
        source: "room",
        booking: r.room_booking_id ? roomNameByBookingId[r.room_booking_id] ?? null : null
      }));
      return [...deskRows, ...roomRows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  });
  const filteredRows = filter === "all" ? rows : rows.filter((row) => row.source === filter);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-sm text-destructive", children: [
    "Failed to load audit logs: ",
    error.message
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-border p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterButton, { active: filter === "all", onClick: () => setFilter("all"), children: "All" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterButton, { active: filter === "desk", onClick: () => setFilter("desk"), children: "Desk Bookings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterButton, { active: filter === "room", onClick: () => setFilter("room"), children: "Room Bookings" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "When" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Booking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "User" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center text-sm text-muted-foreground", children: "Loading..." }) }) : filteredRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center text-sm text-muted-foreground", children: "No audit entries." }) }) : filteredRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "whitespace-nowrap text-sm text-muted-foreground", children: new Date(row.created_at).toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBadge, { action: row.action }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { source: row.source }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: row.booking || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: row.user || "—" })
      ] }, `${row.source}-${row.id}`)) })
    ] })
  ] }) });
}
function getUserFullName(profile) {
  if (Array.isArray(profile)) return profile[0]?.full_name ?? null;
  return profile?.full_name ?? null;
}
function FilterButton({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: active ? "default" : "outline", className: cn(!active && "bg-card"), onClick, children });
}
function ActionBadge({
  action
}) {
  const normalized = action.replace(/[\s-]+/g, "_").toUpperCase();
  const colorClass = getActionBadgeClass(normalized);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("rounded-full px-2.5 py-0.5 text-xs font-medium", colorClass), children: action });
}
function getActionBadgeClass(action) {
  if (/(CREATE|CREATED|BOOKING_CREATED|SUCCESS|ASSIGNED)/.test(action)) {
    return "bg-emerald-100 text-emerald-800";
  }
  if (/(UPDATE|MODIFIED|CHANGE|CHANGED|EDIT)/.test(action)) {
    return "bg-teal-100 text-teal-800";
  }
  if (/(CANCEL|DELETE|REMOVED|RELEASED)/.test(action)) {
    return "bg-red-100 text-red-800";
  }
  if (/(LOGIN|AUTH)/.test(action)) {
    return "bg-indigo-100 text-indigo-800";
  }
  if (/(SYSTEM|AUTO_RELEASE|AUTO)/.test(action)) {
    return "bg-amber-100 text-amber-800";
  }
  if (/(ERROR|FAILED|FAILURE)/.test(action)) {
    return "bg-red-100 text-red-800";
  }
  return "bg-slate-100 text-slate-700";
}
function TypeBadge({
  source
}) {
  if (source === "room") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-secondary text-secondary-foreground", children: "Room" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-muted text-muted-foreground", children: "Desk" });
}
export {
  AuditAdmin as component
};
