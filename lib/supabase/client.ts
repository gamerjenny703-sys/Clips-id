import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Buat sebuah client Supabase untuk digunakan di browser.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
