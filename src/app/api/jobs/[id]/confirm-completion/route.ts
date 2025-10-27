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

    // Check if job exists and current user is the employer
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, employer_id, selected_worker_id, status")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.employer_id !== user.id) {
      return NextResponse.json(
        { error: "You can only confirm completion for your own jobs" },
        { status: 403 }
      );
    }

    if (job.status !== "completed") {
      return NextResponse.json(
        { error: "Job is not marked as completed by worker" },
        { status: 400 }
      );
    }

    // Update job status to confirmed (we'll keep it as completed, but add a confirmation flag)
    // For now, we'll just mark it as completed and the confirmation is implicit
    // In the future, we could add a separate confirmation status

    // Update worker's completed jobs count
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("completed_jobs")
      .eq("user_id", job.selected_worker_id)
      .single();

    if (currentProfile) {
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          completed_jobs: (currentProfile.completed_jobs || 0) + 1
        })
        .eq("user_id", job.selected_worker_id);

      if (profileUpdateError) {
        console.error("Error updating worker profile:", profileUpdateError);
        // This is not critical, continue
      }
    }

    return NextResponse.json({
      success: true,
      message: "Job completion confirmed"
    });

  } catch (error) {
    console.error("Error in confirm completion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}