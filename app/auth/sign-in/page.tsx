import SignInForm from "@/components/features/auth/SignInForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <SignInForm />

        {/* Social Login Alternative */}
        <div className="mt-6 text-center">
          <p className="text-black font-bold mb-4">
            OR CONNECT WITH SOCIAL MEDIA
          </p>
          <Link href="/connect-accounts">
            <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              CONNECT SOCIAL ACCOUNTS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
