import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const updates: Record<string, unknown> = {};
  if ("full_name" in body) {
    updates.full_name = body.full_name ?? null;
  }
  if ("avatar_url" in body) {
    updates.avatar_url = body.avatar_url ?? null;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const profiles = supabase.from("profiles") as unknown as {
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
    };
  };

  const baseUpdate = await profiles.update(updates).eq("id", user.id);
  let error = baseUpdate.error;

  // Allow independent profile updates even before avatar_url migration is applied.
  if (error?.message.includes("avatar_url") && "avatar_url" in updates) {
    delete updates.avatar_url;
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true, warning: "Avatar field unavailable until migration is applied." });
    }
    const retry = await profiles.update(updates).eq("id", user.id);
    error = retry.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
