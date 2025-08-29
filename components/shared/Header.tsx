"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User, BarChart3, Settings, LogOut, Repeat } from "lucide-react"; // Tambahkan 'Repeat' icon

// Tipe data baru untuk menampung profil
type Profile = {
  full_name: string | null;
  is_creator: boolean; // Asumsi dari skema baru kita
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  // --- STATE BARU UNTUK PROFIL ---
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // --- TAMBAHAN: Ambil data profil jika user ada ---
      if (user) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("full_name, is_creator")
          .eq("id", user.id)
          .single();
        setProfile(userProfile);
      }
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      // Reset profil saat logout
      if (event === "SIGNED_OUT") {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);
  };

  // --- LOGIKA BARU UNTUK MENGOLAH NAMA ---
  const getFirstName = () => {
    if (loading) return "Loading...";
    // Ambil kata pertama, atau tampilkan "User" jika nama tidak ada
    return profile?.full_name?.split(" ")[0] || "User";
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
          {loading ? (
            <div className="h-10 w-48 bg-gray-300 animate-pulse rounded-md"></div>
          ) : user ? (
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
                    <div className="font-black uppercase text-white truncate">
                      {getFirstName()}
                    </div>
                    <div className="text-sm font-bold text-white">
                      {profile?.is_creator ? "Creator & Clipper" : "Clipper"}
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/user/dashboard"
                      className="flex items-center gap-3 p-3 hover:bg-yellow-400 font-bold uppercase text-sm border-2 border-transparent hover:border-black"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Clipper Dashboard
                    </Link>

                    {/* --- TOMBOL SWITCHER BARU DI SINI --- */}
                    {profile?.is_creator && (
                      <Link
                        href="/creator/dashboard"
                        className="flex items-center gap-3 p-3 hover:bg-cyan-400 font-bold uppercase text-sm border-2 border-transparent hover:border-black"
                      >
                        <Repeat className="h-4 w-4" />
                        Switch to Creator
                      </Link>
                    )}
                    {/* --- AKHIR TOMBOL SWITCHER --- */}

                    <Link
                      href="/user/settings"
                      className="flex items-center gap-3 p-3 hover:bg-cyan-400 font-bold uppercase text-sm border-2 border-transparent hover:border-black"
                    >
                      <Settings className="h-4 w-4" />
                      SETTINGS
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
            <>
              <Link href="/work">
                <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  GET STARTED
                </Button>
              </Link>
              <Link href="/sign-in">
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
