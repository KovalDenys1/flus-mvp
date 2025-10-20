import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { createSession } from "@/lib/data/sessions";
import { COOKIE_OPTIONS, SESSION_COOKIE } from "@/lib/utils/cookies";

// Mock Vipps start: in a real flow, you'd redirect to Vipps OAuth. Here we simulate success.
export async function GET(req: NextRequest) {
  // For demo, accept ?email= and ?role= to pick identity; fallback to a default Vipps user.
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "vipps.user@example.com").toLowerCase();
  const role = (url.searchParams.get("role") || "worker").toString() as "worker" | "employer";

  const supabase = getSupabaseServer();
  // Try to find existing user by email
  const { data: existing, error: selErr } = await supabase
    .from("users")
    .select("id, email, role, navn, kommune")
    .eq("email", email)
    .maybeSingle();

  let userId: string | null = existing?.id ?? null;
  if (!userId) {
    const { data: inserted, error } = await supabase
      .from("users")
      .insert({ email, role })
      .select("id")
      .maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    userId = inserted?.id ?? null;
  }

  if (!userId) {
    return NextResponse.json({ error: "Failed to create or fetch user" }, { status: 500 });
  }

  const session = createSession(userId);
  const res = NextResponse.redirect(new URL("/jobber", req.url));
  res.cookies.set(SESSION_COOKIE, session.token, COOKIE_OPTIONS);
  return res;
}
