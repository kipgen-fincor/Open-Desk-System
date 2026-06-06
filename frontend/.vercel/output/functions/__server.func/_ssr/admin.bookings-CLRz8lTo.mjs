import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { u as useAuth, B as Button, s as supabase, D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, L as Label, S as Select, g as SelectTrigger, h as SelectValue, e as SelectContent, f as SelectItem, I as Input, T as Textarea, b as DialogFooter } from "./router-BFWygh1D.mjs";
import { B as Badge } from "./badge-DiqzpQTy.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-CQ5TTuH3.mjs";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-BDUtYks1.mjs";
import { f as formatDateLong, b as todayISODateIST, a as isWithinBookingWindow, i as isWeekend } from "./date-utils-DlrBZFJO.mjs";
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
function AdminBookings() {
  const qc = useQueryClient();
  const {
    user
  } = useAuth();
  const [confirmCancel, setConfirmCancel] = reactExports.useState(null);
  const [assignOpen, setAssignOpen] = reactExports.useState(false);
  const [changeBooking, setChangeBooking] = reactExports.useState(null);
  const {
    data: bookings = []
  } = useQuery({
    queryKey: ["admin-all-bookings"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_bookings").select("id, booking_date, status, created_at, user_id, desk_id, user_profiles!office_bookings_user_id_fkey(full_name, email), office_desks(desk_code, office_zones(zone_code))").order("booking_date", {
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
    } = await supabase.from("office_bookings").update({
      status: "cancelled",
      cancelled_by_user_id: user.id
    }).eq("id", id);
    setConfirmCancel(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Booking cancelled");
    qc.invalidateQueries({
      queryKey: ["admin-all-bookings"]
    });
    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: id,
        action_type: "cancelled_by_admin",
        performed_by_user_id: user.id,
        action_notes: "Cancelled by admin",
        action: "cancelled",
        table_name: "office_bookings",
        record_id: id
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "All bookings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setAssignOpen(true), children: "Assign desk" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Desk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: bookings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center text-sm text-muted-foreground", children: "No bookings." }) }) : bookings.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: b.user_profiles?.full_name || b.user_profiles?.email || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
          b.office_desks?.office_zones?.zone_code,
          "-",
          b.office_desks?.desk_code
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDateLong(b.booking_date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: b.status === "confirmed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground capitalize", children: b.status }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-destructive text-destructive-foreground capitalize", children: b.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: b.created_at ? new Date(b.created_at).toLocaleDateString() : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right space-x-2", children: b.status === "confirmed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setChangeBooking(b), children: "Change Desk" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setConfirmCancel(b.id), children: "Cancel" })
        ] }) })
      ] }, b.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirmCancel, onOpenChange: (v) => !v && setConfirmCancel(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Cancel this booking?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "The booking will be marked cancelled and the desk released. This is logged in the audit trail." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Keep" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: doCancel, children: "Cancel booking" })
      ] })
    ] }) }),
    assignOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(AssignDeskDialog, { onClose: () => {
      setAssignOpen(false);
      qc.invalidateQueries({
        queryKey: ["admin-all-bookings"]
      });
    } }),
    changeBooking && /* @__PURE__ */ jsxRuntimeExports.jsx(ChangeDeskDialog, { booking: changeBooking, onClose: () => {
      setChangeBooking(null);
      qc.invalidateQueries({
        queryKey: ["admin-all-bookings"]
      });
    } })
  ] });
}
function ChangeDeskDialog({
  booking,
  onClose
}) {
  const {
    user: admin
  } = useAuth();
  const [deskId, setDeskId] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const date = booking.booking_date;
  const oldDeskCode = `${booking.office_desks?.office_zones?.zone_code}-${booking.office_desks?.desk_code}`;
  const {
    data: allDesks = []
  } = useQuery({
    queryKey: ["admin-active-desks-change"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("office_desks").select("id, desk_code, office_zones(zone_code)").eq("is_active", true).order("desk_code");
      return data ?? [];
    }
  });
  const {
    data: bookedIds = []
  } = useQuery({
    queryKey: ["admin-booked-desk-ids-change", date],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("office_bookings").select("desk_id").eq("booking_date", date).eq("status", "confirmed");
      return (data ?? []).map((r) => r.desk_id);
    }
  });
  const availableDesks = reactExports.useMemo(() => allDesks.filter((d) => !bookedIds.includes(d.id) || d.id === booking.desk_id), [allDesks, bookedIds, booking.desk_id]).filter((d) => d.id !== booking.desk_id);
  const submit = async () => {
    if (!admin) return;
    if (!deskId) {
      toast.error("Select a desk");
      return;
    }
    setBusy(true);
    const newDesk = allDesks.find((d) => d.id === deskId);
    const newDeskCode = `${newDesk?.office_zones?.zone_code}-${newDesk?.desk_code}`;
    const {
      error
    } = await supabase.from("office_bookings").update({
      desk_id: deskId,
      booking_notes: notes.trim() || null
    }).eq("id", booking.id);
    setBusy(false);
    if (error) {
      if (error?.code === "23505" || /duplicate|unique|conflict/i.test(error.message)) {
        toast.error("That desk is already taken for this date.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success(`Desk successfully changed to ${newDeskCode}`);
    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: booking.id,
        action_type: "desk_changed_by_admin",
        performed_by_user_id: admin.id,
        action_notes: `Desk changed from ${oldDeskCode} to ${newDeskCode}${notes.trim() ? ` — ${notes.trim()}` : ""}`,
        action: "updated",
        table_name: "office_bookings",
        record_id: booking.id
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Change desk" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Employee:" }),
          " ",
          booking.user_profiles?.full_name || booking.user_profiles?.email || "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Current desk:" }),
          " ",
          oldDeskCode
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Date:" }),
          " ",
          formatDateLong(date)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "New desk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: deskId, onValueChange: setDeskId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select available desk" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: availableDesks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 text-xs text-muted-foreground", children: "No other desks available on this date" }) : availableDesks.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: d.id, children: [
            d.office_zones?.zone_code,
            "-",
            d.desk_code
          ] }, d.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cd-notes", children: "Notes (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "cd-notes", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy || !deskId, children: busy ? "Saving…" : "Change desk" })
    ] })
  ] }) });
}
function AssignDeskDialog({
  onClose
}) {
  const {
    user: admin
  } = useAuth();
  const today = todayISODateIST();
  const [employeeId, setEmployeeId] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(today);
  const [deskId, setDeskId] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const dateBlocked = !isWithinBookingWindow(date) || isWeekend(date);
  const {
    data: employees = []
  } = useQuery({
    queryKey: ["admin-employees"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("user_profiles").select("id, full_name, email").eq("is_active", true).order("full_name");
      return data ?? [];
    }
  });
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
    data: allDesks = []
  } = useQuery({
    queryKey: ["admin-active-desks"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("office_desks").select("id, desk_code, office_zones(zone_code)").eq("is_active", true).order("desk_code");
      return data ?? [];
    }
  });
  const {
    data: bookedIds = []
  } = useQuery({
    queryKey: ["admin-booked-desk-ids", date],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("office_bookings").select("desk_id").eq("booking_date", date).eq("status", "confirmed");
      return (data ?? []).map((r) => r.desk_id);
    }
  });
  const availableDesks = reactExports.useMemo(() => allDesks.filter((d) => !bookedIds.includes(d.id)), [allDesks, bookedIds]);
  const submit = async () => {
    if (!admin) return;
    if (!employeeId) {
      toast.error("Select an employee");
      return;
    }
    if (!deskId) {
      toast.error("Select a desk");
      return;
    }
    if (dateBlocked) {
      toast.error("Date not bookable");
      return;
    }
    if (holiday) {
      toast.error("Date is a public holiday");
      return;
    }
    setBusy(true);
    const {
      data: inserted,
      error
    } = await supabase.from("office_bookings").insert({
      user_id: employeeId,
      desk_id: deskId,
      booking_date: date,
      status: "confirmed",
      booking_notes: notes.trim() || null
    }).select("id").single();
    setBusy(false);
    if (error || !inserted) {
      toast.error(error?.message ?? "Could not create booking");
      return;
    }
    toast.success("Desk assigned");
    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: inserted.id,
        action_type: "assigned_by_admin",
        performed_by_user_id: admin.id,
        action_notes: `Admin assigned desk for ${date}`,
        action: "created",
        table_name: "office_bookings",
        record_id: inserted.id
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Assign desk to employee" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: employeeId, onValueChange: setEmployeeId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select employee" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: employees.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: e.id, children: e.full_name || e.email }, e.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ad-date", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ad-date", type: "date", min: today, value: date, onChange: (e) => setDate(e.target.value) }),
        holiday && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive", children: [
          "Public holiday: ",
          holiday
        ] }),
        isWeekend(date) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Weekends not bookable" }),
        !isWithinBookingWindow(date) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Outside 7-day window" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Available desk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: deskId, onValueChange: setDeskId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select desk" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: availableDesks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 text-xs text-muted-foreground", children: "No desks available on this date" }) : availableDesks.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: d.id, children: [
            d.office_zones?.zone_code,
            "-",
            d.desk_code
          ] }, d.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ad-notes", children: "Notes (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "ad-notes", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy || dateBlocked || !!holiday, children: busy ? "Assigning…" : "Assign" })
    ] })
  ] }) });
}
export {
  AdminBookings as component
};
