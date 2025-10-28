import { NextRequest, NextResponse } from "next/server";
import { createUser, type Role } from "../../../../lib/data/users";
import { createSession } from "../../../../lib/data/sessions";
import { SESSION_COOKIE, COOKIE_OPTIONS } from "../../../../lib/utils/cookies";
import { sendWelcomeEmail } from "../../../../lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").toString().trim();
    const password = (body?.password ?? "").toString();
    const role = (body?.role ?? "worker").toString() as Role;
    const navn = body?.navn?.toString().trim();
    const kommune = body?.kommune?.toString().trim();
    const fodselsdato = body?.fodselsdato?.toString(); // ISO yyyy-mm-dd

    if (!email || !password) {
      return NextResponse.json({ error: "email and password are required" }, { status: 400 });
    }
    if (role !== "worker" && role !== "employer") {
      return NextResponse.json({ error: "invalid role" }, { status: 400 });
    }

    const user = await createUser({ email, password, role, navn, kommune, fodselsdato });
    const session = await createSession(user.id);

    // Send welcome email asynchronously (don't block registration)
    sendWelcomeEmail(user.email, user.navn || "Bruker", user.role).catch((error) => {
      console.error("Failed to send welcome email:", error);
    });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
    res.cookies.set(SESSION_COOKIE, session.token, COOKIE_OPTIONS);
    return res;
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}