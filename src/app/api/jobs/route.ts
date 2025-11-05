import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/data/sessions";
import { getJobs, createJob } from "@/lib/data/jobs";
import { containsInappropriateContent } from "@/lib/content-moderation";

export async function GET() {
  try {
    const jobs = await getJobs();
    return NextResponse.json({ jobs });
  } catch (e) {
    console.error("Error fetching jobs:", e);
    return NextResponse.json({ jobs: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      payNok,
      durationMinutes,
      areaName,
      address,
      lat,
      lng,
      scheduleType,
      startTime,
      endTime,
      paymentType,
      requirements,
      initialPhotos,
    } = body;

    // Basic validation
    if (!title || !description || !category || !payNok || !durationMinutes || !areaName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate payment amount
    if (typeof payNok !== 'number' || payNok < 50) {
      return NextResponse.json(
        { error: "Payment must be at least 50 NOK" },
        { status: 400 }
      );
    }

    // Validate duration
    if (typeof durationMinutes !== 'number' || durationMinutes < 15) {
      return NextResponse.json(
        { error: "Duration must be at least 15 minutes" },
        { status: 400 }
      );
    }

    // Content moderation - check for inappropriate content
    const contentToCheck = `${title} ${description} ${requirements || ""}`;
    if (containsInappropriateContent(contentToCheck)) {
      return NextResponse.json(
        { error: "Job description contains inappropriate content. Please review and remove any offensive language." },
        { status: 400 }
      );
    }

    const job = await createJob(
      title,
      description,
      category,
      payNok,
      durationMinutes,
      areaName,
      lat || 59.9139,
      lng || 10.7522,
      user.id,
      address,
      scheduleType || "flexible",
      startTime,
      endTime,
      paymentType || "fixed",
      requirements,
      initialPhotos
    );
    if (!job) {
      return NextResponse.json(
        { error: "Failed to create job" },
        { status: 500 }
      );
    }

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}