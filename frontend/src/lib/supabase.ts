import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jwchtchijqvnoludfjeb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9yAj7CwEMwkLv1MgPA3UPA_tFuocbjh";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

export type UserRole = "employee" | "admin";

export type UserProfile = {
  id: string;
  full_name: string | null;
  email: string;
  user_role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OfficeZone = {
  id: string;
  zone_code: string;
  description: string | null;
  total_capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OfficeDesk = {
  id: string;
  zone_id: string;
  desk_code: string;
  has_monitor: boolean;
  has_standing_desk: boolean;
  has_locker: boolean;
  has_whiteboard: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OfficeHoliday = {
  id: string;
  holiday_date: string;
  holiday_name: string;
  created_at: string;
};

export type OfficeBooking = {
  id: string;
  user_id: string;
  desk_id: string;
  booking_date: string;
  status: string;
  created_at: string;
  updated_at?: string;
};
