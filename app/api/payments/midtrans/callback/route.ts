"use server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const payload = await request.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.log("server key belom di tambahain maszeh");
      return NextResponse.json({ error: "server config ny eror maszeh" });
    }

    const stringToHash = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;

    const hashedSignature = crypto
      .createHash("sha512")
      .update(stringToHash)
      .digest("hex");

    const midtransSignature = request.headers.get("x-midtrans-signature");
    if (midtransSignature !== hashedSignature) {
      console.error("invalid signature from midtrans: ", {
        received: midtransSignature,
        calculated: hashedSignature,
      });

      return NextResponse.json(
        { error: "invalid signature " },
        { status: 403 },
      );
    }

    console.log("verivikasi midtrans berhasil");

    const transactionStatus = payload.transaction_status;
    const orderId = payload.order_id;
    const contestId = parseInt(orderId.split("_")[1]);

    let updateStatus: string;
    let paymentStatus: string;

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      updateStatus = "active";
      paymentStatus = "paid";
    } else if (
      transactionStatus === "deny" ||
      transactionStatus === "expired" ||
      transactionStatus === "cancel"
    ) {
      updateStatus = "payment_failded";
      paymentStatus = "failed";
    } else {
      return NextResponse.json(
        { message: `Unhaled transaction status: ${transactionStatus}` },
        { status: 200 },
      );
    }

    const { error: updateError } = await supabase
      .from("contests")
      .update({
        status: updateStatus,
        payment_status: paymentStatus,
        paid_at: updateStatus === "active" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contestId);

    if (updateError) {
      console.error("Error updating contest status", updateError);
      return NextResponse.json(
        { error: "gagal nge update contest di database " },
        { status: 500 },
      );
    }

    console.log(
      `Contest ID ${contestId} status updated to ${updateStatus} successfully.`,
    );

    revalidatePath("/creator/dashboard");
    revalidatePath(`/creator/contest/${contestId}/manage`);

    return NextResponse.json(
      { message: "notification received and verified. " },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("error in midtrans callback:", error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
