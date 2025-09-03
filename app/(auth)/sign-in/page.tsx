import SignInForm from "@/components/features/auth/SignInForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react"; // <-- TAMBAHKAN INI

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase text-black mb-2">
            SIGN IN
          </h1>
          <p className="text-black font-bold">WELCOME BACK TO THE PLATFORM</p>
        </div>

        {/* BUNGKUS SignInForm DENGAN SUSPENSE */}
        <Suspense fallback={<div>Loading...</div>}>
          <SignInForm />
        </Suspense>

        {/* Social Login Alternative */}
        <div className="mt-6 text-center">
          <p className="text-black font-bold mb-4">
            OR CONNECT WITH SOCIAL MEDIA
          </p>
        </div>
      </div>
    </div>
  );
}
