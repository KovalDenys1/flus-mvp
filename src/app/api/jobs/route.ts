import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";
import { containsInappropriateContent } from "@/lib/content-moderation";

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
      lat,
      lng,
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

    // Content moderation - check for inappropriate content
    const contentToCheck = `${title} ${description} ${requirements || ""}`;
    if (containsInappropriateContent(contentToCheck)) {
      return NextResponse.json(
        { error: "Job description contains inappropriate content. Please review and remove any offensive language." },
        { status: 400 }
      );
    }

    const { user } = await getSession();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const defaultLat = 59.9139;
    const defaultLng = 10.7522;

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        title,
        description,
        category,
        pay_nok: payNok,
        duration_minutes: durationMinutes,
        area_name: areaName,
        lat: lat || defaultLat,
        lng: lng || defaultLng,
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