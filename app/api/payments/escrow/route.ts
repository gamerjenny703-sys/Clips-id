import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { contestId, amount, creatorId } = await request.json();

    // Create escrow account for contest
    const escrow = {
      id: `escrow_${Date.now()}`,
      contestId,
      creatorId,
      amount,
      currency: "usd",
      status: "held",
      createdAt: new Date().toISOString(),
      releaseConditions: {
        contestEnd: true,
        winnersSelected: true,
        disputeResolved: true,
      },
    };

    console.log("[v0] Escrow created:", escrow);

    return NextResponse.json({ escrow });
  } catch (error) {
    console.error("[v0] Escrow creation error:", error);
    return NextResponse.json(
      { error: "Failed to create escrow" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { escrowId, action, winnerId, amount } = await request.json();

    if (action === "release") {
      // Release funds to winner
      const release = {
        escrowId,
        winnerId,
        amount,
        status: "released",
        releasedAt: new Date().toISOString(),
      };

      console.log("[v0] Escrow funds released:", release);

      return NextResponse.json({
        success: true,
        message: "Funds released to winner",
        release,
      });
    } else if (action === "refund") {
      // Refund to creator
      const refund = {
        escrowId,
        amount,
        status: "refunded",
        refundedAt: new Date().toISOString(),
      };

      console.log("[v0] Escrow funds refunded:", refund);

      return NextResponse.json({
        success: true,
        message: "Funds refunded to creator",
        refund,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[v0] Escrow action error:", error);
    return NextResponse.json(
      { error: "Escrow action failed" },
      { status: 500 },
    );
  }
}
