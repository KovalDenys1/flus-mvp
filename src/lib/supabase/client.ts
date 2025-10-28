import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  // During build time, return a mock client to prevent build errors
  if (!supabaseUrl || !supabaseAnonKey) {
    return createBrowserClient("https://mock.supabase.co", "mock-key");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
