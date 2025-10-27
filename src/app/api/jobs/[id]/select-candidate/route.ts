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
    const body = await request.json();
    const { workerId } = body;

    if (!workerId) {
      return NextResponse.json(
        { error: "workerId is required" },
        { status: 400 }
      );
    }

    // Check if job exists and belongs to current user
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, employer_id, status")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.employer_id !== user.id) {
      return NextResponse.json(
        { error: "You can only select candidates for your own jobs" },
        { status: 403 }
      );
    }

    if (job.status !== "open") {
      return NextResponse.json(
        { error: "Job is not open for applications" },
        { status: 400 }
      );
    }

    // Check if application exists
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, status")
      .eq("job_id", jobId)
      .eq("applicant_id", workerId)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "sendt") {
      return NextResponse.json(
        { error: "Application is not pending" },
        { status: 400 }
      );
    }

    // Start transaction: update job and application status
    const { error: jobUpdateError } = await supabase
      .from("jobs")
      .update({
        status: "assigned",
        selected_worker_id: workerId
      })
      .eq("id", jobId);

    if (jobUpdateError) {
      console.error("Error updating job:", jobUpdateError);
      return NextResponse.json(
        { error: "Failed to update job status" },
        { status: 500 }
      );
    }

    const { error: appUpdateError } = await supabase
      .from("applications")
      .update({
        status: "akseptert",
        updated_at: new Date().toISOString()
      })
      .eq("id", application.id);

    if (appUpdateError) {
      console.error("Error updating application:", appUpdateError);
      // Rollback job status
      await supabase
        .from("jobs")
        .update({ status: "open", selected_worker_id: null })
        .eq("id", jobId);

      return NextResponse.json(
        { error: "Failed to update application status" },
        { status: 500 }
      );
    }

    // Reject all other applications for this job
    const { error: rejectError } = await supabase
      .from("applications")
      .update({
        status: "avslatt",
        updated_at: new Date().toISOString()
      })
      .eq("job_id", jobId)
      .neq("applicant_id", workerId)
      .eq("status", "sendt");

    if (rejectError) {
      console.error("Error rejecting other applications:", rejectError);
      // This is not critical, so we don't rollback
    }

    return NextResponse.json({
      success: true,
      message: "Candidate selected successfully"
    });

  } catch (error) {
    console.error("Error in select candidate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}