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
}

export function WithdrawalForm({ balance, disabled, defaultValues }: WithdrawalFormProps) {
    const [paymentMethod, setPaymentMethod] = useState<"bank" | "crypto">(defaultValues?.payment_method || "bank");
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
                <Label htmlFor="amount">Amount (NGN)</Label>
                <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="10"
                    max={balance || 0}
                    placeholder="0.00"
                    required
                // Amount typically isn't prefilled as it changes
                />
                <p className="text-xs text-muted-foreground">Minimum: ₦1,000.00</p>
            </div>

            {/* Payment Method Tabs */}
            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "bank" | "crypto")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bank" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Bank Account
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Crypto Wallet
                    </TabsTrigger>
                </TabsList>

                {/* Bank Account Fields */}
                <TabsContent value="bank" className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="bank_name">Bank Name</Label>
                        <Input
                            id="bank_name"
                            name="bank_name"
                            placeholder="Enter your bank name"
                            required={paymentMethod === "bank"}
                            defaultValue={defaultValues?.bank_name}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account_number">Account Number</Label>
                        <Input
                            id="account_number"
                            name="account_number"
                            placeholder="Enter your account number"
                            required={paymentMethod === "bank"}
                            defaultValue={defaultValues?.account_number}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account_name">Account Name</Label>
                        <Input
                            id="account_name"
                            name="account_name"
                            placeholder="Enter the account holder name"
                            required={paymentMethod === "bank"}
                            defaultValue={defaultValues?.account_name}
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
