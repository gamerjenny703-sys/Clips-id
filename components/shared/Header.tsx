"use client"; // Jangan lupa tambahkan ini

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User, BarChart3, Settings, LogOut } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Dengarkan perubahan status otentikasi
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Berhenti mendengarkan saat komponen di-unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);
    // State akan otomatis terupdate oleh onAuthStateChange
  };

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
          {/* ... link navigasi lainnya tetap sama ... */}
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
          <Link
            href="/contact"
            className="font-bold uppercase text-sm hover:underline decoration-4"
          >
            CONTACT-US
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {loading ? (
            // Tampilkan UI skeleton saat loading
            <div className="h-10 w-48 bg-gray-300 animate-pulse rounded-md"></div>
          ) : user ? (
            // Tampilan jika user SUDAH login
            <div className="relative">
              <Button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="bg-cyan-400 text-black border-4 border-black hover:bg-pink-500 hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
              >
                <User className="h-5 w-5" />
                PROFILE
              </Button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50">
                  <div className="p-4 border-b-4 border-black bg-pink-500">
                    <div className="font-black uppercase text-white">
                      JOHN DOE
                    </div>
                    <div className="text-sm font-bold text-white">CREATOR</div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/user/dashboard"
                      className="flex items-center gap-3 p-3 hover:bg-yellow-400 font-bold uppercase text-sm border-2 border-transparent hover:border-black"
                    >
                      <BarChart3 className="h-4 w-4" />
                      DASHBOARD
                    </Link>
                    <Link
                      href="/user/progress"
                      className="flex items-center gap-3 p-3 hover:bg-cyan-400 font-bold uppercase text-sm border-2 border-transparent hover:border-black"
                    >
                      <Settings className="h-4 w-4" />
                      PROGRESS
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 p-3 hover:bg-pink-500 hover:text-white font-bold uppercase text-sm border-2 border-transparent hover:border-black"
                    >
                      <LogOut className="h-4 w-4" />
                      SIGN OUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Tampilan jika user BELUM login
            <>
              <Link href="/work">
                <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  GET STARTED
                </Button>
              </Link>
              <Link href="/auth/sign-in">
                <Button className="bg-pink-500 text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  SIGN IN
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
