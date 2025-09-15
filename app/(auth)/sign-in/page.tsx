import SignInForm from "@/components/features/auth/SignInForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react"; // <-- TAMBAHKAN INI
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10 ">
        {/* BUNGKUS SignInForm DENGAN SUSPENSE */}
        <Suspense fallback={<div>Loading...</div>}>
          <SignInForm />
        </Suspense>
        <Link href="/" className="mt-6 flex justify-center mt-6 block">
          <Button
            variant="outline"
            className="border-4 border-black bg-white text-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
