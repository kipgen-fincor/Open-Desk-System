import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { formatDateLong } from "@/lib/date-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/room-bookings")({
  component: AdminRoomBookings,
});

function AdminRoomBookings() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [changeBooking, setChangeBooking] = useState<any | null>(null);

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-all-room-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room_bookings")
        .select("id, room_id, booking_date, start_time, end_time, attendees_count, title, status, user_profiles!room_bookings_user_id_fkey(full_name, email), office_rooms(room_code, room_name)")
        .order("booking_date", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const doCancel = async () => {
    if (!confirmCancel || !user) return;
    const id = confirmCancel;
    const { error } = await supabase
      .from("room_bookings")
      .update({ status: "cancelled", cancelled_by_user_id: user.id })
      .eq("id", id);
    setConfirmCancel(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Room booking cancelled");
    qc.invalidateQueries({ queryKey: ["admin-all-room-bookings"] });
    try {
      await supabase.from("room_audit_logs").insert({
        room_booking_id: id,
        action_type: "cancelled_by_admin",
        performed_by_user_id: user.id,
        action_notes: "Cancelled by admin",
        action: "cancelled",
        table_name: "room_bookings",
        record_id: id,
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">All room bookings</h2>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                  No room bookings.
                </TableCell>
              </TableRow>
            ) : bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">
                  {b.user_profiles?.full_name || b.user_profiles?.email || "—"}
                </TableCell>
                <TableCell>
                  {b.office_rooms?.room_code} — {b.office_rooms?.room_name}
                </TableCell>
                <TableCell>{formatDateLong(b.booking_date)}</TableCell>
                <TableCell className="font-mono text-xs">
                  {b.start_time?.slice(0,5)}–{b.end_time?.slice(0,5)}
                </TableCell>
                <TableCell>{b.attendees_count ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{b.title || "—"}</TableCell>
                <TableCell>
                  {b.status === "confirmed" ? (
                    <Badge className="bg-success text-success-foreground capitalize">{b.status}</Badge>
                  ) : (
                    <Badge className="bg-destructive text-destructive-foreground capitalize">{b.status}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {b.status === "confirmed" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setChangeBooking(b)}>
                        Change Room
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmCancel(b.id)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!confirmCancel} onOpenChange={(v) => !v && setConfirmCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this room booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The room slot will be released. This action is logged in the audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction onClick={doCancel}>Cancel booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {changeBooking && (
        <ChangeRoomDialog
          booking={changeBooking}
          onClose={() => {
            setChangeBooking(null);
            qc.invalidateQueries({ queryKey: ["admin-all-room-bookings"] });
          }}
        />
      )}
    </div>
  );
}

function ChangeRoomDialog({ booking, onClose }: { booking: any; onClose: () => void }) {
  const { user: admin } = useAuth();
  const [roomId, setRoomId] = useState("");
  const [busy, setBusy] = useState(false);
  const date = booking.booking_date;
  const start = booking.start_time;
  const end = booking.end_time;
  const oldRoomCode = booking.office_rooms?.room_code ?? "—";

  const { data: allRooms = [] } = useQuery({
    queryKey: ["admin-active-rooms"],
    queryFn: async () => {
      const { data } = await supabase
        .from("office_rooms")
        .select("id, room_code, room_name")
        .eq("is_active", true)
        .order("room_code");
      return (data ?? []) as any[];
    },
  });

  const { data: dayBookings = [] } = useQuery({
    queryKey: ["admin-room-bookings-day", date],
    queryFn: async () => {
      const { data } = await supabase
        .from("room_bookings")
        .select("id, room_id, start_time, end_time")
        .eq("booking_date", date)
        .eq("status", "confirmed");
      return (data ?? []) as any[];
    },
  });

  const conflictingRoomIds = useMemo(() => {
    const set = new Set<string>();
    for (const b of dayBookings) {
      if (b.id === booking.id) continue;
      // overlap if existing.start < end AND existing.end > start
      if (b.start_time < end && b.end_time > start) {
        set.add(b.room_id);
      }
    }
    return set;
  }, [dayBookings, booking.id, start, end]);

  const availableRooms = useMemo(
    () => allRooms.filter((r: any) => !conflictingRoomIds.has(r.id) && r.id !== booking.room_id),
    [allRooms, conflictingRoomIds, booking.room_id],
  );

  const submit = async () => {
    if (!admin) return;
    if (!roomId) { toast.error("Select a room"); return; }
    setBusy(true);
    const newRoom = allRooms.find((r: any) => r.id === roomId);
    const newRoomCode = newRoom?.room_code ?? "—";
    const { error } = await supabase
      .from("room_bookings")
      .update({ room_id: roomId })
      .eq("id", booking.id);
    setBusy(false);
    if (error) {
      if ((error as any)?.code === "23P01") {
        toast.error("That room is already booked for this time slot.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success(`Room successfully changed to ${newRoomCode}`);
    try {
      await supabase.from("room_audit_logs").insert({
        room_booking_id: booking.id,
        action_type: "room_changed_by_admin",
        performed_by_user_id: admin.id,
        action_notes: `Room changed from ${oldRoomCode} to ${newRoomCode}`,
        action: "updated",
        table_name: "room_bookings",
        record_id: booking.id,
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change room</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-0.5">
            <div><span className="font-medium text-foreground">Employee:</span> {booking.user_profiles?.full_name || booking.user_profiles?.email || "—"}</div>
            <div><span className="font-medium text-foreground">Current room:</span> {oldRoomCode} — {booking.office_rooms?.room_name}</div>
            <div><span className="font-medium text-foreground">Date:</span> {formatDateLong(date)}</div>
            <div><span className="font-medium text-foreground">Time:</span> {start?.slice(0,5)}–{end?.slice(0,5)}</div>
          </div>
          <div className="space-y-1.5">
            <Label>New room</Label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger><SelectValue placeholder="Select available room" /></SelectTrigger>
              <SelectContent className="max-h-64">
                {availableRooms.length === 0 ? (
                  <div className="p-2 text-xs text-muted-foreground">No other rooms available for this time</div>
                ) : availableRooms.map((r: any) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.room_code} — {r.room_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={busy || !roomId}>
            {busy ? "Saving…" : "Change room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
