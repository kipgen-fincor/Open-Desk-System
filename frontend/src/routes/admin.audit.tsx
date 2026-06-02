import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/audit")({
  component: AuditAdmin,
});

type AuditSource = "desk" | "room";
type AuditFilter = "all" | AuditSource;

type AuditRow = {
  id: string;
  action: string;
  created_at: string;
  user: string | null;
  source: AuditSource;
  booking: string | null;
};

type RawAuditRow = {
  id: string;
  action: string | null;
  action_type: string | null;
  created_at: string;
  user_profiles?: { full_name: string | null } | { full_name: string | null }[] | null;
  booking_id?: string | null;
  room_booking_id?: string | null;
};

function AuditAdmin() {
  const [filter, setFilter] = useState<AuditFilter>("all");
  const {
    data: rows = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: async () => {
      // 1) fetch audit logs rows normally (no nested joins)
      const [deskLogs, roomLogs] = await Promise.all([
        supabase
          .from("office_audit_logs")
          .select(
            "id, action, action_type, created_at, booking_type, booking_id, user_profiles!office_audit_logs_performed_by_user_id_fkey(full_name)",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("room_audit_logs")
          .select(
            "id, action, action_type, created_at, room_booking_id, user_profiles!room_audit_logs_performed_by_user_id_fkey(full_name)",
          )
          .order("created_at", { ascending: false }),
      ]);

      if (deskLogs.error) throw deskLogs.error;
      if (roomLogs.error) throw roomLogs.error;

      // 2) extract booking ids
      const bookingIds = Array.from(
        new Set(
          (deskLogs.data ?? [])
            .map((r: any) => r.booking_id)
            .filter((v: any) => v !== null && v !== undefined),
        ),
      ) as string[];

      const roomBookingIds = Array.from(
        new Set(
          (roomLogs.data ?? [])
            .map((r: any) => r.room_booking_id)
            .filter((v: any) => v !== null && v !== undefined),
        ),
      ) as string[];

      // 3) fetch office_bookings and map to desk codes
      const deskCodeByBookingId: Record<string, string | null> = {};
      if (bookingIds.length > 0) {
        const { data: officeBookings, error: officeBookingsError } = await supabase
          .from("office_bookings")
          .select("id, desk_id")
          .in("id", bookingIds as any[]);
        if (officeBookingsError) throw officeBookingsError;

        const deskIds = Array.from(new Set((officeBookings ?? []).map((b: any) => b.desk_id).filter(Boolean)));
        let desks: any[] = [];
        if (deskIds.length > 0) {
          const { data: officeDesks, error: officeDesksError } = await supabase
            .from("office_desks")
            .select("id, desk_code")
            .in("id", deskIds as any[]);
          if (officeDesksError) throw officeDesksError;
          desks = officeDesks ?? [];
        }

        const deskCodeById: Record<string, string | null> = {};
        for (const d of desks) deskCodeById[d.id] = d.desk_code ?? null;
        for (const b of officeBookings ?? []) {
          deskCodeByBookingId[b.id] = deskCodeById[b.desk_id] ?? null;
        }
      }

      // 4) fetch room_bookings and map to room names
      const roomNameByBookingId: Record<string, string | null> = {};
      if (roomBookingIds.length > 0) {
        const { data: roomBookings, error: roomBookingsError } = await supabase
          .from("room_bookings")
          .select("id, room_id")
          .in("id", roomBookingIds as any[]);
        if (roomBookingsError) throw roomBookingsError;

        const roomIds = Array.from(new Set((roomBookings ?? []).map((b: any) => b.room_id).filter(Boolean)));
        let rooms: any[] = [];
        if (roomIds.length > 0) {
          const { data: officeRooms, error: officeRoomsError } = await supabase
            .from("office_rooms")
            .select("id, room_name, room_code")
            .in("id", roomIds as any[]);
          if (officeRoomsError) throw officeRoomsError;
          rooms = officeRooms ?? [];
        }

        const roomNameById: Record<string, { name?: string | null; code?: string | null }> = {};
        for (const r of rooms) roomNameById[r.id] = { name: r.room_name ?? null, code: r.room_code ?? null };
        for (const b of roomBookings ?? []) {
          const rr = roomNameById[b.room_id];
          roomNameByBookingId[b.id] = rr?.name ?? rr?.code ?? null;
        }
      }

      // 5) merge results in JS and return normalized AuditRow[]
      const deskRows = (deskLogs.data ?? []).map((r: any) => ({
        id: r.id,
        action: r.action ?? r.action_type ?? "—",
        created_at: r.created_at,
        user: getUserFullName(r.user_profiles),
        source: "desk" as AuditSource,
        booking: deskCodeByBookingId[r.booking_id] ?? null,
      }));

      const roomRows = (roomLogs.data ?? []).map((r: any) => ({
        id: r.id,
        action: r.action ?? r.action_type ?? "—",
        created_at: r.created_at,
        user: getUserFullName(r.user_profiles),
        source: "room" as AuditSource,
        booking: roomNameByBookingId[r.room_booking_id] ?? null,
      }));

      return [...deskRows, ...roomRows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
  });

  const filteredRows = filter === "all" ? rows : rows.filter((row) => row.source === filter);

  return (
    <Card className="overflow-hidden">
      {error ? (
        <div className="p-6 text-sm text-destructive">
          Failed to load audit logs: {(error as Error).message}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 border-b border-border p-4">
            <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterButton>
            <FilterButton active={filter === "desk"} onClick={() => setFilter("desk")}>
              Desk Bookings
            </FilterButton>
            <FilterButton active={filter === "room"} onClick={() => setFilter("room")}>
              Room Bookings
            </FilterButton>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    No audit entries.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <TableRow key={`${row.source}-${row.id}`}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.action}</Badge>
                    </TableCell>
                    <TableCell>
                      <TypeBadge source={row.source} />
                    </TableCell>
                    <TableCell className="text-sm">{row.booking || "—"}</TableCell>
                    <TableCell className="text-sm">{row.user || "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}
    </Card>
  );
}



function getUserFullName(profile: RawAuditRow["user_profiles"]): string | null {
  if (Array.isArray(profile)) return profile[0]?.full_name ?? null;
  return profile?.full_name ?? null;
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      className={cn(!active && "bg-card")}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function TypeBadge({ source }: { source: AuditSource }) {
  if (source === "room") {
    return <Badge className="bg-secondary text-secondary-foreground">Room</Badge>;
  }
  return <Badge className="bg-muted text-muted-foreground">Desk</Badge>;
}
