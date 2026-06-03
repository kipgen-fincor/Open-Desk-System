import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, Monitor, ArrowUpDown, Lock, Presentation, Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BookDeskDialog, type BookDeskTarget } from "@/components/book-desk-dialog";
import { OfficeMapBookingView } from "@/components/office-map-booking-view";
import { BookRoomDialog, type Room } from "@/routes/rooms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { canCancel, formatDateLong, isWeekend, isWithinBookingWindow } from "@/lib/date-utils";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book/$date")({
  component: BookPage,
});

function BookPage() {
  return (
    <AppShell>
      <BookView />
    </AppShell>
  );
}

type DeskRow = BookDeskTarget & {
  is_active: boolean;
  zone_id: string;
};

type BookingRow = {
  id: string;
  desk_id: string;
  user_id: string;
  status: string;
  user_profiles?: { full_name: string | null; email: string | null } | null;
};

type RoomRow = Room;

function BookView() {
  const { date } = useParams({ from: "/book/$date" });
  const qc = useQueryClient();
  const { user } = useAuth();
  const [view, setView] = useState<"grid" | "table" | "map">("map");
  const [selectedDesk, setSelectedDesk] = useState<DeskRow | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomRow | null>(null);

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

  const { data: desks = [], isLoading: desksLoading } = useQuery({
    queryKey: ["desks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_desks")
        .select(
          "id, desk_code, has_monitor, has_standing_desk, has_locker, has_whiteboard, is_active, zone_id, office_zones(zone_code, description)",
        )
        .eq("is_active", true)
        .order("desk_code");
      if (error) throw error;
      return data as unknown as DeskRow[];
    },
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["office-rooms-for-map"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_rooms")
        .select(
          "id, room_code, room_name, room_type, capacity, has_projector, has_whiteboard, has_video_conf, is_active",
        )
        .eq("is_active", true)
        .order("room_code");
      if (error) throw error;
      return data as RoomRow[];
    },
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings", date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_bookings")
        .select(
          "id, desk_id, user_id, status, user_profiles!office_bookings_user_id_fkey(full_name, email)",
        )
        .eq("booking_date", date)
        .eq("status", "confirmed");
      if (error) throw error;
      return data as unknown as BookingRow[];
    },
  });

  const { data: myBookingForDate } = useQuery({
    queryKey: ["my-booking-for-date", date, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("office_bookings")
        .select("id, desk_id, booking_date")
        .eq("user_id", user!.id)
        .eq("booking_date", date)
        .eq("status", "confirmed")
        .maybeSingle();
      return data as { id: string; desk_id: string; booking_date: string } | null;
    },
  });

  const bookedMap = useMemo(() => {
    const m = new Map<string, { id: string; user_id: string; name: string }>();
    for (const b of bookings) {
      m.set(b.desk_id, {
        id: b.id,
        user_id: b.user_id,
        name: b.user_profiles?.full_name || b.user_profiles?.email || "Booked",
      });
    }
    return m;
  }, [bookings]);

  const zones = useMemo(() => {
    const grouped = new Map<
      string,
      { zone_code: string; description: string | null; desks: DeskRow[] }
    >();
    for (const d of desks) {
      const key = d.zone_id;
      if (!grouped.has(key)) {
        grouped.set(key, {
          zone_code: d.office_zones.zone_code,
          description: d.office_zones.description,
          desks: [],
        });
      }
      grouped.get(key)!.desks.push(d);
    }
    return Array.from(grouped.values()).sort((a, b) => a.zone_code.localeCompare(b.zone_code));
  }, [desks]);

  const cancelBooking = async (bookingId: string) => {
    if (!user) return;
    if (!canCancel(date)) {
      toast.error("Cancellation closed (after 6 PM IST)");
      return;
    }
    const { error } = await supabase
      .from("office_bookings")
      .update({ status: "cancelled", cancelled_by_user_id: user.id })
      .eq("id", bookingId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Booking cancelled");
    qc.invalidateQueries({ queryKey: ["bookings", date] });
    qc.invalidateQueries({ queryKey: ["my-booking-for-date", date, user.id] });
    qc.invalidateQueries({ queryKey: ["my-bookings", user.id] });
    qc.invalidateQueries({ queryKey: ["all-my-bookings", user.id] });

    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: bookingId,
        action_type: "cancelled",
        performed_by_user_id: user.id,
        action_notes: `Booking cancelled for date ${date}`,
        action: "cancelled",
        table_name: "office_bookings",
        record_id: bookingId,
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
  };

  const openDeskDialog = (desk: DeskRow) => {
    if (!user) return;
    if (holiday || dateBlocked) {
      toast.error("This date isn't bookable");
      return;
    }
    setSelectedDesk(desk);
  };

  const selectionBlocked = (mine: boolean) =>
    !!holiday || dateBlocked || (!!myBookingForDate && !mine);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to calendar
            </Link>
          </Button>
          <h1 className="mt-1 text-2xl font-semibold">{formatDateLong(date)}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {holiday ? (
              <Badge className="bg-destructive text-destructive-foreground">
                Public holiday: {holiday}
              </Badge>
            ) : dateBlocked ? (
              <Badge variant="secondary">
                {isWeekend(date) ? "Weekend — bookings disabled" : "Outside 7-day window"}
              </Badge>
            ) : (
              <Badge className="bg-success text-success-foreground">Bookable</Badge>
            )}
            {myBookingForDate && (
              <Badge className="bg-primary text-primary-foreground">You have a booking</Badge>
            )}
          </div>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "table" | "map")}>
          <TabsList>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {desksLoading ? (
        <Card className="p-6 text-sm text-muted-foreground">Loading desks…</Card>
      ) : view === "grid" ? (
        <div className="space-y-8">
          {zones.map((z) => (
            <section key={z.zone_code}>
              <div className="mb-3 flex items-baseline gap-3">
                <h2 className="text-lg font-semibold">Zone {z.zone_code}</h2>
                {z.description && (
                  <span className="text-sm text-muted-foreground">{z.description}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {z.desks.map((d) => {
                  const booked = bookedMap.get(d.id);
                  const mine = booked && booked.user_id === user?.id;
                  const disabled = selectionBlocked(!!mine);
                  return (
                    <DeskCard
                      key={d.id}
                      desk={d}
                      booked={!!booked}
                      bookedByLabel={booked?.name}
                      mine={!!mine}
                      disabled={disabled}
                      onSelect={() => openDeskDialog(d)}
                      onCancel={
                        mine && booked && canCancel(date)
                          ? () => cancelBooking(booked.id)
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : view === "map" ? (
        <OfficeMapBookingView
          desks={desks}
          rooms={rooms}
          bookedMap={bookedMap}
          currentUserId={user?.id}
          disabledForBooking={(_, mine) => selectionBlocked(mine)}
          onSelectDesk={(desk) => openDeskDialog(desk as DeskRow)}
          onSelectRoom={setSelectedRoom}
        />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Desk</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {desks.map((d) => {
                const booked = bookedMap.get(d.id);
                const mine = booked && booked.user_id === user?.id;
                const disabled = selectionBlocked(!!mine);
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.desk_code}</TableCell>
                    <TableCell>{d.office_zones.zone_code}</TableCell>
                    <TableCell>
                      <FeatureIcons desk={d} />
                    </TableCell>
                    <TableCell>
                      {mine ? (
                        <Badge className="bg-primary text-primary-foreground">Your booking</Badge>
                      ) : booked ? (
                        <Badge className="bg-destructive text-destructive-foreground">
                          Booked — {booked.name}
                        </Badge>
                      ) : (
                        <Badge className="bg-success text-success-foreground">Available</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {mine ? (
                        canCancel(date) ? (
                          <div className="flex items-center justify-end gap-2">
                            <Badge className="bg-primary text-primary-foreground">Active</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cancelBooking(booked!.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="secondary">Active · Locked</Badge>
                        )
                      ) : booked ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <Button size="sm" disabled={disabled} onClick={() => openDeskDialog(d)}>
                          Select
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {selectedDesk && (
        <BookDeskDialog
          desk={selectedDesk}
          defaultDate={date}
          onClose={() => setSelectedDesk(null)}
        />
      )}
      {selectedRoom && (
        <BookRoomDialog room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
}

function DeskCard({
  desk,
  booked,
  bookedByLabel,
  mine,
  disabled,
  onSelect,
  onCancel,
}: {
  desk: DeskRow;
  booked: boolean;
  bookedByLabel?: string;
  mine: boolean;
  disabled: boolean;
  onSelect: () => void;
  onCancel?: () => void;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-2 p-4 transition-colors",
        mine
          ? "border-primary bg-primary/5"
          : booked
            ? "border-destructive/40 bg-destructive/5"
            : "hover:border-primary/40",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase text-muted-foreground">
            Zone {desk.office_zones.zone_code}
          </div>
          <div className="text-lg font-semibold">{desk.desk_code}</div>
        </div>
        {mine ? (
          <Badge className="bg-primary text-primary-foreground">
            <Check className="mr-1 h-3 w-3" /> Mine
          </Badge>
        ) : booked ? (
          <Badge className="bg-destructive text-destructive-foreground">Booked</Badge>
        ) : (
          <Badge className="bg-success text-success-foreground">Free</Badge>
        )}
      </div>
      <FeatureIcons desk={desk} />
      {booked && !mine && (
        <div className="truncate text-xs text-muted-foreground" title={bookedByLabel}>
          {bookedByLabel}
        </div>
      )}
      <div className="mt-auto flex gap-2 pt-2">
        {mine ? (
          onCancel ? (
            <>
              <Button size="sm" variant="default" className="flex-1" disabled>
                Active
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" className="w-full" disabled>
              Active · Locked
            </Button>
          )
        ) : booked ? (
          <Button size="sm" variant="outline" className="w-full" disabled>
            Unavailable
          </Button>
        ) : (
          <Button size="sm" className="w-full" disabled={disabled} onClick={onSelect}>
            Select desk
          </Button>
        )}
      </div>
    </Card>
  );
}

function FeatureIcons({ desk }: { desk: DeskRow }) {
  const items: { icon: typeof Monitor; label: string; on: boolean }[] = [
    { icon: Monitor, label: "Monitor", on: desk.has_monitor },
    { icon: ArrowUpDown, label: "Standing", on: desk.has_standing_desk },
    { icon: Lock, label: "Locker", on: desk.has_locker },
    { icon: Presentation, label: "Whiteboard", on: desk.has_whiteboard },
  ];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((it) => (
        <span
          key={it.label}
          title={it.label}
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center rounded border",
            it.on
              ? "border-secondary/40 bg-accent/40 text-foreground"
              : "border-border bg-muted text-muted-foreground/40",
          )}
        >
          <it.icon className="h-3.5 w-3.5" />
        </span>
      ))}
    </div>
  );
}
