import { NextRequest, NextResponse } from "next/server";
import { findSession } from "../../../../lib/data/sessions";
import { SESSION_COOKIE } from "../../../../lib/utils/cookies";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const sess = await findSession(token);
  if (!sess) return NextResponse.json({ user: null });

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, navn, kommune")
      .eq("id", sess.userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: data });
  } catch (e) {
    console.error("Exception fetching user:", e);
    return NextResponse.json({ user: null });
  }
}