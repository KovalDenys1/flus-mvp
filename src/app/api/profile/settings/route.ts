import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { user } = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Get user settings
    const { data, error } = await supabase
      .from("users")
      .select("auto_approve_applications")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user settings:", error);
      return NextResponse.json(
        { error: "Failed to fetch settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      settings: {
        autoApproveApplications: data.auto_approve_applications ?? false
      }
    });
  } catch (error) {
    console.error("Error in GET /api/profile/settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = getSupabaseServer();
    const { user } = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { autoApproveApplications } = body;

    if (typeof autoApproveApplications !== "boolean") {
      return NextResponse.json(
        { error: "autoApproveApplications must be a boolean" },
        { status: 400 }
      );
    }

    // Update user settings
    const { error } = await supabase
      .from("users")
      .update({ auto_approve_applications: autoApproveApplications })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating user settings:", error);
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: {
        autoApproveApplications
      }
    });
  } catch (error) {
    console.error("Error in PUT /api/profile/settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}