import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd", contestId, userId, type } = await request.json()

    // Validate required fields
    if (!amount || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Stripe payment intent
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount: amount * 100, // Stripe uses cents
      currency,
      status: "requires_payment_method",
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        contestId: contestId || "",
        userId,
        type: type || "deposit",
      },
    }

    // In production, this would be:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount * 100,
    //   currency,
    //   metadata: { contestId, userId, type }
    // })

    console.log("[v0] Stripe payment intent created:", paymentIntent)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("[v0] Stripe payment error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentIntentId = searchParams.get("payment_intent")

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID required" }, { status: 400 })
    }

    // Retrieve payment intent status
    const paymentIntent = {
      id: paymentIntentId,
      status: "succeeded",
      amount: 50000, // $500.00
      currency: "usd",
      created: Date.now(),
    }

    // In production:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    console.log("[v0] Payment intent retrieved:", paymentIntent)

    return NextResponse.json(paymentIntent)
  } catch (error) {
    console.error("[v0] Error retrieving payment:", error)
    return NextResponse.json({ error: "Failed to retrieve payment" }, { status: 500 })
  }
}
