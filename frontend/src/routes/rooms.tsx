import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Projector, Presentation, Video, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { OfficeMapBookingView } from "@/components/office-map-booking-view";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import {
  isWeekend,
  isWithinBookingWindow,
  todayISODateIST,
  formatDateLong,
} from "@/lib/date-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/rooms")({
  component: () => (
    <AppShell>
      <RoomsPage />
    </AppShell>
  ),
});

export type Room = {
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

type DeskForMap = {
  id: string;
  desk_code: string;
  office_zones: { zone_code: string; description: string | null };
};

function RoomsPage() {
  const [view, setView] = useState<"map" | "table">("map");
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);

  const { data: desks = [] } = useQuery({
    queryKey: ["desks-for-room-map"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_desks")
        .select("id, desk_code, office_zones(zone_code, description)")
        .eq("is_active", true)
        .order("desk_code");
      if (error) throw error;
      return data as unknown as DeskForMap[];
    },
  });

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["office-rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_rooms")
        .select(
          "id, room_code, room_name, room_type, capacity, has_projector, has_whiteboard, has_video_conf, is_active",
        )
        .eq("is_active", true)
        .order("room_code");
      if (error) throw error;
      return data as Room[];
    },
  });

  const meetingRooms = rooms.filter((r) => r.room_type === "meeting_room");
  const callRooms = rooms.filter((r) => r.room_type === "call_room");
  const emptyBookedMap = useMemo(
    () => new Map<string, { id: string; user_id: string; name: string }>(),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Room Booking</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Book meeting rooms and call booths from the office map.
          </p>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as "map" | "table")}>
          <TabsList>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <Card className="p-6 text-sm text-muted-foreground">Loading rooms...</Card>
      ) : view === "map" ? (
        <OfficeMapBookingView
          desks={desks}
          rooms={rooms}
          bookedMap={emptyBookedMap}
          disabledForBooking={() => true}
          onSelectDesk={() => undefined}
          onSelectRoom={setBookingRoom}
          mode="room"
        />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...meetingRooms, ...callRooms].map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <div className="font-medium">{room.room_code}</div>
                    <div className="text-sm text-muted-foreground">{room.room_name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {room.room_type === "meeting_room" ? "Meeting Room" : "Call Booth"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {room.capacity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <RoomFeatureBadges room={room} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => setBookingRoom(room)}>
                      Book
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {bookingRoom && <BookRoomDialog room={bookingRoom} onClose={() => setBookingRoom(null)} />}
    </div>
  );
}

function RoomFeatureBadges({ room }: { room: Room }) {
  return (
    <div className="flex flex-wrap gap-1.5 text-xs">
      {room.has_projector && (
        <Badge variant="outline" className="gap-1">
          <Projector className="h-3 w-3" /> Projector
        </Badge>
      )}
      {room.has_whiteboard && (
        <Badge variant="outline" className="gap-1">
          <Presentation className="h-3 w-3" /> Whiteboard
        </Badge>
      )}
      {room.has_video_conf && (
        <Badge variant="outline" className="gap-1">
          <Video className="h-3 w-3" /> Video Conf
        </Badge>
      )}
    </div>
  );
}

// 08:00 .. 20:00 in 15-min steps
function buildSlots(startH = 8, endH = 20): string[] {
  const out: string[] = [];
  for (let h = startH; h <= endH; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === endH && m > 0) break;
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return out;
}
const ALL_SLOTS = buildSlots();
const TIMELINE_START_MINUTES = 8 * 60;
const TIMELINE_END_MINUTES = 20 * 60;
const TIMELINE_TOTAL_MINUTES = TIMELINE_END_MINUTES - TIMELINE_START_MINUTES;
const TIMELINE_PX_PER_MINUTE = 1.5;
const TIMELINE_HEIGHT = TIMELINE_TOTAL_MINUTES * TIMELINE_PX_PER_MINUTE;

type ExistingRoomBooking = {
  id: string;
  start_time: string;
  end_time: string;
  title: string | null;
  user_profiles?: { full_name: string | null } | { full_name: string | null }[] | null;
};

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function rangesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(endA) > timeToMinutes(startB);
}

export function BookRoomDialog({ room, onClose }: { room: Room; onClose: () => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const today = todayISODateIST();
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:15");
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState(2);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [timeInteracted, setTimeInteracted] = useState(false);

  const startSlots = ALL_SLOTS.filter((s) => s !== "20:00");
  const endSlots = ALL_SLOTS.filter((s) => s > startTime);
  const minDurationInvalid = endTime <= startTime;

  const dateBlocked = !isWithinBookingWindow(date) || isWeekend(date);

  const { data: holiday } = useQuery({
    queryKey: ["holiday", date],
    queryFn: async () => {
      const { data } = await supabase
        .from("office_holidays")
        .select("holiday_name")
        .eq("holiday_date", date)
        .maybeSingle();
      return data?.holiday_name as string | undefined;
    },
  });

  const { data: existing = [], isFetching: existingFetching } = useQuery({
    queryKey: ["room-bookings", room.id, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room_bookings")
        .select(
          "id, start_time, end_time, title, user_profiles!room_bookings_user_id_fkey(full_name)",
        )
        .eq("room_id", room.id)
        .eq("booking_date", date)
        .eq("status", "confirmed")
        .order("start_time");
      if (error) throw error;
      return data as ExistingRoomBooking[];
    },
  });

  const selectedTimeOverlaps = useMemo(
    () =>
      !minDurationInvalid &&
      existing.some((b) => rangesOverlap(startTime, endTime, b.start_time, b.end_time)),
    [endTime, existing, minDurationInvalid, startTime],
  );
  const previewConflicts = timeInteracted && selectedTimeOverlaps;

  const selectTimelineStart = (slot: string) => {
    setTimeInteracted(true);
    setStartTime(slot);
    if (endTime <= slot) {
      const i = ALL_SLOTS.indexOf(slot);
      setEndTime(ALL_SLOTS[i + 1] ?? "20:00");
    }
  };

  const submit = async () => {
    if (!user) return;
    if (dateBlocked) {
      toast.error("This date isn't bookable");
      return;
    }
    if (holiday) {
      toast.error("That date is a public holiday");
      return;
    }
    if (minDurationInvalid) {
      toast.error("Minimum booking duration is 15 minutes");
      return;
    }
    if (attendees < 1 || attendees > room.capacity) {
      toast.error(`Attendees must be 1–${room.capacity}`);
      return;
    }
    setBusy(true);
    const { data: inserted, error } = await supabase
      .from("room_bookings")
      .insert({
        room_id: room.id,
        user_id: user.id,
        booking_date: date,
        start_time: startTime,
        end_time: endTime,
        title: title.trim() || null,
        attendees_count: attendees,
        status: "confirmed",
        booking_notes: notes.trim() || null,
      })
      .select("id")
      .single();
    setBusy(false);
    if (error || !inserted) {
      const msg = error?.message || "";
      const bookingError = error as { code?: string; details?: string } | null;
      const detail = (bookingError?.details || "") + " " + msg;
      if (bookingError?.code === "23P01" || /overlap|exclude|conflict/i.test(msg)) {
        if (/no_user_room_overlap/i.test(detail)) {
          toast.error(
            "You already have a room booking during this time. Please finish or cancel your existing booking before booking another room.",
          );
        } else {
          toast.error(
            "This room is already booked for that time slot. Please choose a different time.",
          );
        }
      } else {
        toast.error(msg || "Could not create booking");
      }
      return;
    }
    toast.success(`Booked ${room.room_code}`);
    qc.invalidateQueries({ queryKey: ["room-bookings", room.id, date] });
    qc.invalidateQueries({ queryKey: ["my-room-bookings", user.id] });
    try {
      await supabase.from("room_audit_logs").insert({
        room_booking_id: inserted.id,
        action_type: "created",
        performed_by_user_id: user.id,
        action_notes: `Room booking created for ${date} ${startTime}-${endTime}`,
        action: "created",
        table_name: "room_bookings",
        record_id: inserted.id,
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-h-[calc(100dvh-3rem)]">
        <DialogHeader className="shrink-0 border-b border-border px-4 py-3 pr-10 sm:px-5">
          <DialogTitle>
            Book {room.room_code} — {room.room_name}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5">
          <div className="space-y-2.5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="rb-date">Date</Label>
                <Input
                  id="rb-date"
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => setDate(e.target.value)}
                />
                {holiday && <p className="text-xs text-destructive">Public holiday: {holiday}</p>}
                {isWeekend(date) && (
                  <p className="text-xs text-destructive">Weekends are not bookable</p>
                )}
                {!isWithinBookingWindow(date) && (
                  <p className="text-xs text-destructive">Outside 7-day booking window</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rb-att">Attendees (max {room.capacity})</Label>
                <Input
                  id="rb-att"
                  type="number"
                  min={1}
                  max={room.capacity}
                  value={attendees}
                  onChange={(e) => setAttendees(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start</Label>
                <Select
                  value={startTime}
                  onValueChange={(v) => {
                    setTimeInteracted(true);
                    setStartTime(v);
                    if (endTime <= v) {
                      const i = ALL_SLOTS.indexOf(v);
                      setEndTime(ALL_SLOTS[i + 1] ?? "20:00");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {startSlots.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>End</Label>
                <Select
                  value={endTime}
                  onValueChange={(v) => {
                    setTimeInteracted(true);
                    setEndTime(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {endSlots.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {minDurationInvalid && (
                  <p className="text-xs text-destructive">Minimum booking duration is 15 minutes</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rb-title">Title (optional)</Label>
              <Input
                id="rb-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sprint Planning"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rb-notes">Notes</Label>
              <Textarea
                id="rb-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-16"
              />
            </div>

            <RoomDayTimeline
              date={date}
              bookings={existing}
              isLoading={existingFetching}
              startTime={startTime}
              endTime={endTime}
              title={title}
              conflicts={previewConflicts}
              onSelectStart={selectTimelineStart}
            />
            {previewConflicts && (
              <p className="text-xs text-destructive">Conflicts with an existing booking</p>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-border px-4 py-3 sm:px-5">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy || dateBlocked || !!holiday || previewConflicts}>
            {busy ? "Booking…" : "Confirm booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoomDayTimeline({
  date,
  bookings,
  isLoading,
  startTime,
  endTime,
  title,
  conflicts,
  onSelectStart,
}: {
  date: string;
  bookings: ExistingRoomBooking[];
  isLoading: boolean;
  startTime: string;
  endTime: string;
  title: string;
  conflicts: boolean;
  onSelectStart: (time: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [date]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const rawMinutes = Math.floor((event.clientY - rect.top) / TIMELINE_PX_PER_MINUTE);
    const snappedMinutes = Math.floor(rawMinutes / 15) * 15;
    const absoluteMinutes = TIMELINE_START_MINUTES + snappedMinutes;
    const cappedMinutes = Math.min(absoluteMinutes, TIMELINE_END_MINUTES - 15);
    onSelectStart(minutesToTime(cappedMinutes));
  };

  return (
    <div className="space-y-1.5">
      <Label className="block">Timeline on {formatDateLong(date)}</Label>
      {isLoading ? (
        <div className="space-y-2 rounded-md border border-border p-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="max-h-[min(34vh,15rem)] overflow-y-auto rounded-md border border-border bg-card"
        >
          <div
            className="relative grid cursor-pointer grid-cols-[56px_1fr]"
            style={{ height: TIMELINE_HEIGHT }}
            onClick={handleClick}
          >
            <div className="relative border-r border-border bg-muted/35">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 px-2 pt-1 text-xs font-medium text-muted-foreground"
                  style={{
                    top: (hour * 60 - TIMELINE_START_MINUTES) * TIMELINE_PX_PER_MINUTE,
                    height: 60 * TIMELINE_PX_PER_MINUTE,
                  }}
                >
                  {String(hour).padStart(2, "0")}:00
                </div>
              ))}
            </div>
            <div className="relative">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-b border-border"
                  style={{
                    top: (hour * 60 - TIMELINE_START_MINUTES) * TIMELINE_PX_PER_MINUTE,
                    height: 60 * TIMELINE_PX_PER_MINUTE,
                  }}
                >
                  {[15, 30, 45].map((minute) => (
                    <div
                      key={minute}
                      className="absolute left-0 right-0 border-t border-dashed border-border/70"
                      style={{ top: minute * TIMELINE_PX_PER_MINUTE }}
                    />
                  ))}
                </div>
              ))}
              {bookings.map((booking, index) => (
                <TimelineBlock key={booking.id} booking={booking} index={index} />
              ))}
              <PreviewTimelineBlock
                startTime={startTime}
                endTime={endTime}
                title={title}
                conflicts={conflicts}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineBlock({ booking, index }: { booking: ExistingRoomBooking; index: number }) {
  const top = (timeToMinutes(booking.start_time) - TIMELINE_START_MINUTES) * TIMELINE_PX_PER_MINUTE;
  const height = Math.max(
    (timeToMinutes(booking.end_time) - timeToMinutes(booking.start_time)) * TIMELINE_PX_PER_MINUTE,
    22,
  );
  const profile = Array.isArray(booking.user_profiles)
    ? booking.user_profiles[0]
    : booking.user_profiles;
  const label = `${booking.title || "Booked"} · ${profile?.full_name || "Employee"} · ${booking.start_time.slice(0, 5)}–${booking.end_time.slice(0, 5)}`;

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className={
        index % 2 === 0
          ? "absolute left-2 right-2 overflow-hidden rounded-md bg-primary px-2 py-1 text-xs font-medium leading-tight text-primary-foreground shadow-sm"
          : "absolute left-2 right-2 overflow-hidden rounded-md bg-destructive px-2 py-1 text-xs font-medium leading-tight text-destructive-foreground shadow-sm"
      }
      style={{ top, height }}
      title={label}
    >
      <div className="truncate">{label}</div>
    </div>
  );
}

function PreviewTimelineBlock({
  startTime,
  endTime,
  title,
  conflicts,
}: {
  startTime: string;
  endTime: string;
  title: string;
  conflicts: boolean;
}) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (end <= start) return null;

  const top = (start - TIMELINE_START_MINUTES) * TIMELINE_PX_PER_MINUTE;
  const height = Math.max((end - start) * TIMELINE_PX_PER_MINUTE, 22);
  const label = `${title.trim() || "New booking"} · ${startTime}–${endTime}`;

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className={
        conflicts
          ? "absolute left-4 right-4 overflow-hidden rounded-md border border-destructive bg-destructive/75 px-2 py-1 text-xs font-medium leading-tight text-destructive-foreground shadow-sm"
          : "absolute left-4 right-4 overflow-hidden rounded-md border border-primary bg-primary/75 px-2 py-1 text-xs font-medium leading-tight text-primary-foreground shadow-sm"
      }
      style={{ top, height }}
      title={label}
    >
      <div className="truncate">{label}</div>
    </div>
  );
}
