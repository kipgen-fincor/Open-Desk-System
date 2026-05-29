import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import type { UserRole } from "@/types/booking";

export type CurrentProfile = {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
};

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return {
      id: "demo-user",
      email: "demo@fincor.example",
      role: "admin",
      full_name: "Demo User",
      avatar_url: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  let profile:
    | {
        role?: UserRole;
        full_name?: string | null;
        avatar_url?: string | null;
      }
    | null = null;

  const withAvatar = await supabase
    .from("profiles")
    .select("id,email,role,full_name,avatar_url")
    .eq("id", user.id)
    .single();

  if (withAvatar.error?.message.includes("avatar_url")) {
    const fallback = await supabase
      .from("profiles")
      .select("id,email,role,full_name")
      .eq("id", user.id)
      .single();
    profile = (fallback.data as { role?: UserRole; full_name?: string | null } | null) ?? null;
  } else {
    profile = (withAvatar.data as { role?: UserRole; full_name?: string | null; avatar_url?: string | null } | null) ?? null;
  }

  return {
    id: user.id,
    email: user.email,
    role: profile?.role ?? "user",
    full_name: profile?.full_name ?? null,
    avatar_url: profile?.avatar_url ?? null,
  };
}
