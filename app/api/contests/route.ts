import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creatorId");
    const status = searchParams.get("status");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    // Mock contest data - replace with actual database queries
    const contests = [
      {
        id: "1",
        title: "Best Gaming Highlights",
        description: "Create the most engaging gaming highlight clips",
        prize: 500,
        status: "active",
        participants: 45,
        submissions: 67,
        createdAt: "2024-01-15T10:00:00Z",
        endDate: "2024-01-22T23:59:59Z",
        platforms: ["youtube", "tiktok"],
        tags: ["gaming", "highlights", "action"],
        creatorId: "creator1",
      },
      {
        id: "2",
        title: "Funny Moments Compilation",
        description: "Capture the funniest moments from streams",
        prize: 300,
        status: "active",
        participants: 28,
        submissions: 34,
        createdAt: "2024-01-10T15:30:00Z",
        endDate: "2024-01-25T23:59:59Z",
        platforms: ["tiktok", "instagram"],
        tags: ["comedy", "viral", "entertainment"],
        creatorId: "creator1",
      },
    ];

    let filteredContests = contests;
    if (creatorId) {
      filteredContests = contests.filter(
        (contest) => contest.creatorId === creatorId,
      );
    }

    // Filter by status if specified
    if (status) {
      filteredContests = filteredContests.filter(
        (contest) => contest.status === status,
      );
    }

    // Apply pagination
    const paginatedContests = filteredContests.slice(offset, offset + limit);

    return NextResponse.json({
      contests: paginatedContests,
      total: filteredContests.length,
      hasMore: offset + limit < filteredContests.length,
    });
  } catch (error) {
    console.error("[v0] Error fetching contests:", error);
    return NextResponse.json(
      { error: "Failed to fetch contests" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contestData = await request.json();

    // Validate required fields
    const requiredFields = ["title", "description", "prize", "platforms"];
    for (const field of requiredFields) {
      if (!contestData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Create contest in database
    const newContest = {
      id: `contest_${Date.now()}`,
      ...contestData,
      status: "active",
      participants: 0,
      submissions: 0,
      createdAt: new Date().toISOString(),
      // Calculate end date based on duration
      endDate: new Date(
        Date.now() + contestData.duration * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };

    console.log("[v0] Contest created:", newContest);

    return NextResponse.json({ contest: newContest }, { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating contest:", error);
    return NextResponse.json(
      { error: "Failed to create contest" },
      { status: 500 },
    );
  }
}
