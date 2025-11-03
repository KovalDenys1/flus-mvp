import { NextResponse } from "next/server";
import { getSession } from "@/lib/data/sessions";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const { user } = await getSession();
  if (!user) return NextResponse.json({ notifications: [] });

  try {
    const supabase = getSupabaseServer();

    // Get notifications from database
    // For now, we'll create mock notifications based on recent activity
    const notifications = [];

    // Check for recent applications to user's jobs
    const { data: recentApplications } = await supabase
      .from("applications")
      .select(`
        id, created_at, status,
        job:job_id(id, title, employer_id),
        applicant:applicant_id(id, navn, email)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentApplications) {
      for (const app of recentApplications) {
        // Check if this application is for user's job
        const jobData = app.job as unknown as { employer_id: string; title: string };
        if (jobData?.employer_id === user.id) {
          const applicantData = app.applicant as unknown as { navn?: string; email: string };
          notifications.push({
            id: `app-${app.id}`,
            type: "application",
            title: "Ny søknad på jobb",
            message: `${applicantData?.navn || applicantData?.email || 'Noen'} har søkt på "${jobData?.title}"`,
            read: false,
            createdAt: app.created_at,
            actionUrl: `/mine-jobber`
          });
        }
      }
    }

    // Check for unread messages (simplified - would need messages table)
    // For demo purposes, we'll add a sample message notification
    if (notifications.length === 0) {
      notifications.push({
        id: "sample-1",
        type: "message",
        title: "Ny melding",
        message: "Du har fått en ny melding fra en arbeider",
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: "/samtaler"
      });
    }

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ notifications: [] });
  }
}