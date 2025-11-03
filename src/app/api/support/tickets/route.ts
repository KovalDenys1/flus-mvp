import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/data/sessions";
import { getSupportTicketsForUser, createSupportTicket } from "@/lib/data/support";
import { containsInappropriateContent } from "@/lib/content-moderation";

export async function GET() {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const tickets = await getSupportTicketsForUser(user.id);
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Error in GET /api/support/tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { subject, message, category } = body;

    // Validation
    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    if (subject.length < 5 || message.length < 10) {
      return NextResponse.json(
        { error: "Subject must be at least 5 characters and message at least 10 characters" },
        { status: 400 }
      );
    }

    // Content moderation - check for inappropriate content
    const contentToCheck = `${subject} ${message}`;
    if (containsInappropriateContent(contentToCheck)) {
      return NextResponse.json(
        { error: "Message contains inappropriate content. Please review and remove any offensive language." },
        { status: 400 }
      );
    }

    const ticket = await createSupportTicket(user.id, subject, message, category);
    if (!ticket) {
      return NextResponse.json(
        { error: "Failed to create support ticket" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/support/tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}