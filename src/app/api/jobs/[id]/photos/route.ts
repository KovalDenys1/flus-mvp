import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";

export async function GET(
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

    // Check if job exists and user has access (employer or assigned worker)
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, employer_id, selected_worker_id, status")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Only employer or assigned worker can view photos
    if (job.employer_id !== user.id && job.selected_worker_id !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get conversation for this job
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("id")
      .eq("job_id", jobId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ photos: [] });
    }

    // Get all photo messages from the conversation
    const { data: photoMessages, error: messagesError } = await supabase
      .from("messages")
      .select(`
        id,
        photo_url,
        text_content,
        created_at,
        sender_id,
        message_type
      `)
      .eq("conversation_id", conversation.id)
      .eq("message_type", "photo")
      .not("photo_url", "is", null)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching photo messages:", messagesError);
      return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
    }

    // Get completion photos from job_photos table
    const { data: completionPhotos, error: photosError } = await supabase
      .from("job_photos")
      .select(`
        id,
        photo_type,
        storage_url,
        created_at,
        message_id
      `)
      .eq("application_id", (
        await supabase
          .from("applications")
          .select("id")
          .eq("job_id", jobId)
          .eq("applicant_id", job.selected_worker_id)
          .single()
      ).data?.id)
      .order("created_at", { ascending: true });

    if (photosError) {
      console.error("Error fetching completion photos:", photosError);
    }

    // Combine and format photos
    const photos: Array<{
      id: string;
      url: string;
      caption: string;
      type: string;
      uploadedAt: string;
      uploadedBy: string;
    }> = [];

    // Add chat photos
    if (photoMessages) {
      photoMessages.forEach(msg => {
        photos.push({
          id: msg.id,
          url: msg.photo_url,
          caption: msg.text_content || "Bilde fra chat",
          type: "chat",
          uploadedAt: msg.created_at,
          uploadedBy: msg.sender_id === job.employer_id ? "employer" : "worker"
        });
      });
    }

    // Add completion photos
    if (completionPhotos) {
      completionPhotos.forEach(photo => {
        photos.push({
          id: photo.id,
          url: photo.storage_url,
          caption: photo.photo_type === "before" ? "Før arbeid" : "Etter arbeid",
          type: photo.photo_type,
          uploadedAt: photo.created_at,
          uploadedBy: "worker"
        });
      });
    }

    // Sort by upload time
    photos.sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime());

    return NextResponse.json({ photos });

  } catch (error) {
    console.error("Error in job photos API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}