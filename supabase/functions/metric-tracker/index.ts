// supabase/functions/metric-tracker/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "supabase-functions";

console.log("Metric Tracker function booting up...");

serve(async (req) => {
  try {
    // 1. Buat koneksi ke Supabase.
    // Gunakan "service_role" untuk memberikan akses penuh di backend.
    // Pastikan Anda sudah mengatur environment variable di Supabase.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 2. Ambil semua submisi dari kontes yang masih aktif.
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select(
        `
        id,
        video_url,
        platform,
        clipper_id,
        contests (
          status
        )
      `,
      )
      .eq("contests.status", "active");

    if (error) {
      throw error;
    }

    console.log(`Found ${submissions.length} active submissions to track.`);

    // 3. (Untuk Nanti) Loop melalui setiap submisi untuk mengambil metrik
    for (const submission of submissions) {
      console.log(
        `Processing submission ID: ${submission.id}, Platform: ${submission.platform}`,
      );
      // Di sini nanti kita akan tambahkan logika untuk memanggil API YouTube, TikTok, dll.
    }

    // 4. Kirim respons sukses.
    return new Response(
      JSON.stringify({
        message: `Successfully processed ${submissions.length} submissions.`,
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    console.error("Error in Metric Tracker function:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
