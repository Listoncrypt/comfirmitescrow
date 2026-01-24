"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            setSuccess(true);
            setIsLoading(false);
            // Redirect to login after 3 seconds
            setTimeout(() => router.push("/login"), 3000);
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen">
                <div className="hidden w-1/2 bg-gradient-to-br from-primary via-accent to-primary/80 lg:flex lg:flex-col lg:justify-between lg:p-12">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo.jpg"
                            alt="Confirmit Logo"
                            width={48}
                            height={48}
                            className="rounded-lg"
                        />
                        <span className="text-2xl font-bold text-white">Confirmit</span>
                    </Link>
                    <div>
                        <h2 className="text-4xl font-bold text-white">
                            Password Updated!
                        </h2>
                        <p className="mt-4 max-w-md text-lg text-white/80">
                            Your password has been successfully reset. You can now sign in with your new password.
                        </p>
                    </div>
                    <p className="text-sm text-white/60">
                        &copy; {new Date().getFullYear()} Confirmit. All rights reserved.
                    </p>
                </div>

                <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
                    <div className="mx-auto w-full max-w-md text-center">
                        <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                            <Image
                                src="/logo.jpg"
                                alt="Confirmit Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-bold text-foreground">Confirmit</span>
                        </div>

                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-green-100 p-4">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-foreground">Password Reset Successful</h1>
                        <p className="mt-4 text-muted-foreground">
                            Your password has been updated. Redirecting you to login...
                        </p>

                        <div className="mt-8">
                            <Link href="/login">
                                <Button className="w-full h-12">
                                    Go to Login Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <div className="hidden w-1/2 bg-gradient-to-br from-primary via-accent to-primary/80 lg:flex lg:flex-col lg:justify-between lg:p-12">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo.jpg"
                        alt="Confirmit Logo"
                        width={48}
                        height={48}
                        className="rounded-lg"
                    />
                    <span className="text-2xl font-bold text-white">Confirmit</span>
                </Link>
                <div>
                    <h2 className="text-4xl font-bold text-white">
                        Create New Password
                    </h2>
                    <p className="mt-4 max-w-md text-lg text-white/80">
                        Choose a strong password to keep your account secure.
                    </p>
                </div>
                <p className="text-sm text-white/60">
                    &copy; {new Date().getFullYear()} Confirmit. All rights reserved.
                </p>
            </div>

            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
                <Link
                    href="/login"
                    className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                </Link>

                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <Image
                            src="/logo.jpg"
                            alt="Confirmit Logo"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                        <span className="text-xl font-bold text-foreground">Confirmit</span>
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Lock className="h-8 w-8 text-primary" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-foreground text-center">Set New Password</h1>
                    <p className="mt-2 text-muted-foreground text-center">
                        Enter your new password below.
                    </p>

                    {error && (
                        <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="h-12 pr-12"
                                    required
                                    disabled={isLoading}
                                    minLength={8}
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
                            <p className="text-xs text-muted-foreground">
                                Must be at least 8 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className="h-12 pr-12"
                                    required
                                    disabled={isLoading}
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="h-12 w-full text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
