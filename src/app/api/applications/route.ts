import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";
import { findOrCreateConversation } from "@/lib/chat-db";

// GET: return applications for the current user (worker)
export async function GET() {
  const { user } = await getSession();
  if (!user) return NextResponse.json({ applications: [] });

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("applications")
    .select(`
      id, job_id, applicant_id, created_at, status,
      job:job_id(id, title, employer_id, employer:employer_id(id, navn, email))
    `)
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    // If table missing or RLS prevents read, return empty list gracefully in demo
    return NextResponse.json({ applications: [] });
  }

  const applications = (data ?? []).map((a: Record<string, unknown>) => ({
    id: a.id as string,
    jobId: a.job_id as string,
    workerId: a.applicant_id as string,
    status: (a.status as string) || "sendt",
    createdAt: a.created_at as string,
    job: a.job ? {
      id: (a.job as Record<string, unknown>).id as string,
      title: (a.job as Record<string, unknown>).title as string,
      employerId: (a.job as Record<string, unknown>).employer_id as string,
      employer: (a.job as Record<string, unknown>).employer
    } : null,
  }));
  return NextResponse.json({ applications });
}

// POST: create an application and tie to a conversation (in-memory for now)
export async function POST(req: NextRequest) {
  const { user } = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { jobId } = body as { jobId?: string };
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Ensure we don't duplicate application for same job+user
    const { data: existing, error: existErr } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", jobId)
      .eq("applicant_id", user.id)
      .maybeSingle();
    if (existErr && (existErr as { code?: string }).code !== "PGRST116") {
      return NextResponse.json({ error: existErr.message }, { status: 500 });
    }

    let appId: string | null = existing?.id ?? null;
    if (!appId) {
      const { data: inserted, error } = await supabase
        .from("applications")
        .insert({ job_id: jobId, applicant_id: user.id })
        .select("id")
        .maybeSingle();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      appId = inserted?.id ?? null;
    }

    // Fetch employer_id from job
    const { data: jobData } = await supabase
      .from("jobs")
      .select("employer_id")
      .eq("id", jobId)
      .maybeSingle();
    
    const employerId = jobData?.employer_id || "u_employer_1";
    const conv = await findOrCreateConversation(jobId, user.id, employerId);

    return NextResponse.json(
      {
        ok: true,
        application: {
          id: appId ?? "",
          jobId,
          workerId: user.id,
          status: "sendt" as const,
          createdAt: new Date().toISOString(),
        },
        conversationId: conv.id,
      },
      { status: appId ? 201 : 200 }
    );
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}