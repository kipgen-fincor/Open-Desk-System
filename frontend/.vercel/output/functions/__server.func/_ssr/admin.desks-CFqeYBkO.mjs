import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { B as Button, s as supabase, D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, L as Label, I as Input, S as Select, g as SelectTrigger, h as SelectValue, e as SelectContent, f as SelectItem, b as DialogFooter } from "./router-BFWygh1D.mjs";
import { B as Badge } from "./badge-DiqzpQTy.mjs";
import { S as Switch } from "./switch-1MPiEQcs.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-CQ5TTuH3.mjs";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-BDUtYks1.mjs";
import { b as todayISODateIST } from "./date-utils-DlrBZFJO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { o as Plus, r as SquarePen, T as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
const emptyDeskForm = {
  desk_code: "",
  zone_id: "",
  has_monitor: false,
  has_standing_desk: false,
  has_locker: false,
  has_whiteboard: false,
  is_active: true
};
function DesksAdmin() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editingDesk, setEditingDesk] = reactExports.useState(null);
  const [deletingDesk, setDeletingDesk] = reactExports.useState(null);
  const [deleteBusy, setDeleteBusy] = reactExports.useState(false);
  const {
    data: zones = []
  } = useQuery({
    queryKey: ["zones-for-desks"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_zones").select("id, zone_code, is_active").order("zone_code");
      if (error) throw error;
      return data ?? [];
    }
  });
  const {
    data: desks = []
  } = useQuery({
    queryKey: ["admin-desks"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_desks").select("id, desk_code, zone_id, has_monitor, has_standing_desk, has_locker, has_whiteboard, is_active, office_zones(zone_code)").order("desk_code");
      if (error) throw error;
      return data;
    }
  });
  const activeZones = zones.filter((zone) => zone.is_active);
  const invalidateDesks = () => {
    qc.invalidateQueries({
      queryKey: ["admin-desks"]
    });
    qc.invalidateQueries({
      queryKey: ["desks"]
    });
  };
  const deleteDesk = async () => {
    if (!deletingDesk) return;
    setDeleteBusy(true);
    const {
      count,
      error: countError
    } = await supabase.from("office_bookings").select("id", {
      count: "exact",
      head: true
    }).eq("desk_id", deletingDesk.id).eq("status", "confirmed").gte("booking_date", todayISODateIST());
    if (countError) {
      setDeleteBusy(false);
      toast.error(countError.message);
      return;
    }
    if ((count ?? 0) > 0) {
      setDeleteBusy(false);
      toast.error("Cannot delete desk with active future bookings. Cancel them first.");
      return;
    }
    const {
      error
    } = await supabase.from("office_desks").delete().eq("id", deletingDesk.id);
    setDeleteBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Desk deleted");
    setDeletingDesk(null);
    invalidateDesks();
  };
  const featureKeys = [["has_monitor", "Monitor"], ["has_standing_desk", "Standing"], ["has_locker", "Locker"], ["has_whiteboard", "Whiteboard"]];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Desks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        "Add Desk"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Desk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Zone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: desks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center text-sm text-muted-foreground", children: "No desks yet." }) }) : desks.map((desk) => {
        const features = featureKeys.map(([key, label]) => desk[key] ? label : null).filter(Boolean).join(" · ") || "—";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: desk.desk_code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: desk.office_zones?.zone_code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: features }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: desk.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Inactive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setEditingDesk(desk), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }),
              "Edit"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", onClick: () => setDeletingDesk(desk), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
              "Delete"
            ] })
          ] }) })
        ] }, desk.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DeskDialog, { open: addOpen, title: "Add desk", zones: activeZones, initialValues: emptyDeskForm, showActive: false, onClose: () => setAddOpen(false), onSave: async (values) => {
      const {
        error
      } = await supabase.from("office_desks").insert({
        zone_id: values.zone_id,
        desk_code: values.desk_code.trim(),
        has_monitor: values.has_monitor,
        has_standing_desk: values.has_standing_desk,
        has_locker: values.has_locker,
        has_whiteboard: values.has_whiteboard,
        is_active: true
      });
      if (error) {
        if (error.message.includes("is at full capacity")) {
          toast.error("This zone has reached its maximum desk capacity. Ask an admin to increase the zone capacity or remove unused desks.");
          return false;
        }
        toast.error(error.message);
        return false;
      }
      toast.success("Desk created");
      setAddOpen(false);
      invalidateDesks();
      return true;
    } }),
    editingDesk && /* @__PURE__ */ jsxRuntimeExports.jsx(DeskDialog, { open: true, title: "Edit desk", zones, showActive: true, initialValues: {
      desk_code: editingDesk.desk_code,
      zone_id: editingDesk.zone_id,
      has_monitor: editingDesk.has_monitor,
      has_standing_desk: editingDesk.has_standing_desk,
      has_locker: editingDesk.has_locker,
      has_whiteboard: editingDesk.has_whiteboard,
      is_active: editingDesk.is_active
    }, onClose: () => setEditingDesk(null), onSave: async (values) => {
      const {
        error
      } = await supabase.from("office_desks").update({
        zone_id: values.zone_id,
        desk_code: values.desk_code.trim(),
        has_monitor: values.has_monitor,
        has_standing_desk: values.has_standing_desk,
        has_locker: values.has_locker,
        has_whiteboard: values.has_whiteboard,
        is_active: values.is_active
      }).eq("id", editingDesk.id);
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Desk updated");
      setEditingDesk(null);
      invalidateDesks();
      return true;
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deletingDesk, onOpenChange: (open) => !open && setDeletingDesk(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Delete desk ",
          deletingDesk?.desk_code,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: deleteBusy, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: deleteDesk, disabled: deleteBusy, children: deleteBusy ? "Deleting..." : "Delete" })
      ] })
    ] }) })
  ] });
}
function DeskDialog({
  open,
  title,
  zones,
  initialValues,
  showActive = true,
  onClose,
  onSave
}) {
  const [values, setValues] = reactExports.useState(initialValues);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);
  const update = (key, value) => {
    setValues((current) => ({
      ...current,
      [key]: value
    }));
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!values.zone_id) {
      toast.error("Select a zone");
      return;
    }
    setBusy(true);
    const saved = await onSave(values);
    setBusy(false);
    if (saved) setValues(initialValues);
  };
  const toggleKeys = [["has_monitor", "Monitor"], ["has_standing_desk", "Standing desk"], ["has_locker", "Locker"], ["has_whiteboard", "Whiteboard"]];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (nextOpen) => !nextOpen && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "desk-code", children: "Desk code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "desk-code", required: true, value: values.desk_code, onChange: (event) => update("desk_code", event.target.value), placeholder: "A-01" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Zone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: values.zone_id, onValueChange: (value) => update("zone_id", value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select zone" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: zones.map((zone) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: zone.id, children: zone.zone_code }, zone.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        toggleKeys.map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: values[key], onCheckedChange: (checked) => update(key, checked) })
        ] }, key)),
        showActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: values.is_active, onCheckedChange: (checked) => update("is_active", checked) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saving..." : "Save" })
      ] })
    ] })
  ] }) });
}
export {
  DesksAdmin as component
};
