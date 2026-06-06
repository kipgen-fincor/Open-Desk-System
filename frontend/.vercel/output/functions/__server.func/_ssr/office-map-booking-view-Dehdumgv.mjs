import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Badge } from "./badge-DiqzpQTy.mjs";
import { C as Card } from "./card-B7rAZaCA.mjs";
import { j as cn } from "./router-BFWygh1D.mjs";
import { c as Check } from "../_libs/lucide-react.mjs";
const SVG_WIDTH = 920;
const SVG_HEIGHT = 1280;
const DESK_WIDTH = 89;
const DESK_HEIGHT = 37;
const DESK_BOUNDS = [
  { x: 504.5, y: 257.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 606.5, y: 257.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 708.5, y: 257.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 810.5, y: 257.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 506.5, y: 311.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 608.5, y: 311.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 710.5, y: 311.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 812.5, y: 311.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 608.5, y: 399.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 708.5, y: 399.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 810.5, y: 399.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 607.5, y: 454.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 709.5, y: 454.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 811.5, y: 454.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 606.5, y: 541.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 708.5, y: 541.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 810.5, y: 541.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 606.5, y: 598.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 708.5, y: 598.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 810.5, y: 598.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 477.5, y: 950.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 583.5, y: 950.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 697.5, y: 950.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 803.5, y: 950.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 475.5, y: 1005.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 582.5, y: 1005.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 696.5, y: 1005.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 803.5, y: 1005.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 472.5, y: 1082.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 583.5, y: 1085.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 692.5, y: 1085.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 803.5, y: 1085.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 472.5, y: 1141.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 583.5, y: 1141.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 696.5, y: 1141.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 803.5, y: 1140.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 472.5, y: 1217.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 583.5, y: 1217.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 696.5, y: 1217.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 803.5, y: 1217.5, width: DESK_WIDTH, height: DESK_HEIGHT }
];
const MEETING_ROOM_BOUNDS_BY_CODE = {
  M1: { x: 20.75, y: 893.75, width: 158.5, height: 70.5 },
  M2: { x: 91.75, y: 1037.75, width: 55.5, height: 90.5 },
  M3: { x: 63.75, y: 1163.75, width: 118.5, height: 53.5 },
  M4: { x: 53.75, y: 128.75, width: 148.5, height: 78.5 }
};
const CALL_ROOM_BOUNDS_BY_CODE = {
  SM1: { x: 357.75, y: 673.75, width: 127.5, height: 72.5 },
  SM2: { x: 493.75, y: 673.75, width: 127.5, height: 72.5 },
  SM3: { x: 629.75, y: 673.75, width: 127.5, height: 72.5 },
  SM4: { x: 764.75, y: 673.75, width: 127.5, height: 72.5 }
};
function boundsStyle(bounds) {
  return {
    left: `${bounds.x / SVG_WIDTH * 100}%`,
    top: `${bounds.y / SVG_HEIGHT * 100}%`,
    width: `${bounds.width / SVG_WIDTH * 100}%`,
    height: `${bounds.height / SVG_HEIGHT * 100}%`
  };
}
function OfficeMapBookingView({
  desks,
  rooms = [],
  bookedMap,
  currentUserId,
  disabledForBooking,
  onSelectDesk,
  onSelectRoom,
  mode = "both"
}) {
  const mapItems = buildMapItems(desks);
  const roomItems = buildRoomItems(rooms);
  const desksInteractive = mode === "desk" || mode === "both";
  const roomsInteractive = mode === "room" || mode === "both";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden p-3 sm:p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: desksInteractive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground", children: "Available" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-destructive text-destructive-foreground", children: "Booked" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1 h-3 w-3" }),
        "Yours"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground", children: "Rooms and call booths" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto rounded-md border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative mx-auto min-w-[720px]",
        style: { width: "100%", maxWidth: SVG_WIDTH },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/office-map.svg",
              alt: "Office desk map",
              className: "block h-auto w-full select-none",
              draggable: false
            }
          ),
          roomsInteractive && roomItems.map((room) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onSelectRoom?.(room.room),
              title: `Book ${room.label}`,
              "aria-label": `Book ${room.label}`,
              className: cn(
                "absolute box-border cursor-pointer rounded-sm border-2 border-transparent bg-transparent transition-all",
                "hover:border-[#12324A] hover:bg-[#12324A]/20 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.85),0_10px_22px_rgba(18,50,74,0.35)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1",
                room.roomKind === "call" && "rounded-md hover:border-[#0F5F6B] hover:bg-[#0F5F6B]/20 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.85),0_10px_22px_rgba(15,95,107,0.35)]"
              ),
              style: boundsStyle(room.bounds),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: room.displayCode })
            },
            room.key
          )),
          desksInteractive && mapItems.map((item) => {
            const representativeDesk = item.desks[0];
            const bookings = item.desks.map((desk) => bookedMap.get(desk.id)).filter(Boolean);
            const mine = bookings.some((booking) => booking?.user_id === currentUserId);
            const booked = bookings[0];
            const unavailable = bookings.length > 0 && !mine;
            const disabled = unavailable || mine || disabledForBooking(representativeDesk, mine);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                disabled,
                onClick: () => !disabled && onSelectDesk(representativeDesk),
                title: mine ? `${item.label}: your booking` : unavailable ? `${item.label}: booked by ${booked?.name ?? "Booked"}` : `${item.label}: click to book`,
                "aria-label": mine ? `${item.label}, your booking` : unavailable ? `${item.label}, booked` : `Select ${item.label}`,
                className: cn(
                  "absolute box-border rounded-sm border-2 border-transparent bg-transparent transition-all",
                  !disabled && "cursor-pointer hover:border-[#12324A] hover:bg-[#12324A]/20 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.85),0_8px_18px_rgba(18,50,74,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                  mine && "cursor-default border-primary bg-primary/15",
                  unavailable && "cursor-not-allowed border-destructive/70 bg-destructive/10",
                  disabled && !unavailable && !mine && "cursor-not-allowed opacity-50"
                ),
                style: boundsStyle(item.bounds),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: item.label }),
                  mine && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Check,
                    {
                      className: "absolute right-0.5 top-0.5 h-3 w-3 text-primary",
                      "aria-hidden": true
                    }
                  )
                ]
              },
              item.key
            );
          })
        ]
      }
    ) })
  ] });
}
function buildMapItems(desks) {
  const sortedOfficeDesks = [...desks].sort(compareDesksForMap);
  return sortedOfficeDesks.map((desk, index) => ({
    key: desk.id,
    label: `${desk.office_zones.zone_code}-${desk.desk_code}`,
    displayCode: desk.desk_code,
    desks: [desk],
    bounds: DESK_BOUNDS[index % DESK_BOUNDS.length],
    roomKind: null
  }));
}
function buildRoomItems(rooms) {
  return rooms.map((room) => {
    const boundsMap = room.room_type === "meeting_room" ? MEETING_ROOM_BOUNDS_BY_CODE : CALL_ROOM_BOUNDS_BY_CODE;
    const bounds = boundsMap[room.room_code.toUpperCase()] ?? MEETING_ROOM_BOUNDS_BY_CODE.M4;
    return {
      key: `office-room-${room.id}`,
      label: `${room.room_code}: ${room.room_name}`,
      displayCode: room.room_code,
      room,
      bounds,
      roomKind: room.room_type === "meeting_room" ? "meeting" : "call"
    };
  });
}
function compareDesksForMap(a, b) {
  const zoneCompare = naturalCompare(a.office_zones.zone_code, b.office_zones.zone_code);
  if (zoneCompare !== 0) return zoneCompare;
  return naturalCompare(a.desk_code, b.desk_code);
}
function naturalCompare(a, b) {
  return a.localeCompare(b, void 0, { numeric: true, sensitivity: "base" });
}
export {
  OfficeMapBookingView as O
};
