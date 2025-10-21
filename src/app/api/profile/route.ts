import { NextResponse, NextRequest } from "next/server";
import { workerProfile, recentReviews } from "../../../lib/data/profile";
import { isAllowedSocial, stripPII } from "../../../lib/utils/safety";

export async function GET() {
  const socials = workerProfile.socials.filter(s => s.visible && isAllowedSocial(s.url));
  const reviews = recentReviews.map(r => ({ ...r, text: stripPII(r.text) }));
  return NextResponse.json({
    profile: { ...workerProfile, socials },
    reviews,
    aggregates: {
      avgRating: reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "0.0",
      totalDone: workerProfile.cv.length,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, type } = body as { url?: string; type?: string; visible?: boolean };
    if (!url || !type) return NextResponse.json({ error: "url and type are required" }, { status: 400 });
    if (!isAllowedSocial(url)) return NextResponse.json({ error: "domain not allowed" }, { status: 400 });

  // In a real implementation, insert this social link into a persistent store.

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}