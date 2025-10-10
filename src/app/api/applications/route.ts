import { NextRequest, NextResponse } from "next/server";
import { applications, type Application } from "../../../lib/data/applications";

const MOCK_WORKER_ID = "worker1";

export async function GET() {
  const my = applications.filter(a => a.workerId === MOCK_WORKER_ID);
  return NextResponse.json({ applications: my });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body as { jobId?: string };
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const existing = applications.find(
      (a) => a.workerId === MOCK_WORKER_ID && a.jobId === jobId
    );
    if (existing) {
      return NextResponse.json({ ok: true, application: existing });
    }

    const application: Application = {
      id: "app_" + Math.random().toString(36).slice(2),
      jobId,
      workerId: MOCK_WORKER_ID,
      status: "sendt",
      createdAt: new Date().toISOString(),
    };
    applications.push(application);

    return NextResponse.json({ ok: true, application }, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}