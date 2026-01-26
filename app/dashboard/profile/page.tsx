"use client";

import React, { useState, useEffect } from "react";
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
import { Loader2, CheckCircle2, Building2, AlertCircle, Mail, User } from "lucide-react";
import { updateProfile, changeEmail } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function AccountInfoPage() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function loadProfile() {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                setProfile(data);
            }
        }
        loadProfile();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setSuccess(false);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
        setIsLoading(false);
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Account Information</h1>
                <p className="text-muted-foreground">
                    View and manage your personal details
                </p>
            </div>

            <div className="grid gap-6 max-w-2xl">
                {/* Profile Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Details
                        </CardTitle>
                        <CardDescription>
                            Your personal information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Profile updated successfully
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    defaultValue={profile.full_name || ""}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Name cannot be changed
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <div className="flex flex-col gap-2 p-3 bg-muted rounded-md border">
                                    <div className="text-sm font-medium">{profile.email}</div>
                                    <p className="text-xs text-muted-foreground">To change this, use the Update Email section below.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telegramHandle">Telegram Handle (Optional)</Label>
                                <Input
                                    id="telegramHandle"
                                    name="telegramHandle"
                                    placeholder="@username"
                                    defaultValue={profile.telegram_handle || ""}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Used for additional communication
                                </p>
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Account Info Card (Bank Details) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Linked Bank Account
                        </CardTitle>
                        <CardDescription>
                            These details are bound to your account for withdrawals
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Bank Name</Label>
                                <div className="font-medium">{profile.bank_name || "Not set"}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Account Number</Label>
                                <div className="font-medium font-mono">{profile.account_number || "Not set"}</div>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <Label className="text-xs text-muted-foreground">Account Name</Label>
                                <div className="font-medium">{profile.account_name || "Not set"}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>To change these details, please contact support.</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Update Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Update Email
                        </CardTitle>
                        <CardDescription>Change your associated email address</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmailChangeForm currentEmail={profile.email} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function EmailChangeForm({ currentEmail }: { currentEmail: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await changeEmail(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setMessage(result.message || "Confirmation email sent.");
            e.currentTarget.reset();
        }
        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}
            {message && (
                <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {message}
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input
                    id="newEmail"
                    name="email"
                    type="email"
                    placeholder="new@example.com"
                    required
                    disabled={isLoading}
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        sending...
                    </>
                ) : (
                    "Update Email"
                )}
            </Button>
        </form>
    )
}
