"use client";

import React, { Suspense } from "react"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { signIn } from "@/lib/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";

// Separate component for handling URL search params (requires Suspense boundary)
function ErrorFromURL({ onError }: { onError: (error: string) => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "account_deleted") {
      onError("Account not found. Your account may have been deleted. Please contact support or create a new account.");
      // Clean up the URL
      router.replace("/login");
    }
  }, [searchParams, router, onError]);

  return null;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // If successful, the server action redirects
  }

  return (
    <>
      {/* Suspense boundary for useSearchParams */}
      <Suspense fallback={null}>
        <ErrorFromURL onError={setError} />
      </Suspense>

      <div className="flex min-h-screen">
        <div className="hidden w-1/2 bg-gradient-to-br from-primary via-accent to-primary/80 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="CONFIRMEDIT Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-white">C<span className="text-emerald-500 font-black">O</span>NFIRMED<span className="text-emerald-500 font-black">IT</span></span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold text-white">
              Secure Every Deal with Confidence
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/80">
              Join thousands of users who trust CONFIRMEDIT for their escrow
              transactions.
            </p>
          </div>
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} CONFIRMEDIT. All rights reserved.
          </p>
        </div>

        <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <Image
                src="/logo.jpg"
                alt="CONFIRMEDIT Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-foreground">C<span className="text-emerald-500 font-black">O</span>NFIRMED<span className="text-emerald-500 font-black">IT</span></span>
            </div>

            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your credentials to access your account
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-12 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal text-muted-foreground"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="h-12 w-full text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {"Don't have an account?"}{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

