"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/user/settings`, // Arahkan ke halaman ganti password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1">
          <CardHeader className=" text-black border-b-4 border-black relative overflow-hidden">
            <CardTitle className="text-3xl font-black uppercase flex items-center gap-3 relative z-10">
              <Mail className="h-6 w-6" />
              RESET YOUR PASSWORD
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {success ? (
              <Alert className="mb-6 border-4 border-black bg-pink-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                <AlertDescription className="font-bold">
                  Check your email! We've sent a link to reset your password.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-6 border-4 border-black bg-pink-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse"
                  >
                    <AlertDescription className="font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-black font-black uppercase text-sm flex items-center gap-2"
                  >
                    EMAIL ADDRESS
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:border-cyan-400 transition-all duration-200 pl-4"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-pink-500 text-white border-4 border-black hover:bg-black hover:text-cyan-400 font-black uppercase h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg tracking-wide"
                >
                  {isLoading ? "SENDING..." : "SEND RESET LINK"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        <Link href="/sign-in" className="mt-6 flex justify-center mt-6 block">
          <Button
            variant="outline"
            className="border-4 border-black bg-white text-black hover:bg-black hover:text-white font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
