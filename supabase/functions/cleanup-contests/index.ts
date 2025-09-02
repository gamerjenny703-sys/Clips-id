// supabase/functions/cleanup-contests/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Cleanup function initialized");

serve(async (req) => {
  try {
    // Buat Supabase client dengan service role key untuk bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    console.log("Running cleanup for pending contests...");

    // Tentukan batas waktu (misalnya, 24 jam yang lalu)
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ).toISOString();

    // Query untuk mengubah status kontes yang kedaluwarsa
    const { data, error } = await supabaseAdmin
      .from("contests")
      .update({ status: "expired" })
      .lt("created_at", twentyFourHoursAgo)
      .eq("status", "pending_payment")
      .select();

    if (error) {
      throw error;
    }

    const message = `Cleanup successful. Expired ${data.length} pending contests.`;
    console.log(message);

    return new Response(JSON.stringify({ message }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    const errorMessage = `Error in cleanup function: ${err.message}`;
    console.error(errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
