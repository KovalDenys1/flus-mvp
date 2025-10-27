import { NextRequest, NextResponse } from "next/server";

// Vipps OAuth configuration
const VIPPS_AUTH_URL = "https://api.vipps.no/access-management-1.0/access/oauth2/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role') || 'worker';
  const birthYear = searchParams.get('birthYear');

  // Validate age if provided
  if (birthYear) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);
    if (age < 18) {
      return NextResponse.redirect(new URL('/register?error=age', req.url));
    }
  }

  const state = JSON.stringify({ 
    timestamp: Date.now(),
    role,
    birthYear: birthYear || null
  });

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
