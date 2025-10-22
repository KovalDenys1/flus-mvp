import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";

export async function POST(request: Request) {
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

    const body = await request.json();
    const {
      navn,
      bio,
      telefon,
      kommune,
      linkedin_url,
      github_url,
      website_url,
      company_name,
      company_org_number,
    } = body;

    // Update user profile
    const { data, error } = await supabase
      .from("users")
      .update({
        navn,
        bio,
        telefon,
        kommune,
        linkedin_url,
        github_url,
        website_url,
        company_name,
        company_org_number,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      if (error.message?.toLowerCase().includes("relation") || (error as {code?: string}).code === "42P01") {
        return NextResponse.json(
          { error: "Database not configured. Please run the Supabase migrations first. See SUPABASE_SETUP.md" },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Error in POST /api/profile/update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
