import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, contestId, platform, contentUrl } = await request.json()

    // Simulate fetching metrics from social media APIs
    const syncMetrics = async (platform: string, contentUrl: string) => {
      // This would make actual API calls to social media platforms
      switch (platform.toLowerCase()) {
        case "youtube":
          // YouTube Data API call
          return {
            views: Math.floor(Math.random() * 10000) + 5000,
            likes: Math.floor(Math.random() * 500) + 100,
            comments: Math.floor(Math.random() * 50) + 10,
            shares: Math.floor(Math.random() * 25) + 5,
          }
        case "tiktok":
          // TikTok API call
          return {
            views: Math.floor(Math.random() * 50000) + 10000,
            likes: Math.floor(Math.random() * 2000) + 500,
            comments: Math.floor(Math.random() * 100) + 20,
            shares: Math.floor(Math.random() * 50) + 10,
          }
        case "twitter":
          // Twitter API call
          return {
            views: Math.floor(Math.random() * 5000) + 1000,
            likes: Math.floor(Math.random() * 200) + 50,
            comments: Math.floor(Math.random() * 30) + 5,
            shares: Math.floor(Math.random() * 20) + 3,
          }
        default:
          throw new Error(`Unsupported platform: ${platform}`)
      }
    }

    const metrics = await syncMetrics(platform, contentUrl)

    // Calculate engagement score
    const engagementScore = Math.round(
      (metrics.likes * 2 + metrics.comments * 3 + metrics.shares * 5) / (metrics.views / 100),
    )

    // Update progress in database
    const progressUpdate = {
      userId,
      contestId,
      platform,
      contentUrl,
      metrics,
      engagementScore,
      syncedAt: new Date().toISOString(),
    }

    console.log("[v0] Metrics synced:", progressUpdate)

    // Simulate rank calculation
    const newRank = Math.floor(Math.random() * 10) + 1
    const rankChange = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1

    return NextResponse.json({
      success: true,
      metrics,
      engagementScore,
      rank: newRank,
      rankChange,
      syncedAt: progressUpdate.syncedAt,
    })
  } catch (error) {
    console.error("[v0] Error syncing progress:", error)
    return NextResponse.json({ error: "Failed to sync progress data" }, { status: 500 })
  }
}
