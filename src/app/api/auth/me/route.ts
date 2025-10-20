export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { findSession } from "../../../../lib/data/sessions";
import { users } from "../../../../lib/data/users";
import { SESSION_COOKIE } from "../../../../lib/utils/cookies";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const sess = findSession(token);
  if (!sess) return NextResponse.json({ user: null });

  // Try Supabase first
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, navn, kommune")
      .eq("id", sess.userId)
      .maybeSingle();
    if (!error && data) {
      return NextResponse.json({ user: data });
    }
  } catch {}

  // Fallback to in-memory users if Supabase read failed
  const user = users.find(u => u.id === sess.userId);
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role, navn: user.navn, kommune: user.kommune } });
}