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

export const Route = createFileRoute("/admin/desks")({
  component: DesksAdmin,
});

type ZoneOption = {
  id: string;
  zone_code: string;
  is_active: boolean;
};

type DeskWithZone = {
  id: string;
  desk_code: string;
  zone_id: string;
  has_monitor: boolean;
  has_standing_desk: boolean;
  has_locker: boolean;
  has_whiteboard: boolean;
  is_active: boolean;
  office_zones: { zone_code: string };
};

type DeskFormValues = {
  desk_code: string;
  zone_id: string;
  has_monitor: boolean;
  has_standing_desk: boolean;
  has_locker: boolean;
  has_whiteboard: boolean;
  is_active: boolean;
};

const emptyDeskForm: DeskFormValues = {
  desk_code: "",
  zone_id: "",
  has_monitor: false,
  has_standing_desk: false,
  has_locker: false,
  has_whiteboard: false,
  is_active: true,
};

function DesksAdmin() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editingDesk, setEditingDesk] = useState<DeskWithZone | null>(null);
  const [deletingDesk, setDeletingDesk] = useState<DeskWithZone | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const { data: zones = [] } = useQuery({
    queryKey: ["zones-for-desks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_zones")
        .select("id, zone_code, is_active")
        .order("zone_code");
      if (error) throw error;
      return (data ?? []) as ZoneOption[];
    },
  });

  const { data: desks = [] } = useQuery({
    queryKey: ["admin-desks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_desks")
        .select(
          "id, desk_code, zone_id, has_monitor, has_standing_desk, has_locker, has_whiteboard, is_active, office_zones(zone_code)",
        )
        .order("desk_code");
      if (error) throw error;
      return data as unknown as DeskWithZone[];
    },
  });

  const activeZones = zones.filter((zone) => zone.is_active);

  const invalidateDesks = () => {
    qc.invalidateQueries({ queryKey: ["admin-desks"] });
    qc.invalidateQueries({ queryKey: ["desks"] });
  };

  const deleteDesk = async () => {
    if (!deletingDesk) return;
    setDeleteBusy(true);
    const { count, error: countError } = await supabase
      .from("office_bookings")
      .select("id", { count: "exact", head: true })
      .eq("desk_id", deletingDesk.id)
      .eq("status", "confirmed")
      .gte("booking_date", todayISODateIST());

    if (countError) {
      setDeleteBusy(false);
      toast.error(countError.message);
      return;
    }

    if ((count ?? 0) > 0) {
      setDeleteBusy(false);
      toast.error("Cannot delete desk with active future bookings. Cancel them first.");
      return;
    }

    const { error } = await supabase.from("office_desks").delete().eq("id", deletingDesk.id);
    setDeleteBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Desk deleted");
    setDeletingDesk(null);
    invalidateDesks();
  };

  const featureKeys = [
    ["has_monitor", "Monitor"],
    ["has_standing_desk", "Standing"],
    ["has_locker", "Locker"],
    ["has_whiteboard", "Whiteboard"],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Desks</h2>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Desk
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Desk</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {desks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                  No desks yet.
                </TableCell>
              </TableRow>
            ) : (
              desks.map((desk) => {
                const features =
                  featureKeys
                    .map(([key, label]) => (desk[key] ? label : null))
                    .filter(Boolean)
                    .join(" · ") || "—";

                return (
                  <TableRow key={desk.id}>
                    <TableCell className="font-medium">{desk.desk_code}</TableCell>
                    <TableCell>{desk.office_zones?.zone_code}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{features}</TableCell>
                    <TableCell>
                      {desk.is_active ? (
                        <Badge className="bg-success text-success-foreground">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingDesk(desk)}>
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeletingDesk(desk)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <DeskDialog
        open={addOpen}
        title="Add desk"
        zones={activeZones}
        initialValues={emptyDeskForm}
        showActive={false}
        onClose={() => setAddOpen(false)}
        onSave={async (values) => {
          const { error } = await supabase.from("office_desks").insert({
            zone_id: values.zone_id,
            desk_code: values.desk_code.trim(),
            has_monitor: values.has_monitor,
            has_standing_desk: values.has_standing_desk,
            has_locker: values.has_locker,
            has_whiteboard: values.has_whiteboard,
            is_active: true,
          });
          if (error) {
            if (error.message.includes("is at full capacity")) {
              toast.error(
                "This zone has reached its maximum desk capacity. Ask an admin to increase the zone capacity or remove unused desks.",
              );
              return false;
            }
            toast.error(error.message);
            return false;
          }
          toast.success("Desk created");
          setAddOpen(false);
          invalidateDesks();
          return true;
        }}
      />

      {editingDesk && (
        <DeskDialog
          open
          title="Edit desk"
          zones={zones}
          showActive
          initialValues={{
            desk_code: editingDesk.desk_code,
            zone_id: editingDesk.zone_id,
            has_monitor: editingDesk.has_monitor,
            has_standing_desk: editingDesk.has_standing_desk,
            has_locker: editingDesk.has_locker,
            has_whiteboard: editingDesk.has_whiteboard,
            is_active: editingDesk.is_active,
          }}
          onClose={() => setEditingDesk(null)}
          onSave={async (values) => {
            const { error } = await supabase
              .from("office_desks")
              .update({
                zone_id: values.zone_id,
                desk_code: values.desk_code.trim(),
                has_monitor: values.has_monitor,
                has_standing_desk: values.has_standing_desk,
                has_locker: values.has_locker,
                has_whiteboard: values.has_whiteboard,
                is_active: values.is_active,
              })
              .eq("id", editingDesk.id);
            if (error) {
              toast.error(error.message);
              return false;
            }
            toast.success("Desk updated");
            setEditingDesk(null);
            invalidateDesks();
            return true;
          }}
        />
      )}

      <AlertDialog open={!!deletingDesk} onOpenChange={(open) => !open && setDeletingDesk(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete desk {deletingDesk?.desk_code}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteDesk} disabled={deleteBusy}>
              {deleteBusy ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DeskDialog({
  open,
  title,
  zones,
  initialValues,
  showActive = true,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  zones: ZoneOption[];
  initialValues: DeskFormValues;
  showActive?: boolean;
  onClose: () => void;
  onSave: (values: DeskFormValues) => Promise<boolean>;
}) {
  const [values, setValues] = useState(initialValues);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const update = <K extends keyof DeskFormValues>(key: K, value: DeskFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!values.zone_id) {
      toast.error("Select a zone");
      return;
    }
    setBusy(true);
    const saved = await onSave(values);
    setBusy(false);
    if (saved) setValues(initialValues);
  };

  const toggleKeys = [
    ["has_monitor", "Monitor"],
    ["has_standing_desk", "Standing desk"],
    ["has_locker", "Locker"],
    ["has_whiteboard", "Whiteboard"],
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="desk-code">Desk code</Label>
            <Input
              id="desk-code"
              required
              value={values.desk_code}
              onChange={(event) => update("desk_code", event.target.value)}
              placeholder="A-01"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Zone</Label>
            <Select value={values.zone_id} onValueChange={(value) => update("zone_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.zone_code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            {toggleKeys.map(([key, label]) => (
              <label key={key} className="flex items-center justify-between gap-3 text-sm">
                <span>{label}</span>
                <Switch checked={values[key]} onCheckedChange={(checked) => update(key, checked)} />
              </label>
            ))}
            {showActive && (
              <label className="flex items-center justify-between gap-3 text-sm">
                <span>Active</span>
                <Switch
                  checked={values.is_active}
                  onCheckedChange={(checked) => update("is_active", checked)}
                />
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
