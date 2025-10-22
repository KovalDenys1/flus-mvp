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

    // Get reviews for this user
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        reviewer:reviewer_id (
          id,
          navn
        )
      `)
      .eq("reviewee_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching reviews:", error);
      if (error.message?.toLowerCase().includes("relation") || (error as {code?: string}).code === "42P01") {
        // Table doesn't exist yet, return empty array
        return NextResponse.json({ reviews: [] });
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (error) {
    console.error("Error in GET /api/profile/reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const { reviewee_id, job_id, rating, comment } = body;

    // Validation
    if (!reviewee_id || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: reviewee_id, rating" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (user.id === reviewee_id) {
      return NextResponse.json(
        { error: "You cannot review yourself" },
        { status: 400 }
      );
    }

    // Create review
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        reviewer_id: user.id,
        reviewee_id,
        job_id: job_id || null,
        rating,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
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

    return NextResponse.json({ review: data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/profile/reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
