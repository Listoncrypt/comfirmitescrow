"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
import { useState } from "react";
import { resetPassword } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await resetPassword(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            setSuccess(true);
            setIsLoading(false);
        }
    }

    if (success) {
        return (
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
                        <span className="text-2xl font-bold text-white">C<span className="text-emerald-500">●</span>NFIRMED<span className="text-emerald-500 font-black">IT</span></span>
                    </Link>
                    <div>
                        <h2 className="text-4xl font-bold text-white">
                            Check Your Email
                        </h2>
                        <p className="mt-4 max-w-md text-lg text-white/80">
                            We've sent you a password reset link. Follow the instructions to recover your account.
                        </p>
                    </div>
                    <p className="text-sm text-white/60">
                        &copy; {new Date().getFullYear()} CONFIRMEDIT. All rights reserved.
                    </p>
                </div>

                <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
                    <div className="mx-auto w-full max-w-md text-center">
                        <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                            <Image
                                src="/logo.jpg"
                                alt="CONFIRMEDIT Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-bold text-foreground">C<span className="text-emerald-500">●</span>NFIRMED<span className="text-emerald-500 font-black">IT</span></span>
                        </div>

                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-green-100 p-4">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-foreground">Check Your Email</h1>
                        <p className="mt-4 text-muted-foreground">
                            We've sent a password reset link to:
                        </p>
                        <p className="mt-2 font-medium text-foreground">{email}</p>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Click the link in the email to reset your password. If you don't see it, check your spam folder.
                        </p>

                        <div className="mt-8 space-y-4">
                            <Link href="/login">
                                <Button className="w-full h-12">
                                    Back to Login
                                </Button>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email?{" "}
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="font-medium text-primary hover:underline"
                                >
                                    Try again
                                </button>
                            </p>
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
                        alt="CONFIRMEDIT Logo"
                        width={48}
                        height={48}
                        className="rounded-lg"
                    />
                    <span className="text-2xl font-bold text-white">C<span className="text-emerald-500">●</span>NFIRMED<span className="text-emerald-500 font-black">IT</span></span>
                </Link>
                <div>
                    <h2 className="text-4xl font-bold text-white">
                        Forgot Your Password?
                    </h2>
                    <p className="mt-4 max-w-md text-lg text-white/80">
                        No worries! Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>
                <p className="text-sm text-white/60">
                    &copy; {new Date().getFullYear()} CONFIRMEDIT. All rights reserved.
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
                            alt="CONFIRMEDIT Logo"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                        <span className="text-xl font-bold text-foreground">C<span className="text-emerald-500">●</span>NFIRMED<span className="text-emerald-500 font-black">IT</span></span>
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-foreground text-center">Reset Password</h1>
                    <p className="mt-2 text-muted-foreground text-center">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {error && (
                        <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="h-12"
                                required
                                disabled={isLoading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="h-12 w-full text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
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
    );
}

