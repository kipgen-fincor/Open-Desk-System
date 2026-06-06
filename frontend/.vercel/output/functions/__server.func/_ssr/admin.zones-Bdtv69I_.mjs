import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { B as Button, s as supabase, D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, L as Label, I as Input, b as DialogFooter } from "./router-BFWygh1D.mjs";
import { B as Badge } from "./badge-DiqzpQTy.mjs";
import { S as Switch } from "./switch-1MPiEQcs.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-CQ5TTuH3.mjs";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-BDUtYks1.mjs";
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
const emptyZoneForm = {
  zone_code: "",
  description: "",
  total_capacity: 10,
  is_active: true
};
function ZonesAdmin() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editingZone, setEditingZone] = reactExports.useState(null);
  const [deletingZone, setDeletingZone] = reactExports.useState(null);
  const [deleteBusy, setDeleteBusy] = reactExports.useState(false);
  const {
    data: zones = []
  } = useQuery({
    queryKey: ["admin-zones"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_zones").select("*").order("zone_code");
      if (error) throw error;
      return data;
    }
  });
  const invalidateZones = () => {
    qc.invalidateQueries({
      queryKey: ["admin-zones"]
    });
    qc.invalidateQueries({
      queryKey: ["zones-for-desks"]
    });
  };
  const deleteZone = async () => {
    if (!deletingZone) return;
    setDeleteBusy(true);
    const {
      count,
      error: countError
    } = await supabase.from("office_desks").select("id", {
      count: "exact",
      head: true
    }).eq("zone_id", deletingZone.id).eq("is_active", true);
    if (countError) {
      setDeleteBusy(false);
      toast.error(countError.message);
      return;
    }
    if ((count ?? 0) > 0) {
      setDeleteBusy(false);
      toast.error("Cannot delete zone with active desks.");
      return;
    }
    const {
      error
    } = await supabase.from("office_zones").delete().eq("id", deletingZone.id);
    setDeleteBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Zone deleted");
    setDeletingZone(null);
    invalidateZones();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Zones" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        "Add Zone"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Capacity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: zones.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center text-sm text-muted-foreground", children: "No zones yet." }) }) : zones.map((zone) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: zone.zone_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: zone.description ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: zone.total_capacity }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: zone.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Inactive" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setEditingZone(zone), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }),
            "Edit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", onClick: () => setDeletingZone(zone), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
            "Delete"
          ] })
        ] }) })
      ] }, zone.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ZoneDialog, { open: addOpen, title: "Add zone", initialValues: emptyZoneForm, showActive: false, onClose: () => setAddOpen(false), onSave: async (values) => {
      const {
        error
      } = await supabase.from("office_zones").insert({
        zone_code: values.zone_code.trim().toUpperCase(),
        description: values.description.trim() || null,
        total_capacity: values.total_capacity,
        is_active: true
      });
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Zone created");
      setAddOpen(false);
      invalidateZones();
      return true;
    } }),
    editingZone && /* @__PURE__ */ jsxRuntimeExports.jsx(ZoneDialog, { open: true, title: "Edit zone", showActive: true, initialValues: {
      zone_code: editingZone.zone_code,
      description: editingZone.description ?? "",
      total_capacity: editingZone.total_capacity,
      is_active: editingZone.is_active
    }, onClose: () => setEditingZone(null), onSave: async (values) => {
      const {
        error
      } = await supabase.from("office_zones").update({
        zone_code: values.zone_code.trim().toUpperCase(),
        description: values.description.trim() || null,
        total_capacity: values.total_capacity,
        is_active: values.is_active
      }).eq("id", editingZone.id);
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Zone updated");
      setEditingZone(null);
      invalidateZones();
      return true;
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deletingZone, onOpenChange: (open) => !open && setDeletingZone(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Delete zone ",
          deletingZone?.zone_code,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: deleteBusy, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: deleteZone, disabled: deleteBusy, children: deleteBusy ? "Deleting..." : "Delete" })
      ] })
    ] }) })
  ] });
}
function ZoneDialog({
  open,
  title,
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
    if (!Number.isFinite(values.total_capacity) || values.total_capacity < 1) {
      toast.error("Total capacity is required");
      return;
    }
    setBusy(true);
    const saved = await onSave(values);
    setBusy(false);
    if (saved) setValues(initialValues);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (nextOpen) => !nextOpen && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "zone-code", children: "Zone code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "zone-code", required: true, value: values.zone_code, onChange: (event) => update("zone_code", event.target.value), placeholder: "A" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "zone-description", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "zone-description", value: values.description, onChange: (event) => update("description", event.target.value), placeholder: "Window side" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "zone-capacity", children: "Total capacity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "zone-capacity", required: true, type: "number", min: 1, value: values.total_capacity, onChange: (event) => update("total_capacity", Number(event.target.value)) })
      ] }),
      showActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between gap-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: values.is_active, onCheckedChange: (checked) => update("is_active", checked) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saving..." : "Save" })
      ] })
    ] })
  ] }) });
}
export {
  ZonesAdmin as component
};
