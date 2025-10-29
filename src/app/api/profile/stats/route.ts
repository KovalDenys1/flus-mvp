import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    // Get current user from our session system
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const stats = {
      role: user.role,
      // Employer stats
      totalJobsCreated: 0,
      activeJobs: 0,
      completedJobs: 0,
      totalApplicationsReceived: 0,
      acceptedApplications: 0,
      // Worker stats
      totalApplicationsSent: 0,
      acceptedJobs: 0,
      completedJobsWorker: 0,
      totalEarnings: 0,
      // Common stats
      totalReviews: 0,
      averageRating: 0,
    };

    if (user.role === "employer" || user.role === "both") {
      // Get employer statistics - jobs created by this user
      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id, status, pay_nok")
        .eq("employer_id", user.id);

      if (!jobsError && jobs) {
        stats.totalJobsCreated = jobs.length;
        stats.activeJobs = jobs.filter(j => j.status === "open").length;
        stats.completedJobs = jobs.filter(j => j.status === "completed").length;
      }

      // Get applications for employer's jobs
      const { data: applications, error: appsError } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          jobs!inner(id, employer_id)
        `)
        .eq("jobs.employer_id", user.id);

      if (!appsError && applications) {
        stats.totalApplicationsReceived = applications.length;
        stats.acceptedApplications = applications.filter(a => a.status === "accepted").length;
      }
    }

    if (user.role === "worker" || user.role === "both") {
      // Get worker statistics - applications sent by this user
      const { data: applications, error: appsError } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          jobs!inner(id, pay_nok, status)
        `)
        .eq("applicant_id", user.id);

      if (!appsError && applications) {
        stats.totalApplicationsSent = applications.length;
        stats.acceptedJobs = applications.filter(a => a.status === "accepted").length;

        // Calculate completed jobs and earnings for worker
        // For now, count all accepted applications as completed jobs
        // TODO: Add proper job completion tracking
        const acceptedJobs = applications.filter(a => a.status === "accepted");
        stats.completedJobsWorker = acceptedJobs.length;
        stats.totalEarnings = acceptedJobs.reduce((sum, app) => {
          const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
          return sum + (job?.pay_nok || 0);
        }, 0);
      }
    }

    // Get reviews statistics (for both roles)
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("reviewee_id", user.id);

    if (!reviewsError && reviews) {
      stats.totalReviews = reviews.length;
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        stats.averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
      }
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error in GET /api/profile/stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
