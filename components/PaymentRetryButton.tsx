// components/PaymentRetryButton.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { retryPaymentAction } from "@/app/creator/dashboard/actions";

// Pastikan window.snap dideklarasikan agar TypeScript tidak error
declare global {
  interface Window {
    snap: any;
  }
}

interface PaymentRetryButtonProps {
  contestId: number;
}

export default function PaymentRetryButton({
  contestId,
}: PaymentRetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const router = useRouter();

  const handleRetryPayment = async () => {
    setIsRetrying(true);

    // Panggil Server Action
    const result = await retryPaymentAction(contestId);

    if (!result.success || !result.token) {
      alert(
        `Failed to retry payment: ${result.error || "Token not available"}`,
      );
      setIsRetrying(false);
      return;
    }

    // Jika berhasil dapat token, buka Snap
    if (window.snap) {
      window.snap.pay(result.token, {
        onSuccess: (res: any) => {
          console.log("Payment successful!", res);
          alert("Payment successful!");
          router.refresh();
        },
        onPending: (res: any) => {
          console.log("Payment pending:", res);
          alert("Payment is pending. We will update the status.");
          router.refresh();
        },
        onError: (res: any) => {
          console.error("Payment error:", res);
          alert("Payment failed.");
          setIsRetrying(false);
        },
        onClose: () => {
          console.log("Payment popup closed by user.");
          setIsRetrying(false);
        },
      });
    } else {
      alert("Midtrans Snap.js is not loaded yet.");
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
      {isRetrying ? "PROCESSING..." : "COMPLETE PAYMENT"}
    </Button>
  );
}
