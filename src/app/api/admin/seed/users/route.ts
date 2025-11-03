import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = getSupabaseServer();

    // Check if test users already exist
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .in("id", ["test_employer_1", "test_worker_1"]);

    if (existing && existing.length >= 2) {
      return NextResponse.json({ inserted: 0, note: "test users already exist" });
    }

    // Create test users
    const users = [
      {
        id: "test_employer_1",
        email: "employer@test.com",
        navn: "Test Arbeidsgiver",
        role: "employer",
        birth_year: 1980,
      },
      {
        id: "test_worker_1",
        email: "worker@test.com",
        navn: "Test Jobbsøker",
        role: "worker",
        birth_year: 1990,
      },
    ];

    const { data, error } = await supabase
      .from("users")
      .upsert(users, { onConflict: "id" })
      .select("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inserted: data?.length ?? 0 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}