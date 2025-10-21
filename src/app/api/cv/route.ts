import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/data/sessions";

export async function GET() {
  try {
    const { user } = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServer();

    // Get CV entries
    const { data: cvEntries, error: cvError } = await supabase
      .from("cv_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("start_date", { ascending: false });

    if (cvError) {
      console.error("Error fetching CV entries:", cvError);
      return NextResponse.json(
        { error: "Failed to fetch CV entries" },
        { status: 500 }
      );
    }

    // Get skills
    const { data: skills, error: skillsError } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", user.id)
      .order("skill_name");

    if (skillsError) {
      console.error("Error fetching skills:", skillsError);
      return NextResponse.json(
        { error: "Failed to fetch skills" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      cv_entries: cvEntries || [],
      skills: skills || []
    });

  } catch (error) {
    console.error("CV GET error:", error);
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
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing type or data fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    if (type === "cv_entry") {
      // Add CV entry
      const { title, company, description, start_date, end_date, current_job } = data;

      if (!title || !company || !start_date) {
        return NextResponse.json(
          { error: "Missing required fields: title, company, start_date" },
          { status: 400 }
        );
      }

      const { data: cvEntry, error } = await supabase
        .from("cv_entries")
        .insert({
          user_id: user.id,
          title,
          company,
          description,
          start_date,
          end_date,
          current_job
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating CV entry:", error);
        return NextResponse.json(
          { error: "Failed to create CV entry" },
          { status: 500 }
        );
      }

      return NextResponse.json({ cv_entry: cvEntry });

    } else if (type === "skill") {
      // Add skill
      const { skill_name, proficiency_level, years_experience } = data;

      if (!skill_name) {
        return NextResponse.json(
          { error: "Missing required field: skill_name" },
          { status: 400 }
        );
      }

      const { data: skill, error } = await supabase
        .from("skills")
        .insert({
          user_id: user.id,
          skill_name,
          proficiency_level: proficiency_level || "beginner",
          years_experience: years_experience || 0
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating skill:", error);
        return NextResponse.json(
          { error: "Failed to create skill" },
          { status: 500 }
        );
      }

      return NextResponse.json({ skill });

    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'cv_entry' or 'skill'" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("CV POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}