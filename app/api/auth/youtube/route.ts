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
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube`,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Failed to exchange code for tokens")
    }

    // Get user profile information
    const profileResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    )

    const profileData = await profileResponse.json()

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch user profile")
    }

    const channel = profileData.items[0]

    // Store the connection in your database
    // This is a simplified example - implement proper user session management
    const connectionData = {
      platform: "youtube",
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      channelId: channel.id,
      channelTitle: channel.snippet.title,
      subscriberCount: channel.statistics.subscriberCount,
      verified: channel.status?.isLinked || false,
      connectedAt: new Date().toISOString(),
    }

    console.log("[v0] YouTube connection successful:", connectionData)

    // Redirect back to dashboard with success
    return NextResponse.redirect(new URL("/user/dashboard?connected=youtube", request.url))
  } catch (error) {
    console.error("[v0] YouTube OAuth error:", error)
    return NextResponse.redirect(new URL("/auth/error?error=oauth_failed", request.url))
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initiate OAuth flow
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") // Get from session/auth

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    authUrl.searchParams.set("client_id", process.env.YOUTUBE_CLIENT_ID!)
    authUrl.searchParams.set("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube`)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/youtube.readonly")
    authUrl.searchParams.set("access_type", "offline")
    authUrl.searchParams.set("prompt", "consent")
    authUrl.searchParams.set("state", userId || "anonymous")

    return NextResponse.json({ authUrl: authUrl.toString() })
  } catch (error) {
    console.error("[v0] YouTube OAuth initiation error:", error)
    return NextResponse.json({ error: "Failed to initiate OAuth" }, { status: 500 })
  }
}
