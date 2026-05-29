import type { Booking, BookingResource, BookingStatus } from "@/types/booking";

const activeStatuses: BookingStatus[] = ["reserved", "booked"];

export type SeatDisplayStatus = "available" | "booked";

export function isSameLocalDay(value: string, now = new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return date.toDateString() === now.toDateString();
}

export function isSlotBookable(startsAt: string, endsAt: string, now = new Date()) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, reason: "Choose a valid date and time slot." };
  }

  if (start >= end) {
    return { ok: false, reason: "End time must be after start time." };
  }

  if (start <= now) {
    return { ok: false, reason: "Bookings must start in the future." };
  }

  return { ok: true as const, reason: null };
}

export function overlaps(startsAt: string, endsAt: string, nextStartsAt: string, nextEndsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const nextStart = new Date(nextStartsAt);
  const nextEnd = new Date(nextEndsAt);

  if ([start, end, nextStart, nextEnd].some((date) => Number.isNaN(date.getTime()))) {
    return false;
  }

  return start < nextEnd && nextStart < end;
}

export function sameLocalDay(left: string, right: string) {
  const leftDate = new Date(left);
  const rightDate = new Date(right);

  if (Number.isNaN(leftDate.getTime()) || Number.isNaN(rightDate.getTime())) {
    return false;
  }

  return leftDate.toDateString() === rightDate.toDateString();
}

export function isBookingActive(booking: Booking, now = new Date()) {
  if (!activeStatuses.includes(booking.status)) {
    return false;
  }

  return new Date(booking.starts_at) <= now && now < new Date(booking.ends_at);
}

export function isBookingActionable(booking: Booking, now = new Date()) {
  if (!activeStatuses.includes(booking.status)) {
    return false;
  }

  return new Date(booking.ends_at) > now;
}

function overlappingBookings(
  resource: BookingResource,
  bookings: Booking[],
  startsAt: string,
  endsAt: string,
) {
  return bookings.filter(
    (booking) =>
      booking.resource_id === resource.id &&
      activeStatuses.includes(booking.status) &&
      overlaps(booking.starts_at, booking.ends_at, startsAt, endsAt),
  );
}

export function getSeatDisplayStatus(
  resource: BookingResource,
  bookings: Booking[],
  startsAt: string,
  endsAt: string,
  now = new Date(),
): SeatDisplayStatus {
  const overlapping = overlappingBookings(resource, bookings, startsAt, endsAt);
  const hasActive = overlapping.some((booking) => isBookingActive(booking, now));
  return hasActive ? "booked" : "available";
}

export function hasSlotConflict(
  resource: BookingResource,
  bookings: Booking[],
  startsAt: string,
  endsAt: string,
) {
  return overlappingBookings(resource, bookings, startsAt, endsAt).length > 0;
}

export function canUserBookDesk(
  userId: string,
  bookings: Booking[],
  startsAt: string,
  resources: BookingResource[],
  isAdmin: boolean,
) {
  if (isAdmin) {
    return true;
  }

  const deskResourceIds = new Set(resources.filter((resource) => resource.kind === "desk").map((resource) => resource.id));

  return !bookings.some(
    (booking) =>
      booking.user_id === userId &&
      activeStatuses.includes(booking.status) &&
      deskResourceIds.has(booking.resource_id) &&
      sameLocalDay(booking.starts_at, startsAt),
  );
}

export function canUserBookMeetingRoom(
  userId: string,
  bookings: Booking[],
  startsAt: string,
  endsAt: string,
  resources: BookingResource[],
) {
  const meetingRoomIds = new Set(
    resources.filter((resource) => resource.kind === "meeting_room").map((resource) => resource.id),
  );

  return !bookings.some(
    (booking) =>
      booking.user_id === userId &&
      activeStatuses.includes(booking.status) &&
      meetingRoomIds.has(booking.resource_id) &&
      overlaps(booking.starts_at, booking.ends_at, startsAt, endsAt),
  );
}

export function getGreeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

export function displayName(fullName: string | null | undefined, email: string) {
  if (fullName?.trim()) {
    return fullName.trim();
  }

  return email.split("@")[0] ?? email;
}
