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
        <div className="text-center mb-8">
          <Link href="/sign-in">
            <Button variant="ghost" className="mb-4 font-bold uppercase">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
            </Button>
          </Link>
          <h1 className="text-4xl font-black uppercase text-black mb-2">
            Forgot Password
          </h1>
          <p className="text-black font-bold">
            WE'LL SEND A PASSWORD RESET LINK TO YOUR EMAIL
          </p>
        </div>

        <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="bg-cyan-400 text-black border-b-4 border-black">
            <CardTitle className="text-2xl font-black uppercase flex items-center gap-2">
              <Mail className="h-6 w-6" />
              RESET YOUR PASSWORD
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {success ? (
              <Alert className="border-4 border-black bg-yellow-400 text-black">
                <AlertDescription className="font-bold">
                  Check your email! We've sent a link to reset your password.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert
                    variant="destructive"
                    className="border-4 border-black"
                  >
                    <AlertDescription className="font-bold">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-black font-black uppercase text-sm"
                  >
                    EMAIL ADDRESS
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-pink-500 text-white border-4 border-black hover:bg-black font-black uppercase h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {isLoading ? "SENDING..." : "SEND RESET LINK"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
