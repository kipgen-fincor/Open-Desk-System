import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { todayISODateIST } from "@/lib/date-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/rooms")({
  component: RoomsAdmin,
});

type Room = {
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

type RoomFormValues = {
  room_code: string;
  room_name: string;
  room_type: "meeting_room" | "call_room";
  capacity: number;
  has_projector: boolean;
  has_whiteboard: boolean;
  has_video_conf: boolean;
  is_active: boolean;
};

const emptyRoomForm: RoomFormValues = {
  room_code: "",
  room_name: "",
  room_type: "meeting_room",
  capacity: 2,
  has_projector: false,
  has_whiteboard: false,
  has_video_conf: false,
  is_active: true,
};

function RoomsAdmin() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const { data: rooms = [] } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_rooms")
        .select(
          "id, room_code, room_name, room_type, capacity, has_projector, has_whiteboard, has_video_conf, is_active",
        )
        .order("room_code");
      if (error) throw error;
      return (data ?? []) as Room[];
    },
  });

  const invalidateRooms = () => {
    qc.invalidateQueries({ queryKey: ["admin-rooms"] });
    qc.invalidateQueries({ queryKey: ["office-rooms"] });
    qc.invalidateQueries({ queryKey: ["rooms"] });
  };

  const deleteRoom = async () => {
    if (!deletingRoom) return;
    setDeleteBusy(true);
    const { count, error: countError } = await supabase
      .from("room_bookings")
      .select("id", { count: "exact", head: true })
      .eq("room_id", deletingRoom.id)
      .eq("status", "confirmed")
      .gte("booking_date", todayISODateIST());

    if (countError) {
      setDeleteBusy(false);
      toast.error(countError.message);
      return;
    }

    if ((count ?? 0) > 0) {
      setDeleteBusy(false);
      toast.error("Cannot delete room with active future bookings. Cancel them first.");
      return;
    }

    const { error } = await supabase.from("office_rooms").delete().eq("id", deletingRoom.id);
    setDeleteBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Room deleted");
    setDeletingRoom(null);
    invalidateRooms();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rooms</h2>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  No rooms yet.
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">
                    <div>{room.room_code}</div>
                    <div className="text-sm text-muted-foreground">{room.room_name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {room.room_type === "meeting_room" ? "Meeting Room" : "Call Booth"}
                    </Badge>
                  </TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <RoomFeatureBadges room={room} />
                  </TableCell>
                  <TableCell>
                    {room.is_active ? (
                      <Badge className="bg-success text-success-foreground">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingRoom(room)}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeletingRoom(room)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <RoomDialog
        open={addOpen}
        title="Add room"
        initialValues={emptyRoomForm}
        showActive={false}
        onClose={() => setAddOpen(false)}
        onSave={async (values) => {
          const { error } = await supabase.from("office_rooms").insert({
            room_code: values.room_code.trim(),
            room_name: values.room_name.trim(),
            room_type: values.room_type,
            capacity: values.capacity,
            has_projector: values.has_projector,
            has_whiteboard: values.has_whiteboard,
            has_video_conf: values.has_video_conf,
            is_active: true,
          });
          if (error) {
            toast.error(error.message);
            return false;
          }
          toast.success("Room created");
          setAddOpen(false);
          invalidateRooms();
          return true;
        }}
      />

      {editingRoom && (
        <RoomDialog
          open
          title="Edit room"
          initialValues={{
            room_code: editingRoom.room_code,
            room_name: editingRoom.room_name,
            room_type: editingRoom.room_type,
            capacity: editingRoom.capacity,
            has_projector: editingRoom.has_projector,
            has_whiteboard: editingRoom.has_whiteboard,
            has_video_conf: editingRoom.has_video_conf,
            is_active: editingRoom.is_active,
          }}
          showActive
          onClose={() => setEditingRoom(null)}
          onSave={async (values) => {
            const { error } = await supabase
              .from("office_rooms")
              .update({
                room_code: values.room_code.trim(),
                room_name: values.room_name.trim(),
                room_type: values.room_type,
                capacity: values.capacity,
                has_projector: values.has_projector,
                has_whiteboard: values.has_whiteboard,
                has_video_conf: values.has_video_conf,
                is_active: values.is_active,
              })
              .eq("id", editingRoom.id);
            if (error) {
              toast.error(error.message);
              return false;
            }
            toast.success("Room updated");
            setEditingRoom(null);
            invalidateRooms();
            return true;
          }}
        />
      )}

      <AlertDialog open={!!deletingRoom} onOpenChange={(open) => !open && setDeletingRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete room {deletingRoom?.room_code}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteRoom} disabled={deleteBusy}>
              {deleteBusy ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RoomFeatureBadges({ room }: { room: Room }) {
  return (
    <div className="flex flex-wrap gap-1.5 text-xs">
      {room.has_projector && <Badge variant="outline">Projector</Badge>}
      {room.has_whiteboard && <Badge variant="outline">Whiteboard</Badge>}
      {room.has_video_conf && <Badge variant="outline">Video Conf</Badge>}
    </div>
  );
}

function RoomDialog({
  open,
  title,
  initialValues,
  showActive = true,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  initialValues: RoomFormValues;
  showActive?: boolean;
  onClose: () => void;
  onSave: (values: RoomFormValues) => Promise<boolean>;
}) {
  const [values, setValues] = useState(initialValues);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const update = <K extends keyof RoomFormValues>(key: K, value: RoomFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.room_name.trim()) {
      toast.error("Enter room name");
      return;
    }
    if (!values.room_code.trim()) {
      toast.error("Enter room code");
      return;
    }
    if (!values.capacity || values.capacity < 1) {
      toast.error("Enter capacity");
      return;
    }
    setBusy(true);
    const saved = await onSave(values);
    setBusy(false);
    if (saved) setValues(initialValues);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="room-code">Room code</Label>
            <Input
              id="room-code"
              required
              value={values.room_code}
              onChange={(e) => update("room_code", e.target.value)}
              placeholder="R-01"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="room-name">Room name</Label>
            <Input
              id="room-name"
              required
              value={values.room_name}
              onChange={(e) => update("room_name", e.target.value)}
              placeholder="Great Room"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={values.room_type} onValueChange={(v) => update("room_type", v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting_room">Meeting Room</SelectItem>
                <SelectItem value="call_room">Call Booth</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={String(values.capacity)}
              onChange={(e) => update("capacity", Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>Projector</span>
              <Switch checked={values.has_projector} onCheckedChange={(c) => update("has_projector", c)} />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>Whiteboard</span>
              <Switch checked={values.has_whiteboard} onCheckedChange={(c) => update("has_whiteboard", c)} />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>Video Conference</span>
              <Switch checked={values.has_video_conf} onCheckedChange={(c) => update("has_video_conf", c)} />
            </label>
            {showActive && (
              <label className="flex items-center justify-between gap-3 text-sm">
                <span>Active</span>
                <Switch checked={values.is_active} onCheckedChange={(c) => update("is_active", c)} />
              </label>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
