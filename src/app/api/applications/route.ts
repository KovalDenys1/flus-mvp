import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/data/sessions";
import { getApplicationsForUser, createApplication, updateApplicationStatus } from "@/lib/data/applications";
import { sendNewApplicationEmail, sendApplicationStatusEmail } from "@/lib/email";

export async function GET() {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ applications: [] });
    }

    const applications = await getApplicationsForUser(user.id);
    return NextResponse.json({ applications });
  } catch (e) {
    console.error("Error fetching applications:", e);
    return NextResponse.json({ applications: [] });
  }
}

// POST: create an application (conversation will be created when employer selects candidate)
export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId } = body as { jobId?: string };
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    // Create application
    const application = await createApplication(jobId, user.id);
    if (!application) {
      return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
    }

    // Send email notification to employer about new application
    if (application.job?.employer.email) {
      try {
        await sendNewApplicationEmail(
          application.job.employer.email,
          application.job.employer.navn,
          application.job.title,
          user.navn || "Kandidat"
        );
      } catch (emailError) {
        console.error("Failed to send new application email:", emailError);
        // Don't fail the application creation if email fails
      }
    }

    return NextResponse.json({
      ok: true,
      application,
    }, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH: update application status
export async function PATCH(req: NextRequest) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { applicationId, status } = body as { applicationId?: string; status?: string };

    if (!applicationId || !status) {
      return NextResponse.json({ error: "applicationId and status are required" }, { status: 400 });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status. Must be 'accepted' or 'rejected'" }, { status: 400 });
    }

    // Update application status
    const application = await updateApplicationStatus(applicationId, status as "accepted" | "rejected");
    if (!application) {
      return NextResponse.json({ error: "Application not found or update failed" }, { status: 404 });
    }

    // Verify user is the employer
    if (application.job?.employer.id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to update this application" }, { status: 403 });
    }

    // Send email notification to worker about status change
    if (application.worker?.email) {
      try {
        await sendApplicationStatusEmail(
          application.worker.email,
          application.worker.navn,
          application.job.title,
          status as "approved" | "rejected",
          user.navn || "Arbeidsgiver"
        );
      } catch (emailError) {
        console.error("Failed to send application status email:", emailError);
        // Don't fail the status update if email fails
      }
    }

    return NextResponse.json({
      ok: true,
      application: {
        id: applicationId,
        status,
      }
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
