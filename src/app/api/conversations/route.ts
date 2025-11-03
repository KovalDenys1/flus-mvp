
import { NextRequest, NextResponse } from "next/server";
import { getConversationsForUser, findOrCreateConversation } from "@/lib/chat-db";
import { getSession } from "@/lib/data/sessions";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/conversations
 * Returns a list of all conversations for the current user with detailed information.
 */
export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseServer();
    const userId = session.user!.id; // We already checked user exists above
    const conversations = await getConversationsForUser(userId);
    
    // Enrich conversations with job, participant, and last message info
    const enrichedConversations = await Promise.all(
      conversations.map(async (convo) => {
        // Get job information
        const { data: job } = await supabase
          .from("jobs")
          .select("id, title, description, category, pay_nok, duration_minutes, area_name, status")
          .eq("id", convo.job_id)
          .single();

        // Determine who is the other participant
        const otherUserId = convo.worker_id === userId 
          ? convo.employer_id 
          : convo.worker_id;
        
        const isCurrentUserWorker = convo.worker_id === userId;

        // Get other participant information
        const { data: otherUser } = await supabase
          .from("users")
          .select("id, navn, email, photo_url")
          .eq("id", otherUserId)
          .single();

        // Get last message
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("id, text_content, message_type, created_at, sender_id")
          .eq("conversation_id", convo.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        return {
          ...convo,
          job: job || null,
          otherUser: otherUser ? {
            id: otherUser.id,
            navn: otherUser.navn,
            email: otherUser.email,
            photo_url: otherUser.photo_url,
            role: isCurrentUserWorker ? "employer" : "worker"
          } : null,
          lastMessage: lastMessage || null,
          isCurrentUserWorker
        };
      })
    );

    // Sort by last message time (most recent first)
    enrichedConversations.sort((a, b) => {
      const aTime = a.lastMessage?.created_at || a.created_at;
      const bTime = b.lastMessage?.created_at || b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return NextResponse.json({ conversations: enrichedConversations });
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/conversations
 * Creates or finds a conversation for a job application.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobId } = await req.json();

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Get job information to find employer_id
    const jobRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}&select=employer_id`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      }
    });

    if (!jobRes.ok) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const jobs = await jobRes.json();
    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const employerId = jobs[0].employer_id;

    // Define roles: current user is worker, employer is job owner
    const workerId = session.user.id;

    // Create or find conversation
    const conversation = await findOrCreateConversation(jobId, workerId, employerId);

    // Create job application
    const appRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_id: jobId,
        applicant_id: workerId,
        status: 'pending'
      })
    });

    if (!appRes.ok) {
      console.error('Failed to create application:', await appRes.text());
      // Don't interrupt the process if application creation fails
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
