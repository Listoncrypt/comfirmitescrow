"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * User requests a withdrawal
 * Balance is NOT deducted here - only when admin approves
 */
export async function requestWithdrawal(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const amount = parseFloat(formData.get("amount") as string);
  const paymentMethod = formData.get("payment_method") as string;

  // Bank account fields
  const bankName = formData.get("bank_name") as string;
  const accountNumber = formData.get("account_number") as string;
  const accountName = formData.get("account_name") as string;

  // Crypto fields
  const walletAddress = formData.get("wallet_address") as string;
  const cryptoType = formData.get("crypto_type") as string;

  if (!amount || amount <= 0) {
    return { error: "Invalid amount" };
  }

  if (amount < 1000) {
    return { error: "Minimum withdrawal is ₦1,000" };
  }

  // Validate based on payment method
  if (paymentMethod === "bank") {
    if (!bankName || !accountNumber || !accountName) {
      return { error: "Please fill in all bank account details" };
    }
  } else if (paymentMethod === "crypto") {
    if (!walletAddress || walletAddress.trim().length < 10) {
      return { error: "Invalid wallet address" };
    }
  }

  // Get user's current balance
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { error: "Could not fetch profile" };
  }

  const currentBalance = (profile as any).balance || 0;

  if (currentBalance < amount) {
    return { error: `Insufficient balance. You have ₦${currentBalance.toLocaleString()}` };
  }

  // Check for pending withdrawals
  const { data: pendingWithdrawals } = await supabase
    .from("withdrawals")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending");

  if (pendingWithdrawals && pendingWithdrawals.length > 0) {
    return { error: "You already have a pending withdrawal request" };
  }

  // Create withdrawal request (balance is NOT deducted yet)
  const withdrawalData: any = {
    user_id: user.id,
    amount,
    currency: "NGN",
    status: "pending",
  };

  if (paymentMethod === "bank") {
    withdrawalData.bank_name = bankName;
    withdrawalData.account_number = accountNumber;
    withdrawalData.account_name = accountName;
    withdrawalData.withdrawal_type = "bank";
  } else {
    withdrawalData.wallet_address = walletAddress;
    withdrawalData.crypto_type = cryptoType || "USDT";
    withdrawalData.withdrawal_type = "crypto";
  }

  const { error: withdrawalError } = await supabase
    .from("withdrawals")
    .insert(withdrawalData);

  if (withdrawalError) {
    console.error("Withdrawal error:", withdrawalError);
    return { error: "Failed to create withdrawal request: " + withdrawalError.message };
  }

  // NOTE: Balance is NOT deducted here
  // Balance will only be deducted when admin approves the withdrawal

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/withdrawals");

  return { success: true, message: "Withdrawal request submitted. Awaiting admin approval." };
}

/**
 * User cancels their own pending withdrawal
 * No balance adjustment needed since balance was never deducted
 */
export async function cancelWithdrawal(withdrawalId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get withdrawal
  const { data: withdrawal, error: fetchError } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("id", withdrawalId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !withdrawal) {
    return { error: "Withdrawal not found" };
  }

  if ((withdrawal as any).status !== "pending") {
    return { error: "Can only cancel pending withdrawals" };
  }

  // Update withdrawal status (no balance adjustment needed)
  const { error: updateError } = await supabase
    .from("withdrawals")
    .update({ status: "cancelled" } as any)
    .eq("id", withdrawalId);

  if (updateError) {
    return { error: "Failed to cancel withdrawal" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/withdrawals");

  return { success: true };
}

