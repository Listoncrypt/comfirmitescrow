"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PaymentInstructionsProps {
    dealAmount: number;
    dealTitle: string;
}

export function PaymentInstructions({ dealAmount, dealTitle }: PaymentInstructionsProps) {
    const [settings, setSettings] = useState({
        escrow_bank_name: "Loading...",
        escrow_account_number: "Loading...",
        escrow_account_name: "Loading...",
        usdt_network: "TRC20",
        usdt_wallet_address: "",
    });
    const [copiedBank, setCopiedBank] = useState(false);
    const [copiedCrypto, setCopiedCrypto] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchSettings() {
            const { data } = await supabase
                .from("admin_settings")
                .select("escrow_bank_name, escrow_account_number, escrow_account_name, usdt_network, usdt_wallet_address")
                .limit(1)
                .single();

            if (data) {
                setSettings({
                    escrow_bank_name: data.escrow_bank_name || "First Bank",
                    escrow_account_number: data.escrow_account_number || "1234567890",
                    escrow_account_name: data.escrow_account_name || "CONFIRMEDIT Escrow",
                    usdt_network: data.usdt_network || "TRC20",
                    usdt_wallet_address: data.usdt_wallet_address || "",
                });
            }
        }
        fetchSettings();
    }, [supabase]);

    function copyToClipboard(text: string, isCrypto: boolean = false) {
        navigator.clipboard.writeText(text);
        if (isCrypto) {
            setCopiedCrypto(true);
            setTimeout(() => setCopiedCrypto(false), 2000);
        } else {
            setCopiedBank(true);
            setTimeout(() => setCopiedBank(false), 2000);
        }
    }

    return (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-orange-600" />
                    Payment Instructions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                    Transfer <span className="font-bold text-foreground">₦{dealAmount.toLocaleString()}</span> for &quot;{dealTitle}&quot; using one of the methods below:
                </p>

                {/* Bank Transfer Option */}
                <div className="rounded-lg border bg-background p-4 space-y-3">
                    <div className="flex items-center gap-2 font-medium border-b pb-2 mb-2">
                        <Building2 className="h-4 w-4" />
                        Bank Transfer
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Bank Name</span>
                        <span className="font-medium">{settings.escrow_bank_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Account Number</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-lg">{settings.escrow_account_number}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => copyToClipboard(settings.escrow_account_number)}
                            >
                                {copiedBank ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Account Name</span>
                        <span className="font-medium">{settings.escrow_account_name}</span>
                    </div>
                </div>

                {/* USDT Option - Only show if address is set */}
                {settings.usdt_wallet_address && (
                    <div className="rounded-lg border bg-background p-4 space-y-3">
                        <div className="flex items-center gap-2 font-medium border-b pb-2 mb-2 text-green-600">
                            <Building2 className="h-4 w-4" />
                            Crypto Transfer (USDT)
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Network</span>
                            <span className="font-medium">{settings.usdt_network}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Wallet Address</span>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-muted p-2 rounded text-xs break-all">
                                    {settings.usdt_wallet_address}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0"
                                    onClick={() => copyToClipboard(settings.usdt_wallet_address, true)}
                                >
                                    {copiedCrypto ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200">After payment:</p>
                    <p className="text-blue-700 dark:text-blue-300 mt-1">
                        Upload your payment receipt or screenshot in the chat below so the admin can verify your payment.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

