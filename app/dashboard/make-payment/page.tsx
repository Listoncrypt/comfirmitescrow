import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CreditCard, User, AlertCircle } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";

export default async function MakePaymentPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get admin payment settings
    const { data: settings } = await supabase
        .from("admin_settings")
        .select("*")
        .single();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Make Payment</h1>
                <p className="text-muted-foreground">
                    Transfer funds to the escrow account using the details below
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Payment Details Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Escrow Account Details
                        </CardTitle>
                        <CardDescription>
                            Use these details to make your payment via bank transfer
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {settings ? (
                            <>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {/* Bank Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            Bank Name
                                        </label>
                                        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                                            <span className="font-semibold text-lg">{(settings as any).escrow_bank_name}</span>
                                            <CopyButton text={(settings as any).escrow_bank_name} />
                                        </div>
                                    </div>

                                    {/* Account Number */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Account Number
                                        </label>
                                        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                                            <span className="font-semibold text-lg font-mono">{(settings as any).escrow_account_number}</span>
                                            <CopyButton text={(settings as any).escrow_account_number} />
                                        </div>
                                    </div>

                                    {/* Account Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Account Name
                                        </label>
                                        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                                            <span className="font-semibold text-lg">{(settings as any).escrow_account_name}</span>
                                            <CopyButton text={(settings as any).escrow_account_name} />
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions */}
                                {(settings as any).escrow_instructions && (
                                    <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                                        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                            Payment Instructions
                                        </h3>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {(settings as any).escrow_instructions}
                                        </p>
                                    </div>
                                )}

                                {/* Important Notice */}
                                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">
                                                Important
                                            </h3>
                                            <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
                                                <li>Use your Deal ID as the payment reference</li>
                                                <li>Payments may take 1-24 hours to be confirmed</li>
                                                <li>Upload your payment proof in the deal details page</li>
                                                <li>Contact support if payment is not confirmed within 24 hours</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                                <p>Payment details not configured yet.</p>
                                <p className="text-sm">Please contact admin for payment instructions.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
