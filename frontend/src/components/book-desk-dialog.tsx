import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Lock,
  Monitor,
  Presentation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import {
  formatDateLong,
  isWeekend,
  isWithinBookingWindow,
} from "@/lib/date-utils";
import {
  DESK_TIME_SLOTS,
  FULL_DAY_END,
  FULL_DAY_START,
  formatTimeRange,
} from "@/lib/time-slots";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type BookDeskTarget = {
  id: string;
  desk_code: string;
  has_monitor: boolean;
  has_standing_desk: boolean;
  has_locker: boolean;
  has_whiteboard: boolean;
  office_zones: { zone_code: string; description: string | null };
};

type TimeMode = "full" | "custom";

export function BookDeskDialog({
  desk,
  defaultDate,
  onClose,
}: {
  desk: BookDeskTarget;
  defaultDate: string;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const date = defaultDate;
  const [timeMode, setTimeMode] = useState<TimeMode>("full");
  const [startTime, setStartTime] = useState(FULL_DAY_START);
  const [endTime, setEndTime] = useState(FULL_DAY_END);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setSubmitError(null);
  }, [defaultDate, desk.id]);

  useEffect(() => {
    if (timeMode === "full") {
      setStartTime(FULL_DAY_START);
      setEndTime(FULL_DAY_END);
    }
  }, [timeMode]);

  const effectiveStart = timeMode === "full" ? FULL_DAY_START : startTime;
  const effectiveEnd = timeMode === "full" ? FULL_DAY_END : endTime;
  const minDurationInvalid = effectiveEnd <= effectiveStart;

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

  const { data: deskTaken } = useQuery({
    queryKey: ["desk-booking-check", desk.id, date],
    queryFn: async () => {
      const { data } = await supabase
        .from("office_bookings")
        .select("id, user_id")
        .eq("desk_id", desk.id)
        .eq("booking_date", date)
        .eq("status", "confirmed")
        .maybeSingle();
      return data as { id: string; user_id: string } | null;
    },
  });

  const { data: myBookingForDate } = useQuery({
    queryKey: ["my-booking-for-date", date, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("office_bookings")
        .select("id, desk_id")
        .eq("user_id", user!.id)
        .eq("booking_date", date)
        .eq("status", "confirmed")
        .maybeSingle();
      return data as { id: string; desk_id: string } | null;
    },
  });

  const dateError = useMemo(() => {
    if (holiday) return `Public holiday: ${holiday}`;
    if (isWeekend(date)) return "Weekends are not bookable";
    if (!isWithinBookingWindow(date)) return "Outside 7-day booking window";
    return null;
  }, [date, holiday]);

  const timeError = useMemo(() => {
    if (minDurationInvalid) return "End time must be after start time";
    return null;
  }, [minDurationInvalid]);

  const availabilityError = useMemo(() => {
    if (deskTaken && deskTaken.user_id !== user?.id) {
      return "This desk is already booked for the selected date";
    }
    if (myBookingForDate && myBookingForDate.desk_id !== desk.id) {
      return "You already have another desk booking on this date";
    }
    return null;
  }, [desk.id, deskTaken, myBookingForDate, user?.id]);

  const startSlots = DESK_TIME_SLOTS.filter((s) => s !== "20:00");
  const endSlots = DESK_TIME_SLOTS.filter((s) => s > effectiveStart);

  const invalidateBookingQueries = async (bookingDate: string, userId: string) => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["bookings", bookingDate] }),
      qc.invalidateQueries({ queryKey: ["my-booking-for-date", bookingDate, userId] }),
      qc.invalidateQueries({ queryKey: ["my-bookings", userId] }),
      qc.invalidateQueries({ queryKey: ["all-my-bookings", userId] }),
      qc.invalidateQueries({ queryKey: ["desk-booking-check", desk.id, bookingDate] }),
    ]);
  };

  const submit = async () => {
    if (!user) return;
    setSubmitError(null);

    if (dateBlocked || dateError) {
      setSubmitError(dateError ?? "This date isn't bookable");
      return;
    }
    if (timeError) {
      setSubmitError(timeError);
      return;
    }
    if (availabilityError) {
      setSubmitError(availabilityError);
      return;
    }

    setBusy(true);
    const timeLabel = formatTimeRange(effectiveStart, effectiveEnd);
    const notesParts = [`Time: ${timeLabel}`];
    const trimmedMessage = message.trim();
    if (trimmedMessage) notesParts.push(trimmedMessage);
    const bookingNotes = notesParts.join("\n");

    const { data: inserted, error } = await supabase
      .from("office_bookings")
      .insert({
        user_id: user.id,
        desk_id: desk.id,
        booking_date: date,
        status: "confirmed",
        booking_notes: bookingNotes,
      })
      .select("id")
      .single();

    setBusy(false);

    if (error || !inserted) {
      const msg = error?.message ?? "Could not create booking";
      setSubmitError(msg);
      return;
    }

    const deskLabel = `${desk.office_zones.zone_code}-${desk.desk_code}`;
    toast.success(`Seat confirmed — ${deskLabel} on ${formatDateLong(date)} (${timeLabel})`, {
      duration: 4000,
    });

    await invalidateBookingQueries(date, user.id);

    try {
      await supabase.from("office_audit_logs").insert({
        booking_id: inserted.id,
        action_type: "created",
        performed_by_user_id: user.id,
        action_notes: `Booking created for ${date} ${effectiveStart}-${effectiveEnd}`,
        action: "created",
        table_name: "office_bookings",
        record_id: inserted.id,
      });
    } catch (e) {
      console.error("Audit log insert failed", e);
    }

    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>
            Book desk {desk.office_zones.zone_code}-{desk.desk_code}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{formatDateLong(date)}</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border bg-muted/30 p-3">
            <div className="text-xs uppercase text-muted-foreground">
              Zone {desk.office_zones.zone_code}
              {desk.office_zones.description ? ` · ${desk.office_zones.description}` : ""}
            </div>
            <div className="mt-1 text-lg font-semibold">{desk.desk_code}</div>
            <DeskFeatureList desk={desk} />
          </div>

          <div className="space-y-2">
            <Label>Time</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={timeMode === "full" ? "default" : "outline"}
                onClick={() => {
                  setTimeMode("full");
                  setSubmitError(null);
                }}
              >
                Full day ({formatTimeRange(FULL_DAY_START, FULL_DAY_END)})
              </Button>
              <Button
                type="button"
                size="sm"
                variant={timeMode === "custom" ? "default" : "outline"}
                onClick={() => {
                  setTimeMode("custom");
                  setSubmitError(null);
                }}
              >
                Custom time
              </Button>
            </div>

            {timeMode === "custom" ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Start</Label>
                  <Select
                    value={startTime}
                    onValueChange={(v) => {
                      setStartTime(v);
                      if (endTime <= v) {
                        const i = DESK_TIME_SLOTS.indexOf(v);
                        setEndTime(DESK_TIME_SLOTS[i + 1] ?? "20:00");
                      }
                      setSubmitError(null);
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
                      setEndTime(v);
                      setSubmitError(null);
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
                  {timeError && <p className="text-xs text-destructive">{timeError}</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {formatTimeRange(FULL_DAY_START, FULL_DAY_END)}
              </p>
            )}

            {dateError && <p className="text-xs text-destructive">{dateError}</p>}
            {availabilityError && (
              <p className="text-xs text-destructive">{availabilityError}</p>
            )}
            {submitError && !dateError && !availabilityError && (
              <p className="text-xs text-destructive">{submitError}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bd-message">Additional message (optional)</Label>
            <Textarea
              id="bd-message"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any notes for your booking…"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={
              busy ||
              !!dateBlocked ||
              !!dateError ||
              !!timeError ||
              !!availabilityError
            }
          >
            {busy ? "Confirming…" : "Confirm seat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeskFeatureList({ desk }: { desk: BookDeskTarget }) {
  const items = [
    { icon: Monitor, label: "Monitor", on: desk.has_monitor },
    { icon: ArrowUpDown, label: "Standing", on: desk.has_standing_desk },
    { icon: Lock, label: "Locker", on: desk.has_locker },
    { icon: Presentation, label: "Whiteboard", on: desk.has_whiteboard },
  ];

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((it) => (
        <Badge
          key={it.label}
          variant="outline"
          className={cn(
            "gap-1 text-xs",
            !it.on && "opacity-40",
          )}
        >
          <it.icon className="h-3 w-3" />
          {it.label}
        </Badge>
      ))}
    </div>
  );
}
