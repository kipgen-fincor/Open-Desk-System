import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

function AdminBookings() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [changeBooking, setChangeBooking] = useState<any | null>(null);

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-all-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_bookings")
        .select(
          "id, booking_date, status, created_at, user_id, desk_id, user_profiles!office_bookings_user_id_fkey(full_name, email), office_desks(desk_code, office_zones(zone_code))",
        )
        .order("booking_date", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const doCancel = async () => {
    if (!confirmCancel || !user) return;
    const id = confirmCancel;
    const { error } = await supabase
      .from("office_bookings")
      .update({ status: "cancelled", cancelled_by_user_id: user.id })
      .eq("id", id);
    setConfirmCancel(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Booking cancelled");
    qc.invalidateQueries({ queryKey: ["admin-all-bookings"] });
    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: id,
        action_type: "cancelled_by_admin",
        performed_by_user_id: user.id,
        action_notes: "Cancelled by admin",
        action: "cancelled",
        table_name: "office_bookings",
        record_id: id,
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Desk Bookings</h2>
        <Button onClick={() => setAssignOpen(true)}>Assign desk</Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Desk</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Booked</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  No bookings.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">
                    {b.user_profiles?.full_name || b.user_profiles?.email || "—"}
                  </TableCell>
                  <TableCell>
                    {b.office_desks?.office_zones?.zone_code}-{b.office_desks?.desk_code}
                  </TableCell>
                  <TableCell>{formatDateLong(b.booking_date)}</TableCell>
                  <TableCell>
                    {b.status === "confirmed" ? (
                      <Badge className="bg-success text-success-foreground capitalize">
                        {b.status}
                      </Badge>
                    ) : (
                      <Badge className="bg-destructive text-destructive-foreground capitalize">
                        {b.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {b.created_at ? new Date(b.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {b.status === "confirmed" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => setChangeBooking(b)}>
                          Change Desk
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setConfirmCancel(b.id)}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!confirmCancel} onOpenChange={(v) => !v && setConfirmCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The booking will be marked cancelled and the desk released. This is logged in the
              audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction onClick={doCancel}>Cancel booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {assignOpen && (
        <AssignDeskDialog
          onClose={() => {
            setAssignOpen(false);
            qc.invalidateQueries({ queryKey: ["admin-all-bookings"] });
          }}
        />
      )}

      {changeBooking && (
        <ChangeDeskDialog
          booking={changeBooking}
          onClose={() => {
            setChangeBooking(null);
            qc.invalidateQueries({ queryKey: ["admin-all-bookings"] });
          }}
        />
      )}
    </div>
  );
}

function ChangeDeskDialog({ booking, onClose }: { booking: any; onClose: () => void }) {
  const { user: admin } = useAuth();
  const [deskId, setDeskId] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const date = booking.booking_date;
  const oldDeskCode = `${booking.office_desks?.office_zones?.zone_code}-${booking.office_desks?.desk_code}`;

  const { data: allDesks = [] } = useQuery({
    queryKey: ["admin-active-desks-change"],
    queryFn: async () => {
      const { data } = await supabase
        .from("office_desks")
        .select("id, desk_code, office_zones(zone_code)")
        .eq("is_active", true)
        .order("desk_code");
      return (data ?? []) as any[];
    },
  });

  const { data: bookedIds = [] } = useQuery({
    queryKey: ["admin-booked-desk-ids-change", date],
    queryFn: async () => {
      const { data } = await supabase
        .from("office_bookings")
        .select("desk_id")
        .eq("booking_date", date)
        .eq("status", "confirmed");
      return (data ?? []).map((r: any) => r.desk_id);
    },
  });

  const availableDesks = useMemo(
    () => allDesks.filter((d: any) => !bookedIds.includes(d.id) || d.id === booking.desk_id),
    [allDesks, bookedIds, booking.desk_id],
  ).filter((d: any) => d.id !== booking.desk_id);

  const submit = async () => {
    if (!admin) return;
    if (!deskId) {
      toast.error("Select a desk");
      return;
    }
    setBusy(true);
    const newDesk = allDesks.find((d: any) => d.id === deskId);
    const newDeskCode = `${newDesk?.office_zones?.zone_code}-${newDesk?.desk_code}`;
    const { error } = await supabase
      .from("office_bookings")
      .update({ desk_id: deskId, booking_notes: notes.trim() || null })
      .eq("id", booking.id);
    setBusy(false);
    if (error) {
      if ((error as any)?.code === "23505" || /duplicate|unique|conflict/i.test(error.message)) {
        toast.error("That desk is already taken for this date.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success(`Desk successfully changed to ${newDeskCode}`);
    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: booking.id,
        action_type: "desk_changed_by_admin",
        performed_by_user_id: admin.id,
        action_notes: `Desk changed from ${oldDeskCode} to ${newDeskCode}${notes.trim() ? ` — ${notes.trim()}` : ""}`,
        action: "updated",
        table_name: "office_bookings",
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
          <DialogTitle>Change desk</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Employee:</span>{" "}
              {booking.user_profiles?.full_name || booking.user_profiles?.email || "—"}
            </div>
            <div>
              <span className="font-medium text-foreground">Current desk:</span> {oldDeskCode}
            </div>
            <div>
              <span className="font-medium text-foreground">Date:</span> {formatDateLong(date)}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>New desk</Label>
            <Select value={deskId} onValueChange={setDeskId}>
              <SelectTrigger>
                <SelectValue placeholder="Select available desk" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {availableDesks.length === 0 ? (
                  <div className="p-2 text-xs text-muted-foreground">
                    No other desks available on this date
                  </div>
                ) : (
                  availableDesks.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.office_zones?.zone_code}-{d.desk_code}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cd-notes">Notes (optional)</Label>
            <Textarea
              id="cd-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy || !deskId}>
            {busy ? "Saving…" : "Change desk"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssignDeskDialog({ onClose }: { onClose: () => void }) {
  const { user: admin } = useAuth();
  const today = todayISODateIST();
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(today);
  const [deskId, setDeskId] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const dateBlocked = !isWithinBookingWindow(date) || isWeekend(date);

  const { data: employees = [] } = useQuery({
    queryKey: ["admin-employees"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_profiles")
        .select("id, full_name, email")
        .eq("is_active", true)
        .order("full_name");
      return (data ?? []) as { id: string; full_name: string | null; email: string }[];
    },
  });

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

  const { data: allDesks = [] } = useQuery({
    queryKey: ["admin-active-desks"],
    queryFn: async () => {
      const { data } = await supabase
        .from("office_desks")
        .select("id, desk_code, office_zones(zone_code)")
        .eq("is_active", true)
        .order("desk_code");
      return (data ?? []) as any[];
    },
  });

  const { data: bookedIds = [] } = useQuery({
    queryKey: ["admin-booked-desk-ids", date],
    queryFn: async () => {
      const { data } = await supabase
        .from("office_bookings")
        .select("desk_id")
        .eq("booking_date", date)
        .eq("status", "confirmed");
      return (data ?? []).map((r: any) => r.desk_id);
    },
  });

  const availableDesks = useMemo(
    () => allDesks.filter((d: any) => !bookedIds.includes(d.id)),
    [allDesks, bookedIds],
  );

  const submit = async () => {
    if (!admin) return;
    if (!employeeId) {
      toast.error("Select an employee");
      return;
    }
    if (!deskId) {
      toast.error("Select a desk");
      return;
    }
    if (dateBlocked) {
      toast.error("Date not bookable");
      return;
    }
    if (holiday) {
      toast.error("Date is a public holiday");
      return;
    }
    setBusy(true);
    const { data: inserted, error } = await supabase
      .from("office_bookings")
      .insert({
        user_id: employeeId,
        desk_id: deskId,
        booking_date: date,
        status: "confirmed",
        booking_notes: notes.trim() || null,
      })
      .select("id")
      .single();
    setBusy(false);
    if (error || !inserted) {
      toast.error(error?.message ?? "Could not create booking");
      return;
    }
    toast.success("Desk assigned");
    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: inserted.id,
        action_type: "assigned_by_admin",
        performed_by_user_id: admin.id,
        action_notes: `Admin assigned desk for ${date}`,
        action: "booked",
        table_name: "office_bookings",
        record_id: inserted.id,
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
          <DialogTitle>Assign desk to employee</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.full_name || e.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ad-date">Date</Label>
            <Input
              id="ad-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {holiday && <p className="text-xs text-destructive">Public holiday: {holiday}</p>}
            {isWeekend(date) && <p className="text-xs text-destructive">Weekends not bookable</p>}
            {!isWithinBookingWindow(date) && (
              <p className="text-xs text-destructive">Outside 7-day window</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Available desk</Label>
            <Select value={deskId} onValueChange={setDeskId}>
              <SelectTrigger>
                <SelectValue placeholder="Select desk" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {availableDesks.length === 0 ? (
                  <div className="p-2 text-xs text-muted-foreground">
                    No desks available on this date
                  </div>
                ) : (
                  availableDesks.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.office_zones?.zone_code}-{d.desk_code}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ad-notes">Notes (optional)</Label>
            <Textarea
              id="ad-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy || dateBlocked || !!holiday}>
            {busy ? "Assigning…" : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
