// components/features/auth/SignInForm.tsx

"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Redirect ke halaman yang dituju setelah login, atau ke dashboard
      const returnUrl = searchParams.get("returnUrl") || "/user/dashboard";
      router.push(returnUrl);
      router.refresh(); // Penting untuk me-refresh state di server
    }
  };

  return (
    <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="bg-cyan-400 text-black border-b-4 border-black">
        <CardTitle className="text-2xl font-black uppercase flex items-center gap-2">
          <LogIn className="h-6 w-6" />
          ACCESS YOUR ACCOUNT
        </CardTitle>
        <CardDescription className="text-black font-bold">
          Enter your credentials to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <Alert
            variant="destructive"
            className="mb-6 border-4 border-black bg-pink-500 text-white"
          >
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
              onChange={handleInputChange}
              className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-black font-black uppercase text-sm"
              >
                PASSWORD
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-pink-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
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

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 text-white border-4 border-black hover:bg-black font-black uppercase h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {isLoading ? "SIGNING IN..." : "SIGN IN"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-black font-bold">
            DON'T HAVE AN ACCOUNT?{" "}
            <Link
              href="/sign-up"
              className="text-pink-500 hover:text-cyan-400 underline font-black uppercase"
            >
              SIGN UP HERE
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
