import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

type Job = {
  id: string;
  title: string;
  desc: string;
  category: string;
  payNok: number;
  durationMinutes: number;
  areaName: string;
  lat: number;
  lng: number;
  createdAt: string;
  status: "open" | "closed";
  address?: string;
  scheduleType?: "flexible" | "fixed" | "deadline";
  startTime?: string;
  endTime?: string;
  paymentType?: "fixed" | "hourly";
  requirements?: string;
};

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("jobs")
    .select("id,title,description,category,pay_nok,duration_minutes,area_name,lat,lng,created_at,status,address,schedule_type,start_time,end_time,payment_type,requirements")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.message?.toLowerCase().includes("relation") || (error as {code?: string}).code === "42P01") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const job: Job = {
    id: data.id,
    title: data.title,
    desc: data.description,
    category: data.category,
    payNok: data.pay_nok,
    durationMinutes: data.duration_minutes,
    areaName: data.area_name,
    lat: data.lat,
    lng: data.lng,
    createdAt: data.created_at,
    status: data.status,
    address: data.address,
    scheduleType: data.schedule_type,
    startTime: data.start_time,
    endTime: data.end_time,
    paymentType: data.payment_type,
    requirements: data.requirements,
  };
  return NextResponse.json({ job });
}