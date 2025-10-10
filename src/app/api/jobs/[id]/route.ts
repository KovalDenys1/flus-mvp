import { NextResponse } from "next/server";

async function getJobById(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/jobs`, { cache: "no-store" });
  const data = await res.json();
  return (data.jobs ?? []).find((j: any) => j.id === id) ?? null;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const job = await getJobById(params.id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ job });
}