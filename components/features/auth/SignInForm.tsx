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
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
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
      router.refresh();
    }
  };

  return (
    <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1">
      <CardHeader className=" text-black border-b-4 border-black relative overflow-hidden">
        <CardTitle className="text-3xl font-black uppercase flex items-center gap-3 relative z-10">
          SIGN-IN
        </CardTitle>
        <CardDescription className="text-black font-bold relative z-10">
          Enter your credentials to continue your journey
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label
              htmlFor="email"
              className="text-black font-black uppercase text-sm flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              EMAIL ADDRESS
            </Label>
            <div className="relative group">
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:border-cyan-400 transition-all duration-200 pl-4"
                required
              />
              <div className="absolute inset-0 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none rounded-sm"></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-black font-black uppercase text-sm flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                PASSWORD
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-pink-500 hover:text-pink-600 hover:underline transition-colors duration-200 uppercase tracking-wide"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-14 pr-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:border-cyan-400 transition-all duration-200 pl-4"
                required
              />
              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none rounded-sm"></div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 border-2 border-black hover:border-pink-500 transition-colors duration-200"
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 text-white border-4 border-black hover:bg-black hover:text-cyan-400 font-black uppercase h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg tracking-wide"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                SIGNING IN...
              </div>
            ) : (
              "SIGN IN"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-black border-dashed"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-black font-bold uppercase text-sm">
                New Here?
              </span>
            </div>
          </div>
          <p className="text-black font-bold mt-4 text-lg">
            DON'T HAVE AN ACCOUNT?{" "}
            <Link
              href="/sign-up"
              className="text-pink-500 hover:text-cyan-400 underline font-black uppercase transition-colors duration-200 hover:bg-black hover:text-white px-2 py-1 rounded"
            >
              SIGN UP HERE
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
