"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PaymentRetryButtonProps {
  contestId: string;
  contestTitle: string;
  prizePool: number;
}

export default function PaymentRetryButton({
  contestId,
  contestTitle,
  prizePool,
}: PaymentRetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  const handleRetryPayment = async () => {
    setIsRetrying(true);

    try {
      // Request new payment token
      const response = await fetch("/api/payments/midtrans/retry-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contestId }),
      });

      const data = await response.json();
      console.log("DATA DITERIMA DARI API:", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to retry payment");
      }

      // Open Midtrans Snap with new token
      if (window.snap && data.token) {
        window.snap.pay(data.token, {
          onSuccess: async (result: any) => {
            console.log("Payment successful!", result);

            // Update contest status
            const supabase = createClient();
            const { error: updateError } = await supabase
              .from("contests")
              .update({
                status: "active",
                payment_status: "paid",
                payment_details: result,
                paid_at: new Date().toISOString(),
              })
              .eq("id", contestId);

            if (updateError) {
              console.error("Failed to update contest status:", updateError);
            }

            // Refresh page to show updated status
            router.refresh();
          },
          onPending: (result: any) => {
            console.log("Payment pending:", result);
            alert("Payment is pending. Check your dashboard for updates.");
            router.refresh();
          },
          onError: (result: any) => {
            console.error("Payment error:", result);
            alert("Payment failed. Please try again.");
            setIsRetrying(false);
          },
          onClose: () => {
            console.log("Payment popup closed");
            setIsRetrying(false);
          },
        });
      } else {
        throw new Error("Payment token not available");
      }
    } catch (error: any) {
      console.error("Retry payment error:", error);
      alert(`Failed to retry payment: ${error.message}`);
    }
    // finally {
    //   setIsRetrying(false);
    // }
  };

  return (
    <Button
      size="sm"
      className="bg-green-500 text-white border-4 border-black hover:bg-green-400 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      onClick={handleRetryPayment}
      disabled={isRetrying}
    >
      {isRetrying ? "PROCESSING..." : "COMPLETE PAYMENT"}
    </Button>
  );
}
