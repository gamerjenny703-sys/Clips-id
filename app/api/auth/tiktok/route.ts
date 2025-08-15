import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error?error=missing_code", request.url))
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://open-api.tiktok.com/oauth/access_token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok`,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok || tokens.error) {
      throw new Error(tokens.error_description || "Failed to exchange code for tokens")
    }

    // Get user profile information
    const profileResponse = await fetch(
      "https://open-api.tiktok.com/user/info/?fields=open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count,video_count",
      {
        headers: {
          Authorization: `Bearer ${tokens.data.access_token}`,
        },
      },
    )

    const profileData = await profileResponse.json()

    if (!profileResponse.ok || profileData.error) {
      throw new Error("Failed to fetch user profile")
    }

    const user = profileData.data.user

    // Store the connection in your database
    const connectionData = {
      platform: "tiktok",
      accessToken: tokens.data.access_token,
      refreshToken: tokens.data.refresh_token,
      openId: user.open_id,
      displayName: user.display_name,
      followerCount: user.follower_count,
      verified: false, // TikTok doesn't provide verification status in basic API
      connectedAt: new Date().toISOString(),
    }

    console.log("[v0] TikTok connection successful:", connectionData)

    // Redirect back to dashboard with success
    return NextResponse.redirect(new URL("/user/dashboard?connected=tiktok", request.url))
  } catch (error) {
    console.error("[v0] TikTok OAuth error:", error)
    return NextResponse.redirect(new URL("/auth/error?error=oauth_failed", request.url))
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initiate OAuth flow
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") // Get from session/auth

    const authUrl = new URL("https://www.tiktok.com/auth/authorize/")
    authUrl.searchParams.set("client_key", process.env.TIKTOK_CLIENT_KEY!)
    authUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok`)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "user.info.basic,user.info.stats,video.list")
    authUrl.searchParams.set("state", userId || "anonymous")

    return NextResponse.json({ authUrl: authUrl.toString() })
  } catch (error) {
    console.error("[v0] TikTok OAuth initiation error:", error)
    return NextResponse.json({ error: "Failed to initiate OAuth" }, { status: 500 })
  }
}
