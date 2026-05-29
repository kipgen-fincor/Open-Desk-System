import type { Booking, BookingResource } from "@/types/booking";

function createResources(section: "A" | "B" | "MR", total: number, kind: "desk" | "meeting_room") {
  return Array.from({ length: total }, (_, index) => {
    const seatNumber = index + 1;

    return {
      id: `${section}-${seatNumber}`,
      section,
      label: `${section}-${seatNumber}`,
      kind,
      seat_number: seatNumber,
      is_active: true,
    } satisfies BookingResource;
  });
}

export const mockResources: BookingResource[] = [
  ...createResources("A", 18, "desk"),
  ...createResources("B", 12, "desk"),
  ...createResources("MR", 7, "meeting_room"),
];

export const mockBookings: Booking[] = [
  {
    id: "demo-1",
    resource_id: "A-3",
    user_id: "demo-user",
    user_email: "employee@fincor.example",
    status: "booked",
    starts_at: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    ends_at: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    note: "Desk focus block",
  },
  {
    id: "demo-2",
    resource_id: "MR-2",
    user_id: "demo-user-2",
    user_email: "team@fincor.example",
    status: "reserved",
    starts_at: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    ends_at: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    note: "Client review",
  },
  {
    id: "demo-3",
    resource_id: "B-7",
    user_id: "demo-user-3",
    user_email: "ops@fincor.example",
    status: "completed",
    starts_at: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
    ends_at: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    note: "Completed booking example",
  },
];
