import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SVG_WIDTH = 920;
const SVG_HEIGHT = 1280;

/** Outer desk shell in SVG (light gray box around monitor). */
const DESK_WIDTH = 89;
const DESK_HEIGHT = 37;

type MapBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type OfficeMapDesk = {
  id: string;
  desk_code: string;
  office_zones: { zone_code: string; description: string | null };
};

type BookedDesk = {
  id: string;
  user_id: string;
  name: string;
};

type OfficeMapRoom = {
  id: string;
  room_code: string;
  room_name: string;
  room_type: "meeting_room" | "call_room";
  capacity: number;
  has_projector: boolean;
  has_whiteboard: boolean;
  has_video_conf: boolean;
  is_active: boolean;
};

/** Top-left corners aligned to SVG desk outer rects. */
const DESK_BOUNDS: MapBounds[] = [
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
  { x: 472.5, y: 1215.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 583.5, y: 1215.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 696.5, y: 1215.5, width: DESK_WIDTH, height: DESK_HEIGHT },
  { x: 803.5, y: 1215.5, width: DESK_WIDTH, height: DESK_HEIGHT },
];

/** Teal table / meeting-room bookable areas from SVG. */
const MEETING_ROOM_BOUNDS_BY_CODE: Record<string, MapBounds> = {
  M1: { x: 20.75, y: 893.75, width: 158.5, height: 70.5 },
  M2: { x: 91.75, y: 1037.75, width: 55.5, height: 85 },
  M3: { x: 93.75, y: 1163.75, width: 55.5, height: 85 },
  M4: { x: 53.75, y: 128.75, width: 148.5, height: 78.5 },
};

/** Call booths below Zone A (horizontal row). */
const CALL_ROOM_BOUNDS_BY_CODE: Record<string, MapBounds> = {
  SM1: { x: 357.75, y: 673.75, width: 127.5, height: 72.5 },
  SM2: { x: 493.75, y: 673.75, width: 127.5, height: 72.5 },
  SM3: { x: 629.75, y: 673.75, width: 127.5, height: 72.5 },
  SM4: { x: 764.75, y: 673.75, width: 127.5, height: 72.5 },
};

function boundsStyle(bounds: MapBounds) {
  return {
    left: `${(bounds.x / SVG_WIDTH) * 100}%`,
    top: `${(bounds.y / SVG_HEIGHT) * 100}%`,
    width: `${(bounds.width / SVG_WIDTH) * 100}%`,
    height: `${(bounds.height / SVG_HEIGHT) * 100}%`,
  };
}

export function OfficeMapBookingView({
  desks,
  rooms = [],
  bookedMap,
  currentUserId,
  disabledForBooking,
  onSelectDesk,
  onSelectRoom,
  mode = "both",
}: {
  desks: OfficeMapDesk[];
  rooms?: OfficeMapRoom[];
  bookedMap: Map<string, BookedDesk>;
  currentUserId?: string;
  disabledForBooking: (desk: OfficeMapDesk, mine: boolean) => boolean;
  onSelectDesk: (desk: OfficeMapDesk) => void;
  onSelectRoom?: (room: OfficeMapRoom) => void;
  mode?: "desk" | "room" | "both";
}) {
  const mapItems = buildMapItems(desks);
  const roomItems = buildRoomItems(rooms);
  const desksInteractive = mode === "desk" || mode === "both";
  const roomsInteractive = mode === "room" || mode === "both";

  return (
    <Card className="overflow-hidden p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {desksInteractive ? (
          <>
            <Badge className="bg-success text-success-foreground">Available</Badge>
            <Badge className="bg-destructive text-destructive-foreground">Booked</Badge>
            <Badge className="bg-primary text-primary-foreground">
              <Check className="mr-1 h-3 w-3" />
              Yours
            </Badge>
          </>
        ) : (
          <Badge className="bg-primary text-primary-foreground">Rooms and call booths</Badge>
        )}
      </div>

      <div className="overflow-auto rounded-md border bg-muted/20">
        <div
          className="relative mx-auto min-w-[720px]"
          style={{ width: "100%", maxWidth: SVG_WIDTH }}
        >
          <img
            src="/office-map.svg"
            alt="Office desk map"
            className="block h-auto w-full select-none"
            draggable={false}
          />
          {roomsInteractive &&
            roomItems.map((room) => (
              <button
                key={room.key}
                type="button"
                onClick={() => onSelectRoom?.(room.room)}
                title={`Book ${room.label}`}
                aria-label={`Book ${room.label}`}
                className={cn(
                  "absolute box-border cursor-pointer rounded-sm border-2 border-transparent bg-transparent transition-all",
                  "hover:border-[#12324A] hover:bg-[#12324A]/20 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.85),0_10px_22px_rgba(18,50,74,0.35)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1",
                  room.roomKind === "call" &&
                    "rounded-md hover:border-[#0F5F6B] hover:bg-[#0F5F6B]/20 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.85),0_10px_22px_rgba(15,95,107,0.35)]",
                )}
                style={boundsStyle(room.bounds)}
              >
                <span className="sr-only">{room.displayCode}</span>
              </button>
            ))}
          {desksInteractive &&
            mapItems.map((item) => {
              const representativeDesk = item.desks[0];
              const bookings = item.desks.map((desk) => bookedMap.get(desk.id)).filter(Boolean);
              const mine = bookings.some((booking) => booking?.user_id === currentUserId);
              const booked = bookings[0];
              const unavailable = bookings.length > 0 && !mine;
              const disabled = unavailable || mine || disabledForBooking(representativeDesk, mine);

              return (
                <button
                  key={item.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && onSelectDesk(representativeDesk)}
                  title={
                    mine
                      ? `${item.label}: your booking`
                      : unavailable
                        ? `${item.label}: booked by ${booked?.name ?? "Booked"}`
                        : `${item.label}: click to book`
                  }
                  aria-label={
                    mine
                      ? `${item.label}, your booking`
                      : unavailable
                        ? `${item.label}, booked`
                        : `Select ${item.label}`
                  }
                  className={cn(
                    "absolute box-border rounded-sm border-2 border-transparent bg-transparent transition-all",
                    !disabled &&
                      "cursor-pointer hover:border-[#12324A] hover:bg-[#12324A]/20 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.85),0_8px_18px_rgba(18,50,74,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    mine && "cursor-default border-primary bg-primary/15",
                    unavailable && "cursor-not-allowed border-destructive/70 bg-destructive/10",
                    disabled && !unavailable && !mine && "cursor-not-allowed opacity-50",
                  )}
                  style={boundsStyle(item.bounds)}
                >
                  <span className="sr-only">{item.label}</span>
                  {mine && (
                    <Check
                      className="absolute right-0.5 top-0.5 h-3 w-3 text-primary"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </Card>
  );
}

function buildMapItems(desks: OfficeMapDesk[]) {
  const sortedOfficeDesks = [...desks].sort(compareDesksForMap);

  return sortedOfficeDesks.map((desk, index) => ({
    key: desk.id,
    label: `${desk.office_zones.zone_code}-${desk.desk_code}`,
    displayCode: desk.desk_code,
    desks: [desk],
    bounds: DESK_BOUNDS[index % DESK_BOUNDS.length],
    roomKind: null as null,
  }));
}

function buildRoomItems(rooms: OfficeMapRoom[]) {
  return rooms.map((room) => {
    const boundsMap =
      room.room_type === "meeting_room" ? MEETING_ROOM_BOUNDS_BY_CODE : CALL_ROOM_BOUNDS_BY_CODE;
    const bounds = boundsMap[room.room_code.toUpperCase()] ?? MEETING_ROOM_BOUNDS_BY_CODE.M4;

    return {
      key: `office-room-${room.id}`,
      label: `${room.room_code}: ${room.room_name}`,
      displayCode: room.room_code,
      room,
      bounds,
      roomKind: room.room_type === "meeting_room" ? ("meeting" as const) : ("call" as const),
    };
  });
}

function compareDesksForMap(a: OfficeMapDesk, b: OfficeMapDesk) {
  const zoneCompare = naturalCompare(a.office_zones.zone_code, b.office_zones.zone_code);
  if (zoneCompare !== 0) return zoneCompare;
  return naturalCompare(a.desk_code, b.desk_code);
}

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}
