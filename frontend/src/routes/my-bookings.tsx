import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { canCancel, formatDateLong, todayISODateIST } from "@/lib/date-utils";
import { toast } from "sonner";

export const Route = createFileRoute("/my-bookings")({
  component: () => (
    <AppShell>
      <MyBookings />
    </AppShell>
  ),
});

function MyBookings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My bookings</h1>
      <Tabs defaultValue="desks">
        <TabsList>
          <TabsTrigger value="desks">Desks</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>
        <TabsContent value="desks" className="mt-4">
          <DeskBookings />
        </TabsContent>
        <TabsContent value="rooms" className="mt-4">
          <RoomBookings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DeskBookings() {
  const { user } = useAuth();
  const today = todayISODateIST();

  const { data: bookings = [], refetch } = useQuery({
    queryKey: ["all-my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_bookings")
        .select("id, booking_date, status, office_desks(desk_code, office_zones(zone_code))")
        .eq("user_id", user!.id)
        .order("booking_date", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  const upcoming = bookings.filter(
    (b) => b.booking_date >= today && b.status === "confirmed",
  );

  const cancel = async (id: string, date: string) => {
    if (!canCancel(date)) {
      toast.error("Cancellation closed (after 6 PM IST on booking day)");
      return;
    }
    if (!user) return;
    const { error } = await supabase
      .from("office_bookings")
      .update({ status: "cancelled", cancelled_by_user_id: user.id })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Booking cancelled");
      await refetch();
      try {
        await supabase.from("office_audit_logs").insert({
          booking_id: id,
          action_type: "cancelled",
          performed_by_user_id: user.id,
          action_notes: `Booking cancelled for date ${date}`,
          action: "cancelled",
          table_name: "office_bookings",
          record_id: id,
        });
      } catch (e) {
        console.error("Audit log insert failed", e);
      }
    }
  };

  return (
    <Card className="p-6">
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming desk bookings.</p>
      ) : (
        <ul className="divide-y divide-border">
          {upcoming.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <div className="font-medium">{formatDateLong(b.booking_date)}</div>
                <div className="text-sm text-muted-foreground">
                  Desk {b.office_desks?.office_zones?.zone_code}-{b.office_desks?.desk_code}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground capitalize">{b.status}</Badge>
                {canCancel(b.booking_date) ? (
                  <Button size="sm" variant="outline" onClick={() => cancel(b.id, b.booking_date)}>
                    Cancel
                  </Button>
                ) : (
                  <Badge variant="secondary">Locked</Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function RoomBookings() {
  const { user } = useAuth();
  const today = todayISODateIST();
  const [confirmCancel, setConfirmCancel] = useState<{ id: string; date: string } | null>(null);

  const { data: bookings = [], refetch } = useQuery({
    queryKey: ["my-room-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("room_bookings")
        .select("id, booking_date, start_time, end_time, title, status, office_rooms(room_code, room_name)")
        .eq("user_id", user!.id)
        .order("booking_date", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const upcoming = bookings.filter(
    (b) => b.booking_date >= today && b.status === "confirmed",
  );

  const doCancel = async () => {
    if (!confirmCancel || !user) return;
    const id = confirmCancel.id;
    const { error } = await supabase
      .from("room_bookings")
      .update({ status: "cancelled", cancelled_by_user_id: user.id })
      .eq("id", id);
    setConfirmCancel(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Room booking cancelled");
    await refetch();
    try {
      await supabase.from("room_audit_logs").insert({
        room_booking_id: id,
        action_type: "cancelled",
        performed_by_user_id: user.id,
        action_notes: `Room booking cancelled`,
        action: "cancelled",
        table_name: "room_bookings",
        record_id: id,
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }
  };

  return (
    <>
      <Card className="p-6">
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming room bookings.</p>
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-medium">
                    {b.office_rooms?.room_code} — {b.office_rooms?.room_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateLong(b.booking_date)} · {b.start_time?.slice(0,5)}–{b.end_time?.slice(0,5)}
                    {b.title ? ` · ${b.title}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground capitalize">{b.status}</Badge>
                  <Button size="sm" variant="outline" onClick={() => setConfirmCancel({ id: b.id, date: b.booking_date })}>
                    Cancel
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AlertDialog open={!!confirmCancel} onOpenChange={(v) => !v && setConfirmCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel room booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will release the slot. The booking will remain in your history as cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction onClick={doCancel}>Cancel booking</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
