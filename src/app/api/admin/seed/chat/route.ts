import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = getSupabaseServer();

    // Check if conversations already exist
    const { data: existing, error: countErr } = await supabase
      .from("conversations")
      .select("id", { count: "exact", head: true });

    if (countErr) {
      const { data: probe } = await supabase.from("conversations").select("id").limit(1);
      if (probe && probe.length > 0) {
        return NextResponse.json({ inserted: 0, note: "conversations already populated" });
      }
    } else if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ inserted: 0, note: "conversations already populated" });
    }

    // Get test users
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .in("id", ["test_employer_1", "test_worker_1"]);

    if (!users || users.length < 2) {
      return NextResponse.json({ error: "Test users not found" }, { status: 400 });
    }

    const employer = users.find(u => u.id === "test_employer_1");
    const worker = users.find(u => u.id === "test_worker_1");

    if (!employer || !worker) {
      return NextResponse.json({ error: "Test users not found" }, { status: 400 });
    }

    // Get a job
    const { data: jobs } = await supabase
      .from("jobs")
      .select("id")
      .eq("employer_id", employer.id)
      .limit(1);

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ error: "No jobs found for test employer" }, { status: 400 });
    }

    const jobId = jobs[0].id;

    // Create test conversations
    const conversations = [
      {
        id: "test_conversation_chat",
        job_id: jobId,
        worker_id: worker.id,
        employer_id: employer.id,
      },
      {
        id: "test_conversation_completed",
        job_id: jobId,
        worker_id: worker.id,
        employer_id: employer.id,
      },
    ];

    const { data, error } = await supabase
      .from("conversations")
      .insert(conversations)
      .select("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create some test messages
    const messages = [
      {
        conversation_id: "test_conversation_chat",
        sender_id: employer.id,
        message_type: "text",
        text_content: "Hei! Jeg har valgt deg for jobben. Når kan du starte?",
      },
      {
        conversation_id: "test_conversation_chat",
        sender_id: worker.id,
        message_type: "text",
        text_content: "Hei! Jeg kan starte i morgen kl 10. Ser fram til å jobbe!",
      },
      {
        conversation_id: "test_conversation_completed",
        sender_id: worker.id,
        message_type: "text",
        text_content: "Jobben er fullført! Her er noen bilder av arbeidet.",
      },
      {
        conversation_id: "test_conversation_completed",
        sender_id: worker.id,
        message_type: "system",
        system_event: "work_completed",
      },
    ];

    await supabase.from("messages").insert(messages);

    return NextResponse.json({ inserted: data?.length ?? 0 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}