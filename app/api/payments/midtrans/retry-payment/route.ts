import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contestId } = await request.json();

    if (!contestId) {
      return NextResponse.json(
        { error: "Contest ID is required" },
        { status: 400 },
      );
    }

    console.log(
      "Retry payment requested for contest:",
      contestId,
      "by user:",
      user.id,
    );

    // Get contest details
    const { data: contest, error: contestError } = await supabase
      .from("contests")
      .select("id, title, prize_pool, creator_id, status, payment_status")
      .eq("id", contestId)
      .eq("creator_id", user.id)
      .single();

    if (contestError || !contest) {
      console.error("Contest not found:", contestError);
      return NextResponse.json(
        { error: "Contest not found or access denied" },
        { status: 404 },
      );
    }

    console.log("Contest found:", contest);

    // Check if contest is eligible for retry
    if (
      contest.status !== "pending_payment" &&
      contest.payment_status !== "pending"
    ) {
      console.log(
        "Contest not eligible for retry. Status:",
        contest.status,
        "Payment status:",
        contest.payment_status,
      );
      return NextResponse.json(
        { error: "Contest is not eligible for payment retry" },
        { status: 400 },
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    console.log("User profile:", profile);

    // Create Snap token using Midtrans Snap API
    const snapResponse = await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: `contest_${contestId}_${Date.now()}`,
            gross_amount: parseInt(contest.prize_pool),
          },
          customer_details: {
            first_name: profile?.full_name || "User",
            email: user.email,
          },
          item_details: [
            {
              id: contestId,
              price: parseInt(contest.prize_pool),
              quantity: 1,
              name: `Contest: ${contest.title}`,
            },
          ],
          callbacks: {
            finish: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard`,
            error: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard`,
          },
        }),
      },
    );

    console.log("Midtrans Snap response status:", snapResponse.status);

    if (!snapResponse.ok) {
      const errorData = await snapResponse.text();
      console.error("Midtrans Snap API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create payment token from Midtrans" },
        { status: 500 },
      );
    }

    const snapData = await snapResponse.json();
    console.log("Midtrans Snap response data:", snapData);

    // Check if we got a token
    if (!snapData.token) {
      console.error("No token in Midtrans response:", snapData);
      return NextResponse.json(
        { error: "No payment token received from Midtrans" },
        { status: 500 },
      );
    }

    // Update contest with new payment attempt
    const { error: updateError } = await supabase
      .from("contests")
      .update({
        payment_status: "pending",
        payment_details: snapData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contestId);

    if (updateError) {
      console.error("Failed to update contest:", updateError);
    } else {
      console.log("Contest payment status updated to pending");
    }

    return NextResponse.json({
      success: true,
      token: snapData.token,
      payment_details: snapData,
    });
  } catch (error) {
    console.error("Retry payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
