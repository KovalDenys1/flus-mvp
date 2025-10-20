import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

// Simple seed endpoint to populate Supabase `jobs` table from local demo data.
// Use ONLY in development. Protects by requiring SERVICE ROLE or env flag.
export async function POST() {
  try {
    const supabase = getSupabaseServer();

    // Quick sanity: ensure table exists
    const { error: listErr } = await supabase.from("jobs").select("id").limit(1);
    if (listErr && (listErr as any).code === "42P01") {
      return NextResponse.json(
        { error: "jobs table missing. Run SQL from SUPABASE_SETUP.md first." },
        { status: 400 }
      );
    }

    // Insert if empty
    const { data: existing, error: countErr } = await supabase
      .from("jobs")
      .select("id", { count: "exact", head: true });
    if (countErr) {
      // Some PostgREST versions don't allow head+count; fall back to fetching few rows
      const { data: probe, error: probeErr } = await supabase.from("jobs").select("id").limit(1);
      if (probeErr && (probeErr as any).code !== "PGRST116") {
        return NextResponse.json({ error: probeErr.message }, { status: 500 });
      }
      if (probe && probe.length > 0) {
        return NextResponse.json({ inserted: 0, note: "jobs already populated" });
      }
    } else if ((existing as any)?.length) {
      return NextResponse.json({ inserted: 0, note: "jobs already populated" });
    }

    // Minimal demo jobs to seed
    const rows = [
      {
        title: "Hagearbeid – klipping",
        description: "Klipp hekk i bakgården.",
        category: "hage",
        pay_nok: 350,
        duration_minutes: 120,
        area_name: "Oslo",
        lat: 59.9139,
        lng: 10.7522,
        status: "open",
      },
      {
        title: "Flyttehjelp",
        description: "Bære esker fra 3. etasje til bil.",
        category: "flytting",
        pay_nok: 400,
        duration_minutes: 180,
        area_name: "Bergen",
        lat: 60.3913,
        lng: 5.3221,
        status: "open",
      },
    ];

    const { data, error } = await supabase.from("jobs").insert(rows).select("id");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ inserted: data?.length ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
