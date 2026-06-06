import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { B as Badge } from "./badge-DiqzpQTy.mjs";
import { S as Switch } from "./switch-1MPiEQcs.mjs";
import { u as useAuth, S as Select, g as SelectTrigger, h as SelectValue, e as SelectContent, f as SelectItem, s as supabase } from "./router-BFWygh1D.mjs";
import { T as Table, d as TableHeader, e as TableRow, c as TableHead, a as TableBody, b as TableCell } from "./table-CQ5TTuH3.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
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
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/lucide-react.mjs";
function UsersAdmin() {
  const qc = useQueryClient();
  const {
    user
  } = useAuth();
  const {
    data: users = []
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("user_profiles").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const updateRole = async (u, role) => {
    if (u.id === user?.id && role !== "admin") {
      toast.error("You can't demote yourself");
      return;
    }
    const {
      error
    } = await supabase.from("user_profiles").update({
      user_role: role
    }).eq("id", u.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Role updated");
      qc.invalidateQueries({
        queryKey: ["admin-users"]
      });
    }
  };
  const toggleActive = async (u) => {
    const {
      error
    } = await supabase.from("user_profiles").update({
      is_active: !u.is_active
    }).eq("id", u.id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({
      queryKey: ["admin-users"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Email" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Role" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Active" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center text-sm text-muted-foreground", children: "No users yet." }) }) : users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: u.full_name ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: u.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: u.user_role, onValueChange: (v) => updateRole(u, v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-36", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "employee", children: "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", children: "Admin" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: u.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Disabled" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: u.is_active, onCheckedChange: () => toggleActive(u) }) })
    ] }, u.id)) })
  ] }) });
}
export {
  UsersAdmin as component
};
