import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/error?error=missing_code", request.url),
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://api.twitter.com/2/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter`,
          code_verifier: "challenge", // In production, store and retrieve the actual code verifier
        }),
      },
    );

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(
        tokens.error_description || "Failed to exchange code for tokens",
      );
    }

    // Get user profile information
    const profileResponse = await fetch(
      "https://api.twitter.com/2/users/me?user.fields=id,name,username,public_metrics,verified",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    const profileData = await profileResponse.json();

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const user = profileData.data;

    // Store the connection in your database
    const connectionData = {
      platform: "twitter",
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      userId: user.id,
      username: user.username,
      displayName: user.name,
      followerCount: user.public_metrics.followers_count,
      verified: user.verified,
      connectedAt: new Date().toISOString(),
    };

    console.log("[v0] Twitter connection successful:", connectionData);

    // Redirect back to dashboard with success
    return NextResponse.redirect(
      new URL("/user/dashboard?connected=twitter", request.url),
    );
  } catch (error) {
    console.error("[v0] Twitter OAuth error:", error);
    return NextResponse.redirect(
      new URL("/auth/error?error=oauth_failed", request.url),
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initiate OAuth flow
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // Get from session/auth

    const authUrl = new URL("https://twitter.com/i/oauth2/authorize");
    authUrl.searchParams.set("client_id", process.env.TWITTER_CLIENT_ID!);
    authUrl.searchParams.set(
      "redirect_uri",
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter`,
    );
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "tweet.read users.read follows.read");
    authUrl.searchParams.set("state", userId || "anonymous");
    authUrl.searchParams.set("code_challenge", "challenge"); // In production, generate proper PKCE challenge
    authUrl.searchParams.set("code_challenge_method", "plain");

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error("[v0] Twitter OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth" },
      { status: 500 },
    );
  }
}
