import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "../../../../lib/data/sessions";
import { SESSION_COOKIE, COOKIE_OPTIONS } from "../../../../lib/utils/cookies";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  deleteSession(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return res;
}