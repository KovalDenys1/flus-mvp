import { cookies } from "next/headers";
import { findUserById, User } from "./users";
import { SESSION_COOKIE } from "../utils/cookies";
import { getSupabaseServer } from "@/lib/supabase/server";

export type Session = {
  token: string;
  userId: string;
  createdAt: number;
};

export const sessions: Session[] = [];

export function createSession(userId: string) {
  const token = "s_" + Math.random().toString(36).slice(2);
  const sess: Session = { token, userId, createdAt: Date.now() };
  sessions.push(sess);
  return sess;
}

export function findSession(token: string | undefined | null) {
  if (!token) return null;
  return sessions.find(s => s.token === token) || null;
}

export function deleteSession(token: string | undefined | null) {
  if (!token) return false;
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
  const session = findSession(token);
  if (!session) {
    return { user: null, session: null };
  }
  // Try Supabase first to resolve user info
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase
      .from("users")
      .select("id, email, role, navn, kommune")
      .eq("id", session.userId)
      .maybeSingle();
    if (data) {
      return { user: data as any, session };
    }
  } catch {}

  // Fallback to in-memory users (legacy)
  const user = findUserById(session.userId);
  if (user) {
    const { passwordHash, ...rest } = user;
    void passwordHash;
    return { user: rest, session };
  }
  return { user: null, session };
}