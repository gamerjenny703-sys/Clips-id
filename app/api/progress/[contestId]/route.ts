import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { contestId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const timeframe = searchParams.get("timeframe") || "24h"

    // Mock progress data - replace with actual database queries
    const progressData = {
      contestId: params.contestId,
      userId,
      currentRank: 1,
      totalParticipants: 45,
      score: 95,
      maxScore: 100,
      metrics: {
        views: {
          current: 12500,
          previous: 11800,
          change: 700,
          changePercent: 5.9,
          trend: "up",
          history: [
            { timestamp: "2024-01-20T00:00:00Z", value: 10000 },
            { timestamp: "2024-01-20T06:00:00Z", value: 10500 },
            { timestamp: "2024-01-20T12:00:00Z", value: 11200 },
            { timestamp: "2024-01-20T18:00:00Z", value: 11800 },
            { timestamp: "2024-01-21T00:00:00Z", value: 12500 },
          ],
        },
        likes: {
          current: 890,
          previous: 820,
          change: 70,
          changePercent: 8.5,
          trend: "up",
          history: [
            { timestamp: "2024-01-20T00:00:00Z", value: 750 },
            { timestamp: "2024-01-20T06:00:00Z", value: 780 },
            { timestamp: "2024-01-20T12:00:00Z", value: 800 },
            { timestamp: "2024-01-20T18:00:00Z", value: 820 },
            { timestamp: "2024-01-21T00:00:00Z", value: 890 },
          ],
        },
        comments: {
          current: 45,
          previous: 42,
          change: 3,
          changePercent: 7.1,
          trend: "up",
          history: [
            { timestamp: "2024-01-20T00:00:00Z", value: 35 },
            { timestamp: "2024-01-20T06:00:00Z", value: 38 },
            { timestamp: "2024-01-20T12:00:00Z", value: 40 },
            { timestamp: "2024-01-20T18:00:00Z", value: 42 },
            { timestamp: "2024-01-21T00:00:00Z", value: 45 },
          ],
        },
        shares: {
          current: 23,
          previous: 20,
          change: 3,
          changePercent: 15.0,
          trend: "up",
          history: [
            { timestamp: "2024-01-20T00:00:00Z", value: 15 },
            { timestamp: "2024-01-20T06:00:00Z", value: 17 },
            { timestamp: "2024-01-20T12:00:00Z", value: 18 },
            { timestamp: "2024-01-20T18:00:00Z", value: 20 },
            { timestamp: "2024-01-21T00:00:00Z", value: 23 },
          ],
        },
      },
      insights: {
        performanceVsAverage: 23,
        bestPostingTime: "19:00-21:00 EST",
        topPerformingContent: "gaming highlights with commentary",
        improvementSuggestions: [
          "Post during peak hours (7-9 PM EST) for 40% better engagement",
          "Add commentary to clips for 2x more engagement",
          "Use trending hashtags to increase discoverability",
        ],
      },
      lastUpdated: new Date().toISOString(),
    }

    console.log("[v0] Progress data fetched for contest:", params.contestId)

    return NextResponse.json(progressData)
  } catch (error) {
    console.error("[v0] Error fetching progress data:", error)
    return NextResponse.json({ error: "Failed to fetch progress data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { contestId: string } }) {
  try {
    const updateData = await request.json()

    // Update progress metrics in database
    // This would typically involve:
    // 1. Fetching latest metrics from social media APIs
    // 2. Calculating new scores and rankings
    // 3. Updating user progress records
    // 4. Triggering notifications if rank changes

    const updatedProgress = {
      contestId: params.contestId,
      userId: updateData.userId,
      metrics: updateData.metrics,
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] Progress updated for contest:", params.contestId, updatedProgress)

    return NextResponse.json({ success: true, progress: updatedProgress })
  } catch (error) {
    console.error("[v0] Error updating progress:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
