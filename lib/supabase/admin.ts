// lib/supabase/admin.ts

import { createClient } from "@supabase/supabase-js";

// Klien ini MENGGUNAKAN SERVICE_ROLE_KEY dan akan mem-bypass RLS.
// HANYA GUNAKAN DI SISI SERVER PADA ENDPOINT YANG AMAN.
export const createAdminClient = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error("Missing Supabase URL or Service Role Key");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
};
