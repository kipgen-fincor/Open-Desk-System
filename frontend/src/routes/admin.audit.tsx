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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type DeskAuditLog = RawAuditRow & {
  booking_id: string | null;
};

type RoomAuditLog = RawAuditRow & {
  room_booking_id: string | null;
};

type OfficeBookingLookup = {
  id: string;
  desk_id: string | null;
};

type OfficeDeskLookup = {
  id: string;
  desk_code: string | null;
};

type RoomBookingLookup = {
  id: string;
  room_id: string | null;
};

type OfficeRoomLookup = {
  id: string;
  room_name: string | null;
  room_code: string | null;
};

function AuditAdmin() {
  const USER_FILTER_ALL_VALUE = "__all__";
  const [filter, setFilter] = useState<AuditFilter>("all");
  const [selectedUser, setSelectedUser] = useState<string>(USER_FILTER_ALL_VALUE);
  const [usernameQuery, setUsernameQuery] = useState<string>("");
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

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
      const rawDeskLogs = (deskLogs.data ?? []) as DeskAuditLog[];
      const rawRoomLogs = (roomLogs.data ?? []) as RoomAuditLog[];

      const bookingIds = Array.from(
        new Set(
          rawDeskLogs
            .map((r) => r.booking_id)
            .filter((v): v is string => v !== null && v !== undefined),
        ),
      );

      const roomBookingIds = Array.from(
        new Set(
          rawRoomLogs
            .map((r) => r.room_booking_id)
            .filter((v): v is string => v !== null && v !== undefined),
        ),
      );

      // 3) fetch office_bookings and map to desk codes
      const deskCodeByBookingId: Record<string, string | null> = {};
      if (bookingIds.length > 0) {
        const { data: officeBookings, error: officeBookingsError } = await supabase
          .from("office_bookings")
          .select("id, desk_id")
          .in("id", bookingIds);
        if (officeBookingsError) throw officeBookingsError;

        const typedOfficeBookings = (officeBookings ?? []) as OfficeBookingLookup[];
        const deskIds = Array.from(
          new Set(typedOfficeBookings.map((b) => b.desk_id).filter((v): v is string => !!v)),
        );
        let desks: OfficeDeskLookup[] = [];
        if (deskIds.length > 0) {
          const { data: officeDesks, error: officeDesksError } = await supabase
            .from("office_desks")
            .select("id, desk_code")
            .in("id", deskIds);
          if (officeDesksError) throw officeDesksError;
          desks = (officeDesks ?? []) as OfficeDeskLookup[];
        }

        const deskCodeById: Record<string, string | null> = {};
        for (const d of desks) deskCodeById[d.id] = d.desk_code ?? null;
        for (const b of typedOfficeBookings) {
          deskCodeByBookingId[b.id] = b.desk_id ? (deskCodeById[b.desk_id] ?? null) : null;
        }
      }

      // 4) fetch room_bookings and map to room names
      const roomNameByBookingId: Record<string, string | null> = {};
      if (roomBookingIds.length > 0) {
        const { data: roomBookings, error: roomBookingsError } = await supabase
          .from("room_bookings")
          .select("id, room_id")
          .in("id", roomBookingIds);
        if (roomBookingsError) throw roomBookingsError;

        const typedRoomBookings = (roomBookings ?? []) as RoomBookingLookup[];
        const roomIds = Array.from(
          new Set(typedRoomBookings.map((b) => b.room_id).filter((v): v is string => !!v)),
        );
        let rooms: OfficeRoomLookup[] = [];
        if (roomIds.length > 0) {
          const { data: officeRooms, error: officeRoomsError } = await supabase
            .from("office_rooms")
            .select("id, room_name, room_code")
            .in("id", roomIds);
          if (officeRoomsError) throw officeRoomsError;
          rooms = (officeRooms ?? []) as OfficeRoomLookup[];
        }

        const roomNameById: Record<string, { name?: string | null; code?: string | null }> = {};
        for (const r of rooms) {
          roomNameById[r.id] = { name: r.room_name ?? null, code: r.room_code ?? null };
        }
        for (const b of typedRoomBookings) {
          const rr = b.room_id ? roomNameById[b.room_id] : undefined;
          roomNameByBookingId[b.id] = rr?.name ?? rr?.code ?? null;
        }
      }

      // 5) merge results in JS and return normalized AuditRow[]
      const deskRows = rawDeskLogs.map((r) => ({
        id: r.id,
        action: r.action ?? r.action_type ?? "—",
        created_at: r.created_at,
        user: getUserFullName(r.user_profiles),
        source: "desk" as AuditSource,
        booking: r.booking_id ? (deskCodeByBookingId[r.booking_id] ?? null) : null,
      }));

      const roomRows = rawRoomLogs.map((r) => ({
        id: r.id,
        action: r.action ?? r.action_type ?? "—",
        created_at: r.created_at,
        user: getUserFullName(r.user_profiles),
        source: "room" as AuditSource,
        booking: r.room_booking_id ? (roomNameByBookingId[r.room_booking_id] ?? null) : null,
      }));

      return [...deskRows, ...roomRows].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    },
  });

  const usernames = Array.from(
    new Set(rows.map((row) => row.user).filter((name): name is string => !!name)),
  ).sort((a, b) => a.localeCompare(b));

  const filteredUsernames = usernames.filter((name) =>
    name.toLowerCase().includes(usernameQuery.toLowerCase()),
  );

  const filteredRows = rows.filter((row) => {
    const matchesSource = filter === "all" ? true : row.source === filter;
    const matchesUser = selectedUser === USER_FILTER_ALL_VALUE ? true : row.user === selectedUser;
    const matchesAction =
      selectedActions.length === 0
        ? true
        : selectedActions.some((action) => action.toLowerCase() === row.action.toLowerCase());

    return matchesSource && matchesUser && matchesAction;
  });

  const actionOptions = ["Created", "Cancelled", "Modified", "Updated"];
  const filterControlClass = "h-8 rounded-md px-3 text-xs font-medium";

  return (
    <Card className="overflow-hidden">
      {error ? (
        <div className="p-6 text-sm text-destructive">
          Failed to load audit logs: {(error as Error).message}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === "all"}
                className={filterControlClass}
                onClick={() => setFilter("all")}
              >
                All
              </FilterButton>
              <FilterButton
                active={filter === "desk"}
                className={filterControlClass}
                onClick={() => setFilter("desk")}
              >
                Desk Bookings
              </FilterButton>
              <FilterButton
                active={filter === "room"}
                className={filterControlClass}
                onClick={() => setFilter("room")}
              >
                Room Bookings
              </FilterButton>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedUser} onValueChange={(value) => setSelectedUser(value)}>
                <SelectTrigger
                  className={cn(filterControlClass, "w-auto min-w-[118px] bg-background")}
                >
                  <SelectValue placeholder="Filter by User" />
                </SelectTrigger>
                <SelectContent className="max-h-[340px]">
                  <div className="px-3 pb-2 pt-2">
                    <Input
                      placeholder="Search users..."
                      value={usernameQuery}
                      onChange={(event) => setUsernameQuery(event.target.value)}
                      className="h-9"
                    />
                  </div>
                  <SelectItem value={USER_FILTER_ALL_VALUE} className="text-xs font-medium">
                    All Users
                  </SelectItem>
                  {filteredUsernames.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No users found.</div>
                  ) : (
                    filteredUsernames.map((username) => (
                      <SelectItem key={username} value={username}>
                        {username}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(filterControlClass, "w-auto justify-between")}
                  >
                    {selectedActions.length > 0 ? selectedActions.join(", ") : "Action"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[260px]">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Actions</p>
                      <p className="text-sm text-muted-foreground">Select one or more actions.</p>
                    </div>
                    <div className="space-y-2">
                      {actionOptions.map((action) => (
                        <label
                          key={action}
                          className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium"
                        >
                          <Checkbox
                            checked={selectedActions.includes(action)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedActions((prev) => [...prev, action]);
                              } else {
                                setSelectedActions((prev) =>
                                  prev.filter((item) => item !== action),
                                );
                              }
                            }}
                          />
                          <span>{action}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedActions([])}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
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
                      <ActionBadge action={row.action} />
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
  className,
  onClick,
  children,
}: {
  active: boolean;
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      className={cn(!active && "bg-card", className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ActionBadge({ action }: { action: string }) {
  const normalized = action.replace(/[\s-]+/g, "_").toUpperCase();
  const colorClass = getActionBadgeClass(normalized);

  return (
    <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", colorClass)}>
      {action}
    </Badge>
  );
}

function getActionBadgeClass(action: string) {
  if (/(CREATE|CREATED|BOOKING_CREATED|SUCCESS|ASSIGNED)/.test(action)) {
    return "bg-emerald-100 text-emerald-800";
  }
  if (/(UPDATE|MODIFIED|CHANGE|CHANGED|EDIT)/.test(action)) {
    return "bg-teal-100 text-teal-800";
  }
  if (/(CANCEL|DELETE|REMOVED|RELEASED)/.test(action)) {
    return "bg-red-100 text-red-800";
  }
  if (/(LOGIN|AUTH)/.test(action)) {
    return "bg-indigo-100 text-indigo-800";
  }
  if (/(SYSTEM|AUTO_RELEASE|AUTO)/.test(action)) {
    return "bg-amber-100 text-amber-800";
  }
  if (/(ERROR|FAILED|FAILURE)/.test(action)) {
    return "bg-red-100 text-red-800";
  }
  return "bg-slate-100 text-slate-700";
}

function TypeBadge({ source }: { source: AuditSource }) {
  if (source === "room") {
    return <Badge className="bg-secondary text-secondary-foreground">Room</Badge>;
  }
  return <Badge className="bg-muted text-muted-foreground">Desk</Badge>;
}
