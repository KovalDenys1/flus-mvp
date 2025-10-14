
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/data/sessions";
import { getMessagesForConversation, createMessage, markMessagesAsRead } from "@/lib/data/messages";
import { getConversationById } from "@/lib/data/conversations";

// Helper to extract the conversation id from the request URL.
function extractConversationId(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const match = url.pathname.match(/\/api\/conversations\/([^\/]+)\/messages/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * GET /api/conversations/[id]/messages
 * Returns all messages for a conversation. We read the conversation id from the request URL
 * instead of relying on the typed `context.params` to avoid Next.js validator type issues.
 */
export async function GET(req: NextRequest) {
  const session = await getSession();

  const conversationId = extractConversationId(req);
  if (!conversationId) {
    return NextResponse.json({ error: "Invalid conversation id" }, { status: 400 });
  }

  const conversation = getConversationById(conversationId);

  // Allow demo conversations to be read without an authenticated session.
  const isDemo = conversationId.startsWith("demo_conv_");
  if (!isDemo) {
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Ensure the current user is a participant in this conversation
    if (!conversation || (conversation.initiatorId !== session.user.id && conversation.participantId !== session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const messages = getMessagesForConversation(conversationId);
    // Mark messages as read for the current user (skip for unauthenticated demo)
    if (!isDemo && session?.user) markMessagesAsRead(conversationId, session.user.id);
    return NextResponse.json({ messages });
  } catch {
    console.error(`Failed to fetch messages for conversation ${conversationId}:`);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/conversations/[id]/messages
 * Sends a new message into the conversation.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  const conversationId = extractConversationId(req);
  if (!conversationId) {
    return NextResponse.json({ error: "Invalid conversation id" }, { status: 400 });
  }

  const conversation = getConversationById(conversationId);

  const isDemo = conversationId.startsWith("demo_conv_");
  // For non-demo convs, require authenticated user and participant check
  if (!isDemo) {
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!conversation || (conversation.initiatorId !== session.user.id && conversation.participantId !== session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    // For demo convs, attribute messages to a demo user id if not authenticated
    const authUserId = session?.user?.id ?? null;
    let senderId: string;
    if (isDemo) {
      senderId = authUserId ?? "demo_user";
    } else {
      senderId = authUserId!; // non-demo branch guarantees authUserId is present
    }
    const message = createMessage(conversationId, senderId, text.trim());

    // Future: broadcast real-time notification via WebSocket / PubSub here

    return NextResponse.json({ message }, { status: 201 });
  } catch {
    console.error(`Failed to send message for conversation ${conversationId}:`);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
