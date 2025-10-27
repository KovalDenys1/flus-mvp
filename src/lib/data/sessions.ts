import { cookies } from "next/headers";
import { findUserById } from "./users";
import { SESSION_COOKIE } from "../utils/cookies";
import { getSupabaseServer } from "@/lib/supabase/server";

export type Session = {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
};

// Legacy in-memory sessions (for backward compatibility during transition)
export const sessions: Session[] = [];

export async function createSession(userId: string): Promise<Session> {
  const token = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const now = Date.now();
  const expiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7 days

  try {
    // Try to save session to Supabase
    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from("sessions")
      .insert({
        token,
        user_id: userId,
        expires_at: new Date(expiresAt).toISOString()
      });

    if (!error) {
      // Successfully saved to Supabase
      return { token, userId, createdAt: now, expiresAt };
    }

    console.warn("Failed to save session to Supabase, using in-memory fallback:", error);
  } catch (e) {
    console.warn("Exception saving session to Supabase, using in-memory fallback:", e);
  }

  // Fallback to in-memory session
  const sess: Session = { token, userId, createdAt: now, expiresAt };
  sessions.push(sess);
  return sess;
}

export async function findSession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;

  try {
    // Try to find session in Supabase first
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("sessions")
      .select("token, user_id, created_at, expires_at")
      .eq("token", token)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (data && !error) {
      return {
        token: data.token,
        userId: data.user_id,
        createdAt: new Date(data.created_at).getTime(),
        expiresAt: new Date(data.expires_at).getTime()
      };
    }
  } catch (e) {
    console.warn("Exception finding session in Supabase:", e);
  }

  // Fallback to in-memory sessions
  return sessions.find(s => s.token === token && s.expiresAt > Date.now()) || null;
}

export async function deleteSession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  try {
    // Try to delete from Supabase first
    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("token", token);

    if (!error) {
      return true;
    }
  } catch (e) {
    console.warn("Exception deleting session from Supabase:", e);
  }

  // Fallback to in-memory deletion
  const i = sessions.findIndex(s => s.token === token);
  if (i >= 0) {
    sessions.splice(i, 1);
    return true;
  }
  return false;
}

/**
 * Retrieves the current session and user info from cookies.
 * Convenience helper for API routes.
 */
export async function getSession(): Promise<{ user: { id: string; email?: string; role?: string; navn?: string; kommune?: string } | null; session: Session | null }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await findSession(token);

  if (!session) {
    return { user: null, session: null };
  }

  // Try Supabase first to resolve user info
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role, navn, kommune")
      .eq("id", session.userId)
      .maybeSingle();

    if (data) {
      return {
        user: data as { id: string; email?: string; role?: string; navn?: string; kommune?: string },
        session
      };
    }

    if (error) {
      console.error("Error loading user from Supabase:", error);
    }
  } catch (e) {
    console.error("Exception loading user from Supabase:", e);
  }

  // Fallback to in-memory users (legacy)
  const user = findUserById(session.userId);
  if (user) {
    const { passwordHash, ...rest } = user;
    void passwordHash;
    return { user: rest, session };
  }

  return { user: null, session };
}