import { NextRequest, NextResponse } from "next/server";
import { verifyLogin } from "../../../../lib/data/users";
import { createSession } from "../../../../lib/data/sessions";
import { SESSION_COOKIE, COOKIE_OPTIONS } from "../../../../lib/utils/cookies";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = (body?.email ?? "").toString().trim();
  const password = (body?.password ?? "").toString();

  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  const user = await verifyLogin(email, password);
  if (!user) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const session = await createSession(user.id);
  const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  res.cookies.set(SESSION_COOKIE, session.token, COOKIE_OPTIONS);
  return res;
}