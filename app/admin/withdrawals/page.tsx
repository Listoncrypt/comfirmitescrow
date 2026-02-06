import React from "react"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { WithdrawalActions } from "@/components/admin/withdrawal-actions";

export default async function AdminWithdrawalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  const pendingWithdrawals = withdrawals?.filter((w) => w.status === "pending") || [];
  const completedWithdrawals = withdrawals?.filter((w) => w.status === "completed") || [];
  const totalPending = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const totalPaid = completedWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    pending: { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: <Clock className="h-4 w-4" /> },
    completed: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: <CheckCircle className="h-4 w-4" /> },
    successful: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: <CheckCircle className="h-4 w-4" /> },
    rejected: { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: <XCircle className="h-4 w-4" /> },
    cancelled: { color: "bg-muted text-muted-foreground border-border", icon: <XCircle className="h-4 w-4" /> },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
        <p className="text-muted-foreground">Manage user withdrawal requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingWithdrawals.length}</div>
            <p className="text-xs text-muted-foreground">
              ₦{totalPending.toLocaleString()} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedWithdrawals.length}</div>
            <p className="text-xs text-muted-foreground">
              ₦{totalPaid.toLocaleString()} paid out
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withdrawals?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Withdrawals */}
      {pendingWithdrawals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Withdrawals
            </CardTitle>
            <CardDescription>These requests need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-amber-500/5 border-amber-500/20 gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">₦{withdrawal.amount.toLocaleString()}</span>
                      <Badge variant="outline" className={statusConfig.pending.color}>
                        <span className="flex items-center gap-1">
                          {statusConfig.pending.icon}
                          Pending
                        </span>
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{(withdrawal.profiles as any)?.full_name || "Unknown"}</span>
                      <span className="text-muted-foreground"> ({(withdrawal.profiles as any)?.email})</span>
                    </div>

                    {/* Detailed Payment Info */}
                    <div className="mt-2 rounded-md bg-muted/50 p-3 text-sm space-y-1">
                      {withdrawal.bank_name ? (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Bank Name:</span>
                            <span className="col-span-2 font-medium">{withdrawal.bank_name}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Account No:</span>
                            <span className="col-span-2 font-mono">{withdrawal.account_number}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Account Name:</span>
                            <span className="col-span-2">{withdrawal.account_name}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Crypto:</span>
                            <span className="col-span-2 font-medium">{withdrawal.crypto_type}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Network:</span>
                            <span className="col-span-2">TRC-20 (Default)</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Wallet:</span>
                            <span className="col-span-2 font-mono break-all">{(withdrawal as any).wallet_address}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground pt-1">
                      Requested: {new Date(withdrawal.created_at).toLocaleString()}
                    </div>
                  </div>
                  <WithdrawalActions withdrawalId={withdrawal.id} amount={withdrawal.amount} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Withdrawals History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>All withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawals && withdrawals.length > 0 ? (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₦{withdrawal.amount.toLocaleString()}</span>
                      <Badge variant="outline" className={statusConfig[withdrawal.status]?.color}>
                        <span className="flex items-center gap-1">
                          {statusConfig[withdrawal.status]?.icon}
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{(withdrawal.profiles as any)?.full_name || "Unknown"}</span>
                      <span className="text-muted-foreground"> ({(withdrawal.profiles as any)?.email})</span>
                    </div>

                    {/* Detailed Payment Info */}
                    <div className="mt-2 rounded-md bg-muted/50 p-3 text-sm space-y-1">
                      {withdrawal.bank_name ? (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Bank Name:</span>
                            <span className="col-span-2 font-medium">{withdrawal.bank_name}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Account No:</span>
                            <span className="col-span-2 font-mono">{withdrawal.account_number}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Account Name:</span>
                            <span className="col-span-2">{withdrawal.account_name}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Crypto:</span>
                            <span className="col-span-2 font-medium">{withdrawal.crypto_type}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Network:</span>
                            <span className="col-span-2">TRC-20 (Default)</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="text-muted-foreground font-medium">Wallet:</span>
                            <span className="col-span-2 font-mono break-all">{(withdrawal as any).wallet_address}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground pt-1">
                      {new Date(withdrawal.created_at).toLocaleString()}
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
                        View Transaction
                      </a>
                    )}
                    {withdrawal.rejection_reason && (
                      <div className="text-sm text-red-500">
                        Rejected: {withdrawal.rejection_reason}
                      </div>
                    )}
                    {withdrawal.status === "pending" && (
                      <WithdrawalActions withdrawalId={withdrawal.id} amount={withdrawal.amount} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No withdrawals yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

