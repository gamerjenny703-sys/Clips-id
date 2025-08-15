import type React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
            <Link
              href="/contact"
              className="font-bold uppercase text-sm hover:underline decoration-4"
            >
              CONTACT-US
            </Link>
          </nav>
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </header>

      {children}

      {/* Footer */}
      <footer className="bg-black text-white border-t-4 border-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-black uppercase mb-4">
                BRUTAL.CO
              </div>
              <p className="font-bold">
                MAKING THE WEB MORE INTERESTING, ONE BRUTAL DESIGN AT A TIME.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase mb-4">SERVICES</h3>
              <ul className="space-y-2 font-bold">
                <li>
                  <Link
                    href="/services/web-design"
                    className="hover:text-yellow-400"
                  >
                    WEB DESIGN
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/development"
                    className="hover:text-yellow-400"
                  >
                    DEVELOPMENT
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/branding"
                    className="hover:text-yellow-400"
                  >
                    BRANDING
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/consulting"
                    className="hover:text-yellow-400"
                  >
                    CONSULTING
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase mb-4">CONTACT</h3>
              <div className="space-y-2 font-bold">
                <div>HELLO@BRUTAL.CO</div>
                <div>+1 (555) BRUTAL-1</div>
                <div>NEW YORK, NY</div>
              </div>
            </div>
          </div>
          <div className="border-t-4 border-white mt-12 pt-8 text-center font-bold uppercase">
            © 2024 BRUTAL.CO - ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  );
}
