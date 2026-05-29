import { createBrowserClient } from "@supabase/ssr";
import { assertPublicEnv, env } from "@/lib/env";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  assertPublicEnv();

  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
