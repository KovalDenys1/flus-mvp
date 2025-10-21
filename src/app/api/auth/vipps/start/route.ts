import { NextRequest, NextResponse } from "next/server";

// Vipps OAuth configuration
const VIPPS_AUTH_URL = "https://api.vipps.no/access-management-1.0/access/oauth2/auth";

export async function GET(req: NextRequest) {
  // No role selection needed - users can switch roles in the UI
  const state = JSON.stringify({ timestamp: Date.now() });

  // Vipps authorization URL parameters
  const params = new URLSearchParams({
    client_id: process.env.VIPPS_CLIENT_ID!,
    response_type: "code",
    scope: "openid name phoneNumber address email",
    state: Buffer.from(state).toString('base64'),
    redirect_uri: `${req.nextUrl.origin}/api/auth/vipps/callback`,
  });

  const authUrl = `${VIPPS_AUTH_URL}?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
