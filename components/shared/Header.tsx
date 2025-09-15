import Link from "next/link";
import UserProfile from "./UserProfile"; // Impor komponen baru
import { createClient } from "@/lib/supabase/server";
import { Menu, X, Trophy, Users, Zap } from "lucide-react";

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
          className="text-2xl font-black uppercase tracking-tight hover:underline decoration-4 flex items-center gap-2 group"
        >
          <div className="bg-black text-yellow-400 p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <Zap className="w-5 h-5" />
          </div>
          CLIPS.ID
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/work"
            className="font-bold uppercase text-sm hover:underline decoration-4 flex items-center gap-2 px-3 py-2 hover:bg-black hover:text-yellow-400 transition-all border-2 border-transparent hover:border-black"
          >
            <Trophy className="w-4 h-4" />
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
