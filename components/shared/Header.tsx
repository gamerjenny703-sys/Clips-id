import Link from "next/link";
import UserProfile from "./UserProfile"; // Impor komponen baru
import { createClient } from "@/lib/supabase/server";

// Hapus 'use client' dan semua hooks (useState, useEffect)
export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b-4 border-black bg-yellow-400 p-4 sticky top-0 z-50">
      <div className="text-black mx-auto max-w-6xl flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-black uppercase tracking-tight hover:underline decoration-4"
        >
          CLIPS.ID
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/work"
            className="font-bold uppercase text-sm hover:underline decoration-4"
          >
            CONTEST
          </Link>
          <Link
            href="/about"
            className="font-bold uppercase text-sm hover:underline decoration-4"
          >
            ABOUT
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <UserProfile initialUser={user} />
        </div>
      </div>
    </header>
  );
}
