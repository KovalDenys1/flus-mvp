import { cookies } from "next/headers";
import { SESSION_COOKIE } from "../utils/cookies";
import { getSupabaseServer } from "@/lib/supabase/server";

export type Session = {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
};

export async function createSession(userId: string): Promise<Session> {
  const token = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const now = Date.now();
  const expiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7 days

  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("sessions")
    .insert({
      token,
      user_id: userId,
      expires_at: new Date(expiresAt).toISOString()
    });

  if (error) {
    console.error("Failed to create session:", error);
    throw new Error("Failed to create session");
  }

  return { token, userId, createdAt: now, expiresAt };
}

export async function findSession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("sessions")
    .select("token, user_id, created_at, expires_at")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("Error finding session:", error);
    return null;
  }

  if (!data) return null;

  return {
    token: data.token,
    userId: data.user_id,
    createdAt: new Date(data.created_at).getTime(),
    expiresAt: new Date(data.expires_at).getTime()
  };
}

export async function deleteSession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("token", token);

  if (error) {
    console.error("Error deleting session:", error);
    return false;
  }

  return true;
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

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, navn, kommune")
    .eq("id", session.userId)
    .maybeSingle();

  if (error) {
    console.error("Error loading user from Supabase:", error);
    return { user: null, session };
  }

  return {
    user: data as { id: string; email?: string; role?: string; navn?: string; kommune?: string },
    session
  };
}