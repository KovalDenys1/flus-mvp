import { NextRequest, NextResponse } from "next/server";
import { supportTickets, type SupportTicket } from "../../../../lib/data/support";

const MOCK_WORKER_ID = "worker1";

export async function GET() {
  const mine = supportTickets.filter(t => t.workerId === MOCK_WORKER_ID);
  return NextResponse.json({ tickets: mine });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reason = (body?.reason ?? "").toString().trim();

    if (!reason || reason.length < 5) {
      return NextResponse.json({ error: "reason is required (min 5 chars)" }, { status: 400 });
    }

    const existing = supportTickets.find(t => t.workerId === MOCK_WORKER_ID && t.status !== "lukket");
    if (existing) {
      return NextResponse.json({ ok: true, ticket: existing, info: "existing open ticket" });
    }

    const ticket: SupportTicket = {
      id: "t_" + Math.random().toString(36).slice(2),
      workerId: MOCK_WORKER_ID,
      reason,
      createdAt: new Date().toISOString(),
      status: "åpen",
    };
    supportTickets.push(ticket);

    return NextResponse.json({ ok: true, ticket }, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}