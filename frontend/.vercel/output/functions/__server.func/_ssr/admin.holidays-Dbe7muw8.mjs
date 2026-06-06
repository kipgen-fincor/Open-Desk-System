import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { L as Label, I as Input, B as Button, s as supabase } from "./router-BFWygh1D.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-CQ5TTuH3.mjs";
import { f as formatDateLong } from "./date-utils-DlrBZFJO.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Trash2 } from "../_libs/lucide-react.mjs";
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
function HolidaysAdmin() {
  const qc = useQueryClient();
  const [date, setDate] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const {
    data: holidays = []
  } = useQuery({
    queryKey: ["admin-holidays"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("office_holidays").select("*").order("holiday_date", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });
  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    const trimmed = name.trim();
    const {
      error
    } = await supabase.from("office_holidays").insert({
      holiday_date: date,
      holiday_name: trimmed,
      description: trimmed
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Holiday added");
      setDate("");
      setName("");
      qc.invalidateQueries({
        queryKey: ["admin-holidays"]
      });
    }
  };
  const remove = async (id) => {
    const {
      error
    } = await supabase.from("office_holidays").delete().eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({
      queryKey: ["admin-holidays"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[320px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-base font-semibold", children: "Add holiday" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: create, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hd", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "hd", type: "date", required: true, value: date, onChange: (e) => setDate(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hn", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "hn", required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Republic Day" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "Adding…" : "Add holiday" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-12" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: holidays.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 3, className: "text-center text-sm text-muted-foreground", children: "No holidays set." }) }) : holidays.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: formatDateLong(h.holiday_date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: h.holiday_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => remove(h.id), "aria-label": "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) }) })
      ] }, h.id)) })
    ] }) })
  ] });
}
export {
  HolidaysAdmin as component
};
