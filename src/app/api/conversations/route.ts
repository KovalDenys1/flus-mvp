
import { NextRequest, NextResponse } from "next/server";
import { getConversationsForUser, findOrCreateConversation } from "@/lib/chat-db";
import { getSession } from "@/lib/data/sessions";

/**
 * GET /api/conversations
 * Returns a list of all conversations for the current user.
 */
export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const conversations = await getConversationsForUser(session.user.id);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/conversations
 * Creates or finds a conversation for a job application.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobId } = await req.json();

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Получаем информацию о работе, чтобы узнать employer_id
    const jobRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}&select=employer_id`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      }
    });

    if (!jobRes.ok) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const jobs = await jobRes.json();
    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const employerId = jobs[0].employer_id;

    // Определяем роли: текущий пользователь - worker, employer - владелец работы
    const workerId = session.user.id;

    // Создаем или находим разговор
    const conversation = await findOrCreateConversation(jobId, workerId, employerId);

    // Создаем заявку на работу
    const appRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_id: jobId,
        applicant_id: workerId,
        status: 'sendt'
      })
    });

    if (!appRes.ok) {
      console.error('Failed to create application:', await appRes.text());
      // Не прерываем процесс, если заявка не создалась
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
