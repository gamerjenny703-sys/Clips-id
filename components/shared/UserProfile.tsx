// components/shared/UserProfile.tsx
"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  User as UserIcon,
  BarChart3,
  Settings,
  LogOut,
  Repeat,
} from "lucide-react";

type Profile = {
  full_name: string | null;
  is_creator: boolean;
};

// ✅ Supabase dibuat sekali, bukan di dalam komponen
const supabase = createClient();

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchProfile = async (currentUser: User) => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, is_creator")
        .eq("id", currentUser.id)
        .single();
      setProfile(data);
    };

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);
  };

  const getFirstName = () => {
    if (!profile) return "User";
    return profile.full_name?.split(" ")[0] || "User";
  };

  if (user === null && profile === null) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-24 h-10 bg-gray-300 animate-pulse rounded-md" />
        <div className="w-24 h-10 bg-gray-300 animate-pulse rounded-md" />
      </div>
    );
  }

  return user ? (
    <div className="relative">
      <Button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="bg-cyan-400 text-black border-4 border-black hover:bg-pink-500 hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
      >
        <UserIcon className="h-5 w-5" />
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
            {profile?.is_creator && (
              <Link
                href="/creator/dashboard"
                className="flex items-center gap-3 p-3 hover:bg-cyan-400 font-bold uppercase text-sm border-2 border-transparent hover:border-black"
              >
                <Repeat className="h-4 w-4" />
                Switch to Creator
              </Link>
            )}
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
    <div className="flex items-center gap-4">
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
    </div>
  );
}
