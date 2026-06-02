// IST date helpers — booking rules are evaluated in Asia/Kolkata (UTC+5:30).

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Returns the current Date as it would read on a wall clock in IST. */
export function nowInIST(): Date {
  const now = new Date();
  return new Date(now.getTime() + IST_OFFSET_MS + now.getTimezoneOffset() * 60 * 1000);
}

/** ISO date (YYYY-MM-DD) for today in IST. */
export function todayISODateIST(): string {
  return toISODate(nowInIST());
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** 0=Sun … 6=Sat */
export function isWeekend(iso: string): boolean {
  const d = parseISODate(iso);
  const day = d.getDay();
  return day === 0 || day === 6;
}

/** Inclusive day-difference from today (IST). 0 = today, 7 = a week away. */
export function daysFromTodayIST(iso: string): number {
  const today = parseISODate(todayISODateIST());
  const target = parseISODate(iso);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

/** Booking can be made up to 7 days in advance (0..7 inclusive of today). */
export function isWithinBookingWindow(iso: string): boolean {
  const diff = daysFromTodayIST(iso);
  return diff >= 0 && diff <= 7;
}

/** Cancellation only allowed before 6 PM IST on the booking day. */
export function canCancel(bookingDateISO: string): boolean {
  const ist = nowInIST();
  const todayIso = toISODate(ist);
  if (bookingDateISO < todayIso) return false;
  if (bookingDateISO > todayIso) return true;
  // same day → must be before 18:00 IST
  return ist.getHours() < 18;
}

export function formatDateLong(iso: string): string {
  const d = parseISODate(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
