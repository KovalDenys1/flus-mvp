import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id,title,description,category,pay_nok,duration_minutes,area_name,lat,lng,created_at,status"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase jobs error:", error);
    // Return empty list in demo to avoid breaking the page; see SUPABASE_SETUP.md to create table/policies
    return NextResponse.json({ jobs: [] });
  }

  const jobs = (data || []).map((j: any) => ({
    id: j.id,
    title: j.title,
    desc: j.description,
    category: j.category,
    payNok: j.pay_nok,
    durationMinutes: j.duration_minutes,
    areaName: j.area_name,
    lat: j.lat,
    lng: j.lng,
    createdAt: j.created_at,
    status: j.status,
  }));
  return NextResponse.json({ jobs });
}