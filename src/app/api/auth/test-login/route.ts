import { NextRequest, NextResponse } from "next/server";
import { createSession } from "../../../../lib/data/sessions";
import { SESSION_COOKIE, COOKIE_OPTIONS } from "../../../../lib/utils/cookies";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Create session for test user
  const session = await createSession(userId);
  const res = NextResponse.json({
    ok: true,
    message: `Logged in as ${userId}`,
    user: { id: userId }
  });
  res.cookies.set(SESSION_COOKIE, session.token, COOKIE_OPTIONS);
  return res;
}