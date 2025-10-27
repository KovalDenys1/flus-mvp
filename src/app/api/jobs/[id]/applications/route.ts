import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = getSupabaseServer();
    const { user } = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobId = id;

    // Check if job exists and belongs to current user
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, employer_id, status")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.employer_id !== user.id) {
      return NextResponse.json(
        { error: "You can only view applications for your own jobs" },
        { status: 403 }
      );
    }

    // Get applications with user details
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        job_id,
        applicant_id,
        status,
        created_at,
        updated_at
      `)
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 }
      );
    }

    // Get user details for each application
    const applicationsWithUsers = await Promise.all(
      (data || []).map(async (app) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, name, email, phone, bio, skills, rating, completed_jobs")
          .eq("user_id", app.applicant_id)
          .single();

        return {
          id: app.id,
          jobId: app.job_id,
          workerId: app.applicant_id,
          status: app.status,
          createdAt: app.created_at,
          updatedAt: app.updated_at,
          worker: profile ? {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            bio: profile.bio,
            skills: profile.skills,
            rating: profile.rating,
            completedJobs: profile.completed_jobs,
          } : null,
        };
      })
    );

    return NextResponse.json({ applications: applicationsWithUsers });

  } catch (error) {
    console.error("Error in get applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}