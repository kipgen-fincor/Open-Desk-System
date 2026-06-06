import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./app-shell-B9H2tZp4.mjs";
import { j as cn } from "./router-BFWygh1D.mjs";
import "../_libs/sonner.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
const tabs = [{
  to: "/admin",
  label: "Overview"
}, {
  to: "/admin/bookings",
  label: "Bookings"
}, {
  to: "/admin/room-bookings",
  label: "Room bookings"
}, {
  to: "/admin/zones",
  label: "Zones"
}, {
  to: "/admin/desks",
  label: "Desks"
}, {
  to: "/admin/holidays",
  label: "Holidays"
}, {
  to: "/admin/users",
  label: "Users"
}, {
  to: "/admin/audit",
  label: "Audit logs"
}];
function AdminLayout() {
  const path = useRouterState({
    select: (s) => s.location.pathname
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage zones, desks, holidays, users and review audit logs." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-wrap gap-1 border-b border-border", children: tabs.map((t) => {
      const active = path === t.to;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: t.to, className: cn("rounded-t-md px-3 py-2 text-sm font-medium transition-colors", active ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"), children: t.label }, t.to);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { adminOnly: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, {}) });
export {
  SplitComponent as component
};
