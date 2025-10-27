
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/data/sessions";
import { getMessagesForConversation, createMessage, createPhotoMessage, isUserInConversation } from "@/lib/chat-db";

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
 * Returns all messages for a conversation.
 */
export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversationId = extractConversationId(req);
  if (!conversationId) {
    return NextResponse.json({ error: "Invalid conversation id" }, { status: 400 });
  }

  try {
    // Check if user is participant in this conversation
    const isParticipant = await isUserInConversation(conversationId, session.user.id);
    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await getMessagesForConversation(conversationId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error(`Failed to fetch messages for conversation ${conversationId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/conversations/[id]/messages
 * Sends a new message into the conversation.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversationId = extractConversationId(req);
  if (!conversationId) {
    return NextResponse.json({ error: "Invalid conversation id" }, { status: 400 });
  }

  try {
    // Check if user is participant in this conversation
    const isParticipant = await isUserInConversation(conversationId, session.user.id);
    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { text, photoUrl, caption } = await req.json();

    if (photoUrl) {
      // Photo message
      if (!photoUrl || typeof photoUrl !== "string") {
        return NextResponse.json({ error: "Photo URL is required" }, { status: 400 });
      }
      const message = await createPhotoMessage(conversationId, session.user.id, photoUrl, caption);
      return NextResponse.json({ message }, { status: 201 });
    } else {
      // Text message
      if (!text || typeof text !== "string" || text.trim() === "") {
        return NextResponse.json({ error: "Message text is required" }, { status: 400 });
      }
      const message = await createMessage(conversationId, session.user.id, text.trim());
      return NextResponse.json({ message }, { status: 201 });
    }
  } catch (error) {
    console.error(`Failed to send message for conversation ${conversationId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
