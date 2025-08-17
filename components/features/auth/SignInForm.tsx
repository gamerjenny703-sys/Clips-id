"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation"; // <-- Import useRouter
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowRight, User } from "lucide-react";
import Link from "next/link";

export default function SignInForm() {
  const router = useRouter(); // <-- Gunakan hook-nya
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message); // Tampilkan pesan error dari Supabase
      setIsLoading(false);
    } else {
      // Redirect ke dashboard setelah berhasil login.
      // onAuthStateChange di Header akan mengurus update UI.
      router.push("/user/dashboard");
      router.refresh(); // Opsional: untuk memastikan data server-side baru di-fetch
    }
  };

  return (
    <>
      <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="bg-pink-500 text-white border-b-4 border-black">
          <CardTitle className="text-2xl font-black uppercase flex items-center gap-2">
            <User className="h-6 w-6" />
            LOGIN TO YOUR ACCOUNT
          </CardTitle>
          <CardDescription className="text-white font-bold">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert className="mb-6 border-4 border-black bg-yellow-400 text-black">
              <AlertDescription className="font-bold">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-black font-black uppercase text-sm"
              >
                PASSWORD
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-12 pr-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-black font-bold hover:text-pink-500 underline uppercase text-sm"
              >
                FORGOT PASSWORD?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-400 text-black border-4 border-black hover:bg-yellow-400 font-black uppercase h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {isLoading ? (
                "SIGNING IN..."
              ) : (
                <>
                  SIGN IN
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-black font-bold">
              DON'T HAVE AN ACCOUNT?{" "}
              <Link
                href="/auth/sign-up"
                className="text-pink-500 hover:text-cyan-400 underline font-black uppercase"
              >
                SIGN UP HERE
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
