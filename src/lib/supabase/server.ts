import { createClient } from "@supabase/supabase-js";

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  const key = service || anon;

  // During build time, return a mock client to prevent build errors
  if (!url || !key) {
    return createClient("https://mock.supabase.co", "mock-key", {
      auth: { persistSession: false },
    });
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
