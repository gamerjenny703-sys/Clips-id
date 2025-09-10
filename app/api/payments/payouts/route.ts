import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      amount,
      currency = "usd",
      userId,
      paymentMethodId,
      contestId,
    } = await request.json();

    // Validate required fields
    if (!amount || !userId || !paymentMethodId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate minimum payout amount
    if (amount < 10) {
      return NextResponse.json(
        { error: "Minimum payout amount is $10" },
        { status: 400 },
      );
    }

    // Create payout record
    const payout = {
      id: `payout_${Date.now()}`,
      amount,
      currency,
      userId,
      paymentMethodId,
      contestId,
      status: "pending",
      createdAt: new Date().toISOString(),
      estimatedArrival: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 3 days
    };

    // In production, this would integrate with:
    // - Stripe Connect for payouts
    // - PayPal Payouts API
    // - Bank transfer APIs
    // - Crypto payment processors

    console.log("[v0] Payout created:", payout);

    // Simulate processing delay
    setTimeout(async () => {
      // Update payout status to completed
      console.log("[v0] Payout processed:", { ...payout, status: "completed" });
    }, 5000);

    return NextResponse.json({
      payout,
      message: "Payout initiated successfully",
    });
  } catch (error) {
    console.error("[v0] Payout error:", error);
    return NextResponse.json(
      { error: "Payout processing failed" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    // Mock payout history
    const payouts = [
      {
        id: "payout_1",
        amount: 300,
        currency: "usd",
        userId: "user1",
        status: "completed",
        contestId: "contest_1",
        contestTitle: "Best Gaming Highlights",
        paymentMethod: "PayPal",
        createdAt: "2024-01-20T10:00:00Z",
        completedAt: "2024-01-22T14:30:00Z",
      },
      {
        id: "payout_2",
        amount: 150,
        currency: "usd",
        userId: "user1",
        status: "pending",
        contestId: "contest_2",
        contestTitle: "Funny Moments",
        paymentMethod: "Bank Transfer",
        createdAt: "2024-01-21T16:00:00Z",
      },
    ];

    let filteredPayouts = payouts;
    if (userId) {
      filteredPayouts = payouts.filter((p) => p.userId === userId);
    }
    if (status) {
      filteredPayouts = filteredPayouts.filter((p) => p.status === status);
    }

    return NextResponse.json({ payouts: filteredPayouts });
  } catch (error) {
    console.error("[v0] Error fetching payouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch payouts" },
      { status: 500 },
    );
  }
}
