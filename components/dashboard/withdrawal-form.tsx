"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requestWithdrawal } from "@/lib/actions/withdrawals";
import { Wallet, Building2 } from "lucide-react";

// Update interface
interface WithdrawalFormProps {
    balance: number;
    disabled: boolean;
    defaultValues?: {
        bank_name?: string;
        account_number?: string;
        account_name?: string;
        crypto_type?: string;
        wallet_address?: string;
        payment_method?: "bank" | "crypto";
    };
    linkedBankDetails?: {
        bank_name: string;
        account_number: string;
        account_name: string;
    };
}

export function WithdrawalForm({ balance, disabled, defaultValues, linkedBankDetails }: WithdrawalFormProps) {
    const [paymentMethod, setPaymentMethod] = useState<"bank" | "crypto">(
        // Use linked details if present, otherwise default to previous or bank
        linkedBankDetails ? "bank" : (defaultValues?.payment_method || "bank")
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        formData.append("payment_method", paymentMethod);
        await requestWithdrawal(formData);
        setIsSubmitting(false);
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="amountDisplay">Amount (NGN)</Label>
                <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">₦</span>
                    <Input
                        id="amountDisplay"
                        name="amountDisplay"
                        type="text"
                        placeholder="0.00"
                        className="pl-7"
                        required
                        onChange={(e) => {
                            // Remove non-numeric characters except decimal
                            const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                            // Split integer and decimal parts
                            const parts = rawValue.split('.');
                            // Format integer part with commas
                            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            // Reassemble
                            e.target.value = parts.slice(0, 2).join('.');

                            // Update hidden input
                            const hiddenInput = document.getElementById('amount') as HTMLInputElement;
                            if (hiddenInput) {
                                hiddenInput.value = rawValue;
                            }
                        }}
                    />
                    <input type="hidden" id="amount" name="amount" />
                </div>
                <p className="text-xs text-muted-foreground">Minimum: ₦1,000.00</p>
            </div>

            {/* Payment Method Tabs */}
            <Tabs value={paymentMethod} onValueChange={(v) => {
                // If linked bank details are set, prevent detailed switching to crypto if we want to enforce bank?
                // User requirement: "must prompt to withdraw to THAT account". 
                // Implicitly blocking other methods?
                // Let's assume yes for safety, but allow switching back to Bank if they clicked Crypto.
                // Actually, if linkedBankDetails exists, we might want to DISABLED the crypto trigger?
                // Let's prevent switching if saving is strict. 
                // "prevent sending to another account if they get hacked" -> implies ONLY allow the verified one.
                if (linkedBankDetails && v === 'crypto') return; // Strict enforcement
                setPaymentMethod(v as "bank" | "crypto")
            }} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bank" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Bank Account
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="flex items-center gap-2" disabled={!!linkedBankDetails} title={linkedBankDetails ? "Bank withdrawal required" : ""}>
                        <Wallet className="h-4 w-4" />
                        Crypto Wallet
                    </TabsTrigger>
                </TabsList>

                {/* Bank Account Fields */}
                <TabsContent value="bank" className="space-y-4 mt-4">
                    {linkedBankDetails && (
                        <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-md border border-emerald-100 mb-4 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>Withdrawal locked to your verified linked account.</span>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="bank_name">Bank Name</Label>
                        <Input
                            id="bank_name"
                            name="bank_name"
                            placeholder="Enter your bank name"
                            required={paymentMethod === "bank"}
                            defaultValue={linkedBankDetails?.bank_name || defaultValues?.bank_name}
                            readOnly={!!linkedBankDetails}
                            className={linkedBankDetails ? "bg-muted text-muted-foreground" : ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account_number">Account Number</Label>
                        <Input
                            id="account_number"
                            name="account_number"
                            placeholder="Enter your account number"
                            required={paymentMethod === "bank"}
                            defaultValue={linkedBankDetails?.account_number || defaultValues?.account_number}
                            readOnly={!!linkedBankDetails}
                            className={linkedBankDetails ? "bg-muted text-muted-foreground" : ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account_name">Account Name</Label>
                        <Input
                            id="account_name"
                            name="account_name"
                            placeholder="Enter the account holder name"
                            required={paymentMethod === "bank"}
                            defaultValue={linkedBankDetails?.account_name || defaultValues?.account_name}
                            readOnly={!!linkedBankDetails}
                            className={linkedBankDetails ? "bg-muted text-muted-foreground" : ""}
                        />
                    </div>
                </TabsContent>

                {/* Crypto Wallet Fields */}
                <TabsContent value="crypto" className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="crypto_type">Cryptocurrency</Label>
                        <Select name="crypto_type" defaultValue={defaultValues?.crypto_type || "USDT"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select crypto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USDT">USDT (TRC-20)</SelectItem>
                                <SelectItem value="USDT_ERC20">USDT (ERC-20)</SelectItem>
                                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="wallet_address">Wallet Address</Label>
                        <Input
                            id="wallet_address"
                            name="wallet_address"
                            placeholder="Enter your wallet address"
                            required={paymentMethod === "crypto"}
                            defaultValue={defaultValues?.wallet_address}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            <Button
                type="submit"
                className="w-full"
                disabled={disabled || isSubmitting}
            >
                {isSubmitting ? "Processing..." : "Request Withdrawal"}
            </Button>
            {disabled && (
                <p className="text-xs text-center text-muted-foreground">
                    Insufficient balance to withdraw. Minimum: ₦1,000.00
                </p>
            )}
        </form>
    );
}

