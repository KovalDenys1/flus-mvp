import { NextRequest, NextResponse } from "next/server";
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

    // Get support tickets for this user
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching support tickets:", error);
      if (error.message?.toLowerCase().includes("relation") || (error as {code?: string}).code === "42P01") {
        // Table doesn't exist yet, return empty array
        return NextResponse.json({ tickets: [] });
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ tickets: data || [] });
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
    const supabase = getSupabaseServer();

    // Get current user from our session system
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

    // Create support ticket
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: user.id,
        subject,
        message,
        category: category || "general",
        status: "open",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating support ticket:", error);
      if (error.message?.toLowerCase().includes("relation") || (error as {code?: string}).code === "42P01") {
        return NextResponse.json(
          { error: "Database not configured. Please run the Supabase migrations first." },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ticket: data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/support/tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}