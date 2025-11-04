
import { NextResponse } from "next/server";
import { getConversationsForUser } from "@/lib/chat-db";
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
        const { data: otherUser, error: userError } = await supabase
          .from("users")
          .select("id, navn, email, photo_url")
          .eq("id", otherUserId)
          .single();

        if (userError) {
          console.error(`Error fetching user ${otherUserId}:`, userError);
        }

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
            navn: otherUser.navn || null,
            email: otherUser.email,
            photo_url: otherUser.photo_url || null,
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
