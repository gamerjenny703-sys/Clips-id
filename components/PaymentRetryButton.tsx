// components/PaymentRetryButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PaymentRetryButtonProps {
  contestId: string;
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

      if (!response.ok || !data.payment_details?.redirect_url) {
        throw new Error(data.error || "Failed to get payment redirection URL.");
      }

      // Alihkan ke halaman pembayaran Midtrans
      window.location.href = data.payment_details.redirect_url;
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
      {isRetrying ? "REDIRECTING..." : "COMPLETE PAYMENT"}
    </Button>
  );
}
