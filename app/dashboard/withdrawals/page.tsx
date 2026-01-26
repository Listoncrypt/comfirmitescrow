import React from "react"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cancelWithdrawal } from "@/lib/actions/withdrawals";
import { WithdrawalForm } from "@/components/dashboard/withdrawal-form";
import { Wallet, Clock, CheckCircle, XCircle, AlertCircle, Building2 } from "lucide-react";

export default async function WithdrawalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const pendingWithdrawal = withdrawals?.find((w) => w.status === "pending");

  // Find last successful withdrawal to prefill form
  const lastWithdrawal = withdrawals?.find((w) => w.bank_name || w.wallet_address);
  const defaultValues = lastWithdrawal ? {
    bank_name: (lastWithdrawal as any).bank_name,
    account_number: (lastWithdrawal as any).account_number,
    account_name: (lastWithdrawal as any).account_name,
    crypto_type: (lastWithdrawal as any).crypto_type,
    wallet_address: (lastWithdrawal as any).wallet_address,
    payment_method: ((lastWithdrawal as any).wallet_address ? "crypto" : "bank") as "bank" | "crypto",
  } : undefined;

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    pending: { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: <Clock className="h-4 w-4" /> },
    completed: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: <CheckCircle className="h-4 w-4" /> },
    rejected: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: <XCircle className="h-4 w-4" /> },
    cancelled: { color: "bg-muted text-muted-foreground border-border", icon: <AlertCircle className="h-4 w-4" /> },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
        <p className="text-muted-foreground">Request withdrawals from your available balance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Available Balance
            </CardTitle>
            <CardDescription>Funds available for withdrawal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              ₦{profile?.balance?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              NGN Balance
            </p>
          </CardContent>
        </Card>

        {/* Request Withdrawal Card */}
        <Card>
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>
              {pendingWithdrawal
                ? "You have a pending withdrawal request"
                : "Choose your preferred withdrawal method"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingWithdrawal ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-500 font-medium mb-2">
                    <Clock className="h-4 w-4" />
                    Pending Withdrawal
                  </div>
                  <div className="text-2xl font-bold">₦{(pendingWithdrawal as any).amount?.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1 truncate">
                    {(pendingWithdrawal as any).bank_name
                      ? `Bank: ${(pendingWithdrawal as any).bank_name} - ${(pendingWithdrawal as any).account_number}`
                      : `Wallet: ${(pendingWithdrawal as any).wallet_address}`}
                  </div>
                </div>
                <form action={async () => {
                  "use server";
                  // Revalidation is handled in the action
                  await cancelWithdrawal((pendingWithdrawal as any).id);
                }}>
                  <Button variant="outline" className="w-full bg-transparent" type="submit">
                    Cancel Withdrawal
                  </Button>
                </form>
              </div>
            ) : (
              <WithdrawalForm
                balance={profile?.balance || 0}
                disabled={!profile?.balance || profile.balance < 10}
                defaultValues={defaultValues}
                linkedBankDetails={profile?.bank_name ? {
                  bank_name: profile.bank_name,
                  account_number: profile.account_number,
                  account_name: profile.account_name
                } : undefined}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Your past withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawals && withdrawals.length > 0 ? (
            <div className="space-y-4">
              {withdrawals.map((withdrawal: any) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₦{withdrawal.amount?.toFixed(2)}</span>
                      <Badge variant="outline" className={statusConfig[withdrawal.status]?.color}>
                        <span className="flex items-center gap-1">
                          {statusConfig[withdrawal.status]?.icon}
                          {withdrawal.status?.charAt(0).toUpperCase() + withdrawal.status?.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {withdrawal.bank_name
                        ? `${withdrawal.bank_name} - ****${withdrawal.account_number?.slice(-4)}`
                        : withdrawal.wallet_address
                          ? `${withdrawal.crypto_type || 'Crypto'} • ${withdrawal.wallet_address?.slice(0, 10)}...${withdrawal.wallet_address?.slice(-6)}`
                          : 'Withdrawal'
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(withdrawal.created_at).toLocaleDateString()} at{" "}
                      {new Date(withdrawal.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {withdrawal.tx_hash && (
                      <a
                        href={`https://tronscan.org/#/transaction/${withdrawal.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline block"
                      >
                        View TX
                      </a>
                    )}
                    {withdrawal.proof_of_payment_url && (
                      <a
                        href={withdrawal.proof_of_payment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:underline block"
                      >
                        View Proof
                      </a>
                    )}
                    {withdrawal.rejection_reason && (
                      <div className="text-sm text-red-500">
                        Reason: {withdrawal.rejection_reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No withdrawal history yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
