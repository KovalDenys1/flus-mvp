import { NextResponse, NextRequest } from "next/server";
import { getWorkerProfile, getReviewsForUser, addCvEntry, addSkill } from "../../../lib/data/profile";
import { getSession } from "../../../lib/data/sessions";
import { isAllowedSocial, stripPII } from "../../../lib/utils/safety";

export async function GET() {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getWorkerProfile(user.id);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const reviews = await getReviewsForUser(user.id);
    const socials: { url: string; type: string }[] = []; // TODO: Implement social links when table is created
    const safeReviews = reviews.map(r => ({ ...r, text: stripPII(r.text) }));

    return NextResponse.json({
      profile: { ...profile, socials },
      reviews: safeReviews,
      aggregates: {
        avgRating: reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "0.0",
        totalDone: profile.cv.length,
      },
    });
  } catch (e) {
    console.error("Error fetching profile:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, type, title, category, date, skill } = body as {
      url?: string;
      type?: string;
      title?: string;
      category?: string;
      date?: string;
      skill?: string;
    };

    // Handle CV entry addition
    if (title && category && date) {
      const success = await addCvEntry(user.id, { title, category, date });
      if (!success) {
        return NextResponse.json({ error: "Failed to add CV entry" }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    // Handle skill addition
    if (skill) {
      const success = await addSkill(user.id, skill);
      if (!success) {
        return NextResponse.json({ error: "Failed to add skill" }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    // Handle social link addition (TODO: implement when table is created)
    if (url && type) {
      if (!isAllowedSocial(url)) {
        return NextResponse.json({ error: "Domain not allowed" }, { status: 400 });
      }
      // TODO: Save to database when social_links table is implemented
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  } catch (e: unknown) {
    console.error("Error in profile POST:", e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}