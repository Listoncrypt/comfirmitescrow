"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Platform fee percentage (2.5%)
const PLATFORM_FEE_PERCENTAGE = 2.5;

async function isAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (profile as any)?.role === "admin";
}

async function getAdminId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id;
}

export async function updateUserBalance(userId: string, newBalance: number) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ balance: newBalance } as any)
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role } as any)
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserBankDetails(userId: string, bankDetails: { bank_name: string; account_number: string; account_name: string }) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      bank_name: bankDetails.bank_name,
      account_number: bankDetails.account_number,
      account_name: bankDetails.account_name,
    } as any)
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Admin marks a deal as completed/successful
 * This releases funds to the seller after deducting platform fee (2.5%)
 */
export async function completeDeal(dealId: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();
  const adminId = await getAdminId();

  // Get the deal
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  const dealData = deal as any;

  // Can only complete deals that are in_escrow or delivered
  if (dealData.status !== "in_escrow" && dealData.status !== "delivered") {
    return { error: "Deal must be in escrow or delivered status to complete" };
  }

  // Get seller's current balance
  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", dealData.seller_id)
    .single();

  if (!sellerProfile) {
    return { error: "Seller not found" };
  }

  // Calculate amount after platform fee
  const platformFee = dealData.amount * (PLATFORM_FEE_PERCENTAGE / 100);
  const sellerAmount = dealData.amount - platformFee;
  const newSellerBalance = ((sellerProfile as any).balance || 0) + sellerAmount;

  // Update seller's balance
  const { error: balanceError } = await supabase
    .from("profiles")
    .update({ balance: newSellerBalance } as any)
    .eq("id", dealData.seller_id);

  if (balanceError) {
    return { error: "Failed to update seller balance" };
  }

  // Update deal status
  const { error: dealError } = await supabase
    .from("deals")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      platform_fee: platformFee,
      completed_by: adminId,
    } as any)
    .eq("id", dealId);

  if (dealError) {
    return { error: dealError.message };
  }

  revalidatePath("/admin/deals");
  revalidatePath("/admin");
  revalidatePath(`/dashboard/deals/${dealId}`);

  return {
    success: true,
    platformFee,
    sellerAmount,
    message: `Deal completed. Seller received ₦${sellerAmount.toLocaleString()} (after ${PLATFORM_FEE_PERCENTAGE}% fee)`
  };
}

/**
 * Admin cancels a deal (can cancel at any stage)
 * If deal was funded, refunds buyer
 */
export async function adminCancelDeal(dealId: string, reason?: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();
  const adminId = await getAdminId();

  // Get the deal
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  const dealData = deal as any;

  // If deal was funded (in_escrow or delivered), refund the buyer
  if (dealData.status === "in_escrow" || dealData.status === "delivered") {
    const { data: buyerProfile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", dealData.buyer_id)
      .single();

    if (buyerProfile) {
      const newBuyerBalance = ((buyerProfile as any).balance || 0) + dealData.amount;
      await supabase
        .from("profiles")
        .update({ balance: newBuyerBalance } as any)
        .eq("id", dealData.buyer_id);
    }
  }

  // Update deal status
  const { error: dealError } = await supabase
    .from("deals")
    .update({
      status: "cancelled",
      admin_notes: reason || "Cancelled by admin",
      cancelled_by: adminId,
      cancelled_at: new Date().toISOString(),
    } as any)
    .eq("id", dealId);

  if (dealError) {
    return { error: dealError.message };
  }

  revalidatePath("/admin/deals");
  revalidatePath("/admin");
  revalidatePath(`/dashboard/deals/${dealId}`);

  return { success: true };
}

/**
 * Resolve a disputed deal
 */
export async function resolveDispute(
  dealId: string,
  resolution: "release_to_seller" | "refund_to_buyer" | "split",
  splitPercentage?: number
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();

  // Get the deal
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  const dealData = deal as any;

  if (dealData.status !== "disputed") {
    return { error: "Deal is not in disputed status" };
  }

  // Get buyer and seller profiles
  const { data: buyerProfile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", dealData.buyer_id)
    .single();

  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", dealData.seller_id)
    .single();

  if (!buyerProfile || !sellerProfile) {
    return { error: "Could not find buyer or seller profile" };
  }

  let newBuyerBalance = (buyerProfile as any).balance || 0;
  let newSellerBalance = (sellerProfile as any).balance || 0;
  let newStatus = "";
  let platformFee = 0;

  if (resolution === "release_to_seller") {
    // Apply platform fee when releasing to seller
    platformFee = dealData.amount * (PLATFORM_FEE_PERCENTAGE / 100);
    newSellerBalance += (dealData.amount - platformFee);
    newStatus = "completed";
  } else if (resolution === "refund_to_buyer") {
    newBuyerBalance += dealData.amount;
    newStatus = "refunded";
  } else if (resolution === "split" && splitPercentage !== undefined) {
    const buyerAmount = dealData.amount * (splitPercentage / 100);
    const sellerAmount = dealData.amount - buyerAmount;
    // Apply fee only to seller portion
    platformFee = sellerAmount * (PLATFORM_FEE_PERCENTAGE / 100);
    newBuyerBalance += buyerAmount;
    newSellerBalance += (sellerAmount - platformFee);
    newStatus = "completed";
  } else {
    return { error: "Invalid resolution" };
  }

  // Update balances
  const { error: buyerError } = await supabase
    .from("profiles")
    .update({ balance: newBuyerBalance } as any)
    .eq("id", dealData.buyer_id);

  if (buyerError) {
    return { error: "Failed to update buyer balance" };
  }

  const { error: sellerError } = await supabase
    .from("profiles")
    .update({ balance: newSellerBalance } as any)
    .eq("id", dealData.seller_id);

  if (sellerError) {
    return { error: "Failed to update seller balance" };
  }

  // Update deal status
  const { error: dealError } = await supabase
    .from("deals")
    .update({
      status: newStatus,
      admin_resolution: resolution,
      platform_fee: platformFee,
      resolved_at: new Date().toISOString(),
    } as any)
    .eq("id", dealId);

  if (dealError) {
    return { error: dealError.message };
  }

  revalidatePath("/admin/deals");
  revalidatePath("/admin/disputes");
  revalidatePath(`/admin/deals/${dealId}`);

  return { success: true };
}

/**
 * Process a withdrawal request
 * - When approved: Deduct from user's balance (money was sent manually)
 * - When rejected: No balance change (balance was never deducted)
 */
export async function processWithdrawal(
  withdrawalId: string,
  action: "approve" | "reject",
  rejectionReason?: string,
  proofOfPaymentUrl?: string
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  const supabase = await createClient();
  const adminId = await getAdminId();

  // Get the withdrawal
  const { data: withdrawal, error: fetchError } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("id", withdrawalId)
    .single();

  if (fetchError || !withdrawal) {
    return { error: "Withdrawal not found" };
  }

  const withdrawalData = withdrawal as any;

  if (withdrawalData.status !== "pending") {
    return { error: "Withdrawal is not pending" };
  }

  if (action === "approve") {
    // Get user's current balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", withdrawalData.user_id)
      .single();

    if (!profile) {
      return { error: "User not found" };
    }

    const currentBalance = (profile as any).balance || 0;

    // Check if user still has enough balance
    if (currentBalance < withdrawalData.amount) {
      return { error: `Insufficient balance. User only has ₦${currentBalance.toLocaleString()}` };
    }

    // Deduct from user's balance (admin has sent money manually)
    const newBalance = currentBalance - withdrawalData.amount;

    const { error: balanceError } = await supabase
      .from("profiles")
      .update({ balance: newBalance } as any)
      .eq("id", withdrawalData.user_id);

    if (balanceError) {
      return { error: "Failed to update user balance" };
    }

    // Calculate the fee (for record keeping - user receives amount minus fee)
    const withdrawalFee = withdrawalData.amount * (PLATFORM_FEE_PERCENTAGE / 100);
    const amountSent = withdrawalData.amount - withdrawalFee;

    // Mark as successful
    const { error } = await supabase
      .from("withdrawals")
      .update({
        status: "successful",
        processed_at: new Date().toISOString(),
        processed_by: adminId,
        withdrawal_fee: withdrawalFee,
        amount_sent: amountSent,
        proof_of_payment_url: proofOfPaymentUrl,
      } as any)
      .eq("id", withdrawalId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/withdrawals");
    revalidatePath("/dashboard/withdrawals");

    return {
      success: true,
      message: `Withdrawal approved. User balance reduced by ₦${withdrawalData.amount.toLocaleString()}. Amount sent: ₦${amountSent.toLocaleString()} (after ${PLATFORM_FEE_PERCENTAGE}% fee)`
    };

  } else if (action === "reject") {
    // Just mark as rejected - no balance change since we never deducted
    const { error } = await supabase
      .from("withdrawals")
      .update({
        status: "rejected",
        admin_notes: rejectionReason,
        processed_at: new Date().toISOString(),
        processed_by: adminId,
      } as any)
      .eq("id", withdrawalId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/withdrawals");
    revalidatePath("/dashboard/withdrawals");

    return { success: true, message: "Withdrawal rejected" };
  }

  return { error: "Invalid action" };
}

export async function deleteUser(userId: string, adminKey: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  // Verify the unique key
  if (adminKey !== "franciscomfirmit@01") {
    return { error: "Invalid Admin Key. Deletion denied." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
