
import { NextRequest, NextResponse } from "next/server";
import { getConversationsForUser } from "@/lib/data/conversations";
import { getSession, findSession } from "@/lib/data/sessions";
import { SESSION_COOKIE } from "@/lib/utils/cookies";

/**
 * GET /api/conversations
 * Возвращает список всех чатов для текущего пользователя.
 */
export async function GET(req: NextRequest) {
  // Try to read token directly from incoming request cookies first. This is
  // more reliable for client-initiated requests where server cookie helpers
  // might not have the same context.
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? findSession(token) : null;

  // Fallback to the helper which returns { user, session } and is used
  // by other routes. We only need the user id to fetch conversations.
  let userId: string | null = null;
  if (session) {
    userId = session.userId;
  } else {
    const helper = await getSession();
    userId = helper.user?.id ?? null;
  }

  if (!userId) {
    // If there's no authenticated user, provide demo conversations so the
    // front-end can show sample chats. Use a placeholder demo user id.
    userId = "demo_user";
  }

  try {
    const conversations = getConversationsForUser(userId);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
