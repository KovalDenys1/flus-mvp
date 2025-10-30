import { NextResponse } from "next/server";
import { updateJob, deleteJob } from "@/lib/data/jobs";
import { getSession } from "@/lib/data/sessions";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updatedJob = await updateJob(id, user.id, body);

    if (!updatedJob) {
      return NextResponse.json({ error: "Failed to update job or job not found" }, { status: 404 });
    }

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteJob(id, user.id);

    if (!success) {
      return NextResponse.json({ error: "Failed to delete job or job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}