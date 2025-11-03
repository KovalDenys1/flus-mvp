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

    const body = await request.json();
    const { beforePhotoUrl, afterPhotoUrl, conversationId } = body;

    if (!beforePhotoUrl || !afterPhotoUrl) {
      return NextResponse.json({ error: "Both before and after photos are required" }, { status: 400 });
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

    // Get application
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("applicant_id", user.id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Send system message to conversation with before photo
    const { data: beforeMessage } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message_type: 'photo',
        text_content: 'Før arbeid',
        photo_url: beforePhotoUrl
      })
      .select()
      .single();

    // Send system message to conversation with after photo
    const { data: afterMessage } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message_type: 'photo',
        text_content: 'Etter arbeid',
        photo_url: afterPhotoUrl
      })
      .select()
      .single();

    // Save photos to job_photos table
    if (beforeMessage) {
      await supabase
        .from("job_photos")
        .insert({
          application_id: application.id,
          message_id: beforeMessage.id,
          uploaded_by: user.id,
          photo_type: 'before',
          storage_path: beforePhotoUrl,
          storage_url: beforePhotoUrl
        });
    }

    if (afterMessage) {
      await supabase
        .from("job_photos")
        .insert({
          application_id: application.id,
          message_id: afterMessage.id,
          uploaded_by: user.id,
          photo_type: 'after',
          storage_path: afterPhotoUrl,
          storage_url: afterPhotoUrl
        });
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
        work_completed_at: new Date().toISOString(),
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

    // Send system message about work completion
    await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message_type: 'system',
        system_event: 'work_completed'
      });

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