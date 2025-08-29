"use client";

import type React from "react";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi frontend tetap sama
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
          <CardHeader className="bg-cyan-400 text-black border-b-4 border-black">
            <CardTitle className="text-2xl font-black uppercase text-center">
              CHECK YOUR EMAIL!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-black font-bold mb-4">
              WE'VE SENT A CONFIRMATION LINK TO YOUR EMAIL ADDRESS.
            </p>
            <p className="text-black font-bold">
              PLEASE CLICK THE LINK TO ACTIVATE YOUR ACCOUNT.
            </p>
            <Link href="/">
              <Button className="w-full bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                BACK TO HOME
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black uppercase text-black mb-2">
          SIGN UP
        </h1>
        <p className="text-black font-bold">CREATE YOUR ACCOUNT TODAY</p>
      </div>
      <Card className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="bg-yellow-400 text-black border-b-4 border-black">
          <CardTitle className="text-2xl font-black uppercase flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            CREATE NEW ACCOUNT
          </CardTitle>
          <CardDescription className="text-black font-bold">
            Join the platform and start participating in contests
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert className="mb-6 border-4 border-black bg-pink-500 text-white">
              <AlertDescription className="font-bold">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-black font-black uppercase text-sm"
              >
                FULL NAME
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                required
              />
            </div>

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
                  placeholder="Create a strong password"
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-black font-black uppercase text-sm"
              >
                CONFIRM PASSWORD
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="border-4 border-black bg-white text-black placeholder:text-gray-500 font-bold h-12 pr-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    agreeToTerms: checked as boolean,
                  })
                }
                className="border-2 border-black data-[state=checked]:bg-pink-500 data-[state=checked]:border-black"
              />
              <Label
                htmlFor="terms"
                className="text-black font-bold text-sm leading-relaxed"
              >
                I AGREE TO THE{" "}
                <Link
                  href="/terms"
                  className="text-pink-500 hover:text-cyan-400 underline font-black"
                >
                  TERMS & CONDITIONS
                </Link>{" "}
                AND{" "}
                <Link
                  href="/privacy"
                  className="text-pink-500 hover:text-cyan-400 underline font-black"
                >
                  PRIVACY POLICY
                </Link>
              </Label>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 text-white border-4 border-black hover:bg-cyan-400 hover:text-black font-black uppercase h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {isLoading ? (
                "CREATING ACCOUNT..."
              ) : (
                <>
                  CREATE ACCOUNT
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-black font-bold">
              ALREADY HAVE AN ACCOUNT?{" "}
              <Link
                href="/sign-in"
                className="text-pink-500 hover:text-cyan-400 underline font-black uppercase"
              >
                SIGN IN HERE
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
