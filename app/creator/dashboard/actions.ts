// app/creator/dashboard/actions.ts

"use server";

import { createClient } from "@/lib/supabase/server";

// Tipe data sederhana untuk respons
interface RetryPaymentResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export async function retryPaymentAction(
  contestId: number,
): Promise<RetryPaymentResponse> {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Panggil API route internal Anda untuk mendapatkan token
    // (Di masa depan, logika ini bisa dipindahkan sepenuhnya ke sini)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/midtrans/retry-payment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contestId }),
        // Penting: Teruskan cookie agar API tahu siapa yang me-request
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get payment token from API");
    }

    return { success: true, token: data.token };
  } catch (error: any) {
    console.error("Server Action Error (retryPaymentAction):", error);
    return { success: false, error: error.message };
  }
}
