// components/shared/Header.tsx
"use client"; // <-- Tambahkan direktif ini di baris paling atas

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Trophy, Users, Zap } from "lucide-react";
import UserProfile from "./UserProfile";
import type { User } from "@supabase/supabase-js"; // Import tipe data User

export default function Header({ initialUser }: { initialUser: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white shadow-lg transition-all duration-300 ${
        isScrolled
          ? "h-16 border-b-2 border-black"
          : "h-20 border-b-4 border-black"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-6 h-full flex items-center transition-all duration-300 ${
          isScrolled ? "py-1" : "py-4"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <Link
            href="/"
            className={`font-black uppercase tracking-tight flex items-center gap-3 group transition-all duration-300 ${
              isScrolled ? "text-lg" : "text-2xl"
            }`}
          >
            <div
              className={`bg-yellow-400 text-black border-black group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-300 ${
                isScrolled
                  ? "p-1 border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  : "p-2 border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <Zap
                className={`transition-all duration-300 ${isScrolled ? "w-4 h-4" : "w-6 h-6"}`}
              />
            </div>
            <span className="group-hover:text-pink-500 transition-colors">
              CLIPS.ID
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/work"
              className={`font-bold uppercase flex items-center gap-2 px-4 hover:bg-yellow-400 hover:text-black transition-all border-transparent hover:border-black ${
                isScrolled
                  ? "text-xs py-1.5 border hover:border"
                  : "text-sm py-2 border-2 hover:border-2"
              }`}
            >
              <Trophy className={`${isScrolled ? "w-3 h-3" : "w-4 h-4"}`} />
              CONTESTS
            </Link>
            <Link
              href="/creator/dashboard"
              className={`font-bold uppercase flex items-center gap-2 px-4 hover:bg-pink-400 hover:text-black transition-all border-transparent hover:border-black ${
                isScrolled
                  ? "text-xs py-1.5 border hover:border"
                  : "text-sm py-2 border-2 hover:border-2"
              }`}
            >
              <Users className={`${isScrolled ? "w-3 h-3" : "w-4 h-4"}`} />
              CREATORS
            </Link>
            <Link
              href="/about"
              className={`font-bold uppercase px-4 hover:bg-cyan-400 hover:text-black transition-all border-transparent hover:border-black ${
                isScrolled
                  ? "text-xs py-1.5 border hover:border"
                  : "text-sm py-2 border-2 hover:border-2"
              }`}
            >
              ABOUT
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <UserProfile initialUser={initialUser} />
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden bg-black text-white border-black hover:bg-gray-800 transition-all ${
                isScrolled ? "p-1.5 border" : "p-2 border-2"
              }`}
            >
              {isMenuOpen ? (
                <X className={`${isScrolled ? "w-4 h-4" : "w-5 h-5"}`} />
              ) : (
                <Menu className={`${isScrolled ? "w-4 h-4" : "w-5 h-5"}`} />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-4 border-black shadow-lg">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <nav className="flex flex-col gap-2">
                <Link
                  href="/work"
                  className="font-bold uppercase text-sm flex items-center gap-3 px-4 py-3 hover:bg-yellow-400 transition-all border-transparent hover:border-black text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Trophy className="w-4 h-4" />
                  CONTESTS
                </Link>
                <Link
                  href="/creator/dashboard"
                  className="font-bold uppercase text-sm flex items-center gap-3 px-4 py-3 hover:bg-pink-400 transition-all border-transparent hover:border-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="w-4 h-4" />
                  CREATORS
                </Link>
                <Link
                  href="/about"
                  className="font-bold uppercase text-sm px-4 py-3 hover:bg-cyan-400 transition-all border-transparent hover:border-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ABOUT
                </Link>
                <div className="mt-2">
                  <UserProfile initialUser={initialUser} />
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
