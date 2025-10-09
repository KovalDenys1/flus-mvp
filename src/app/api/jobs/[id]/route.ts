import { NextResponse } from "next/server";

async function getJobById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/jobs`, { cache: "no-store" });
  const data = await res.json();
  return (data.jobs ?? []).find((j: any) => j.id === id) ?? null;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = await getJobById(params.id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ job });
}