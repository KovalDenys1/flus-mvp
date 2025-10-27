import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = getSupabaseServer();
    const { user } = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobId = id;

    // Check if job exists and current user is the assigned worker
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, employer_id, selected_worker_id, status")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.selected_worker_id !== user.id) {
      return NextResponse.json(
        { error: "You can only complete jobs assigned to you" },
        { status: 403 }
      );
    }

    if (job.status !== "assigned") {
      return NextResponse.json(
        { error: "Job is not in assigned status" },
        { status: 400 }
      );
    }

    // Update job status to completed
    const { error: jobUpdateError } = await supabase
      .from("jobs")
      .update({ status: "completed" })
      .eq("id", jobId);

    if (jobUpdateError) {
      console.error("Error updating job:", jobUpdateError);
      return NextResponse.json(
        { error: "Failed to update job status" },
        { status: 500 }
      );
    }

    // Update application status to completed
    const { error: appUpdateError } = await supabase
      .from("applications")
      .update({
        status: "completed",
        updated_at: new Date().toISOString()
      })
      .eq("job_id", jobId)
      .eq("applicant_id", user.id);

    if (appUpdateError) {
      console.error("Error updating application:", appUpdateError);
      return NextResponse.json(
        { error: "Failed to update application status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Job marked as completed"
    });

  } catch (error) {
    console.error("Error in complete job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}