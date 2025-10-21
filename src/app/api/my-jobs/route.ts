import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    
    // Get current user from our session system
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Get jobs created by this employer
    const { data, error } = await supabase
      .from("jobs")
      .select(
        "id,title,description,category,pay_nok,duration_minutes,area_name,lat,lng,created_at,status,address,schedule_type,start_time,end_time,payment_type,requirements,employer_id"
      )
      .eq("employer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase jobs error:", error);
      return NextResponse.json({ jobs: [] });
    }

    const jobs = (data || []).map((j: Record<string, unknown>) => ({
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
      address: j.address,
      scheduleType: j.schedule_type,
      startTime: j.start_time,
      endTime: j.end_time,
      paymentType: j.payment_type,
      requirements: j.requirements,
      employerId: j.employer_id,
    }));
    
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error in GET /api/my-jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
