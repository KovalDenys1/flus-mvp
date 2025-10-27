import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";

export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id,title,description,category,pay_nok,duration_minutes,area_name,lat,lng,created_at,status,employer_id,selected_worker_id,address,schedule_type,start_time,end_time,payment_type,requirements"
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase jobs error:", error);
    // Return empty list in demo to avoid breaking the page; see SUPABASE_SETUP.md to create table/policies
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
    employerId: j.employer_id,
    selectedWorkerId: j.selected_worker_id,
    address: j.address,
    scheduleType: j.schedule_type,
    startTime: j.start_time,
    endTime: j.end_time,
    paymentType: j.payment_type,
    requirements: j.requirements,
  }));
  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer();
    const body = await request.json();

    const {
      title,
      description,
      category,
      payNok,
      durationMinutes,
      areaName,
      address,
      scheduleType,
      startTime,
      endTime,
      paymentType,
      requirements,
    } = body;

    // Basic validation
    if (!title || !description || !category || !payNok || !durationMinutes || !areaName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current user from our session system
    const { user } = await getSession();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Any authenticated user can create jobs

    // Default coordinates (Oslo center) - in production, geocode the address
    const lat = 59.9139;
    const lng = 10.7522;

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        title,
        description,
        category,
        pay_nok: payNok,
        duration_minutes: durationMinutes,
        area_name: areaName,
        lat,
        lng,
        status: "open",
        employer_id: user.id,
        address,
        schedule_type: scheduleType || "flexible",
        start_time: startTime || null,
        end_time: endTime || null,
        payment_type: paymentType || "fixed",
        requirements,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error);
      if (error.message?.toLowerCase().includes("relation") || (error as {code?: string}).code === "42P01") {
        return NextResponse.json(
          { error: "Database not configured. Please run the Supabase migrations first. See SUPABASE_SETUP.md" },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ job: data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}