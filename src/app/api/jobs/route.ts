import { NextResponse } from "next/server";
import { jobs } from "@/lib/data/jobs";

export async function GET() {
  return NextResponse.json({ jobs });
}