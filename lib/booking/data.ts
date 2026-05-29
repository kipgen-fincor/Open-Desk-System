import { mockBookings, mockResources } from "@/lib/booking/mock-data";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Booking, BookingResource } from "@/types/booking";

export async function getBookingData(options?: { userId?: string; all?: boolean }) {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    const bookings = options?.all
      ? mockBookings
      : mockBookings.filter((booking) => !options?.userId || booking.user_id === options.userId);

    return { resources: mockResources, bookings };
  }

  const supabase = await createSupabaseServerClient();
  let bookingsQuery = supabase
    .from("bookings")
    .select("id,resource_id,user_id,user_email,status,starts_at,ends_at,note")
    .order("starts_at", { ascending: true });

  if (!options?.all && options?.userId) {
    bookingsQuery = bookingsQuery.eq("user_id", options.userId);
  }

  const [{ data: resources }, { data: bookings }] = await Promise.all([
    supabase.from("resources").select("*").eq("is_active", true).order("section").order("seat_number"),
    bookingsQuery,
  ]);

  return {
    resources: (resources ?? []) as BookingResource[],
    bookings: (bookings ?? []) as Booking[],
  };
}

export function getCurrentAndFutureBookings(bookings: Booking[]) {
  const now = new Date();

  return {
    current: bookings.filter(
      (booking) =>
        ["reserved", "booked"].includes(booking.status) &&
        new Date(booking.starts_at) <= now &&
        now < new Date(booking.ends_at),
    ),
    future: bookings.filter(
      (booking) => ["reserved", "booked"].includes(booking.status) && new Date(booking.starts_at) > now,
    ),
    completed: bookings.filter((booking) => booking.status === "completed"),
    cancelled: bookings.filter((booking) => booking.status === "cancelled"),
  };
}
