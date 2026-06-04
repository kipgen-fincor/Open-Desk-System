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
import { supabase, type OfficeZone } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/zones")({
  component: ZonesAdmin,
});

type ZoneFormValues = {
  zone_code: string;
  description: string;
  total_capacity: number;
  is_active: boolean;
};

const emptyZoneForm: ZoneFormValues = {
  zone_code: "",
  description: "",
  total_capacity: 10,
  is_active: true,
};

function ZonesAdmin() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<OfficeZone | null>(null);
  const [deletingZone, setDeletingZone] = useState<OfficeZone | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const { data: zones = [] } = useQuery({
    queryKey: ["admin-zones"],
    queryFn: async () => {
      const { data, error } = await supabase.from("office_zones").select("*").order("zone_code");
      if (error) throw error;
      return data as OfficeZone[];
    },
  });

  const invalidateZones = () => {
    qc.invalidateQueries({ queryKey: ["admin-zones"] });
    qc.invalidateQueries({ queryKey: ["zones-for-desks"] });
  };

  const deleteZone = async () => {
    if (!deletingZone) return;
    setDeleteBusy(true);
    const { count, error: countError } = await supabase
      .from("office_desks")
      .select("id", { count: "exact", head: true })
      .eq("zone_id", deletingZone.id)
      .eq("is_active", true);

    if (countError) {
      setDeleteBusy(false);
      toast.error(countError.message);
      return;
    }

    if ((count ?? 0) > 0) {
      setDeleteBusy(false);
      toast.error("Cannot delete zone with active desks.");
      return;
    }

    const { error } = await supabase.from("office_zones").delete().eq("id", deletingZone.id);
    setDeleteBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Zone deleted");
    setDeletingZone(null);
    invalidateZones();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Zones</h2>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Zone
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                  No zones yet.
                </TableCell>
              </TableRow>
            ) : (
              zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.zone_code}</TableCell>
                  <TableCell>{zone.description ?? "—"}</TableCell>
                  <TableCell>{zone.total_capacity}</TableCell>
                  <TableCell>
                    {zone.is_active ? (
                      <Badge className="bg-success text-success-foreground">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingZone(zone)}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeletingZone(zone)}>
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

      <ZoneDialog
        open={addOpen}
        title="Add zone"
        initialValues={emptyZoneForm}
        showActive={false}
        onClose={() => setAddOpen(false)}
        onSave={async (values) => {
          const { error } = await supabase.from("office_zones").insert({
            zone_code: values.zone_code.trim().toUpperCase(),
            description: values.description.trim() || null,
            total_capacity: values.total_capacity,
            is_active: true,
          });
          if (error) {
            toast.error(error.message);
            return false;
          }
          toast.success("Zone created");
          setAddOpen(false);
          invalidateZones();
          return true;
        }}
      />

      {editingZone && (
        <ZoneDialog
          open
          title="Edit zone"
          showActive
          initialValues={{
            zone_code: editingZone.zone_code,
            description: editingZone.description ?? "",
            total_capacity: editingZone.total_capacity,
            is_active: editingZone.is_active,
          }}
          onClose={() => setEditingZone(null)}
          onSave={async (values) => {
            const { error } = await supabase
              .from("office_zones")
              .update({
                zone_code: values.zone_code.trim().toUpperCase(),
                description: values.description.trim() || null,
                total_capacity: values.total_capacity,
                is_active: values.is_active,
              })
              .eq("id", editingZone.id);
            if (error) {
              toast.error(error.message);
              return false;
            }
            toast.success("Zone updated");
            setEditingZone(null);
            invalidateZones();
            return true;
          }}
        />
      )}

      <AlertDialog open={!!deletingZone} onOpenChange={(open) => !open && setDeletingZone(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete zone {deletingZone?.zone_code}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteZone} disabled={deleteBusy}>
              {deleteBusy ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ZoneDialog({
  open,
  title,
  initialValues,
  showActive = true,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  initialValues: ZoneFormValues;
  showActive?: boolean;
  onClose: () => void;
  onSave: (values: ZoneFormValues) => Promise<boolean>;
}) {
  const [values, setValues] = useState(initialValues);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const update = <K extends keyof ZoneFormValues>(key: K, value: ZoneFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!Number.isFinite(values.total_capacity) || values.total_capacity < 1) {
      toast.error("Total capacity is required");
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
            <Label htmlFor="zone-code">Zone code</Label>
            <Input
              id="zone-code"
              required
              value={values.zone_code}
              onChange={(event) => update("zone_code", event.target.value)}
              placeholder="A"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="zone-description">Description</Label>
            <Input
              id="zone-description"
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Window side"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="zone-capacity">Total capacity</Label>
            <Input
              id="zone-capacity"
              required
              type="number"
              min={1}
              value={values.total_capacity}
              onChange={(event) => update("total_capacity", Number(event.target.value))}
            />
          </div>
          {showActive && (
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>Active</span>
              <Switch
                checked={values.is_active}
                onCheckedChange={(checked) => update("is_active", checked)}
              />
            </label>
          )}
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
