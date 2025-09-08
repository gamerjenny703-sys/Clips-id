// components/PaymentRetryButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateContestPaymentStatus } from "@/lib/action/contest";
import { useRouter } from "next/navigation";


interface PaymentRetryButtonProps {
  contestId: number;
  contestTitle:string;
  prizePool:string
}

export default function PaymentRetryButton({
  contestId,
}: PaymentRetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  const handleRetryPayment = async () => {
    setIsRetrying(true);

    try {
      const response = await fetch("/api/payments/midtrans/retry-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contestId }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.error || "Failed to get payment get payment token");
      }

      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: async function (result: any) {
            console.log("Payment Success", result);
            try {
              await updateContestPaymentStatus(contestId);
              alert("Payment successful! Your contest is now active.");
              router.push(`/creator/contest/${contestId}/manage`);
              router.refresh(); 
            } catch (err: any) {
              console.error("Error handling successful payment:", err);
              alert(`Payment successful, but failed to update status: ${err.message}`);
              router.push(`/creator/dashboard`);
              router.refresh();
            }
          },
          onPending: function (result: any) {
            console.log("Payment Pending", result);
            alert("Waiting for your payment. You can complete it from your dashboard.");
            router.push('/creator/dashboard');
          },
          onError: function (result: any) {
            console.log("Payment Error", result);
            alert("Payment failed. Please try again.");
            router.push('/creator/dashboard');
            router.refresh();
          },
          onClose: function () {
            console.log("Payment popup closed without completing payment.");
            alert("You closed the payment window. You can retry payment from the dashboard.");
            router.push('/creator/dashboard');
            router.refresh();
          },
        });
      } else {
        throw new Error("Midtrans Snap.js is not loaded.");
      }
    } catch (error: any) {
      console.error("Retry payment error:", error);
      alert(`Failed to retry payment: ${error.message}`);
      setIsRetrying(false);
    }
  };

  return (
    <Button
      size="sm"
      className="bg-green-500 text-white border-4 border-black hover:bg-green-400 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      onClick={handleRetryPayment}
      disabled={isRetrying}
    >
      {isRetrying ? "OPENING..." : "COMPLETE PAYMENT"}
    </Button>
  );
}
