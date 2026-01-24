"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function createDeal(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const counterpartyEmail = formData.get("counterpartyEmail") as string;
  const role = formData.get("role") as "buyer" | "seller";
  const inspectionPeriod = parseInt(formData.get("inspectionPeriod") as string) || 3;

  if (!title || !description || !amount || !counterpartyEmail || !role) {
    return { error: "All fields are required" };
  }

  if (amount <= 0) {
    return { error: "Amount must be greater than 0" };
  }

  // Generate unique invite code
  const inviteCode = crypto.randomBytes(16).toString("hex");

  // Determine buyer and seller based on role
  const buyerId = role === "buyer" ? user.id : null;
  const sellerId = role === "seller" ? user.id : null;
  // Use valid enum values: 'draft' when buyer creates (waiting for seller), 'awaiting_buyer' when seller creates
  const status = role === "buyer" ? "draft" : "awaiting_buyer";

  const { data: deal, error } = await supabase
    .from("deals")
    .insert({
      title,
      description,
      amount,
      currency: "NGN",
      buyer_id: buyerId,
      seller_id: sellerId,
      status,
      invite_code: inviteCode,
      counterparty_email: counterpartyEmail,
      inspection_period_days: inspectionPeriod,
    } as any)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deals");

  return { dealId: deal.id, inviteCode };
}

export async function acceptDealInvite(dealId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the deal
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  // Check if user is already part of the deal
  if (deal.buyer_id === user.id || deal.seller_id === user.id) {
    return { error: "You are already part of this deal" };
  }

  // Verify that the user's email matches the counterparty_email
  // Only the person who was invited can join the deal
  const counterpartyEmail = (deal as any).counterparty_email;
  if (counterpartyEmail && user.email?.toLowerCase() !== counterpartyEmail.toLowerCase()) {
    return {
      error: `This deal invitation was sent to ${counterpartyEmail}. Please sign in with that email address to join.`
    };
  }

  // Update deal based on status
  let updateData: any = {};

  if (deal.status === "draft" && !deal.seller_id) {
    updateData = { seller_id: user.id, status: "awaiting_payment" };
  } else if (deal.status === "awaiting_buyer" && !deal.buyer_id) {
    updateData = { buyer_id: user.id, status: "awaiting_payment" };
  } else {
    return { error: "Cannot join this deal" };
  }

  // Use service role client to bypass RLS for this critical update
  const adminClient = createServiceRoleClient();
  const { error: updateError } = await adminClient
    .from("deals")
    .update(updateData)
    .eq("id", dealId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deals");
  revalidatePath(`/dashboard/deals/${dealId}`);

  // Redirect to the deal page directly now that we use service role
  redirect(`/dashboard/deals/${dealId}`);
}

export async function fundDeal(dealId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the deal
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  // Only buyer can fund
  if (deal.buyer_id !== user.id) {
    return { error: "Only the buyer can fund this deal" };
  }

  // Check deal status
  if (deal.status !== "awaiting_buyer" && deal.status !== "draft" && deal.status !== "awaiting_payment") {
    // If both parties are set, allow funding
    if (!deal.buyer_id || !deal.seller_id) {
      return { error: "Both parties must join before funding" };
    }
  }

  // Get buyer's balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.balance || 0) < deal.amount) {
    return { error: "Insufficient balance. Please add funds first." };
  }

  // Deduct from buyer's balance and update deal status
  const { error: balanceError } = await supabase
    .from("profiles")
    .update({ balance: (profile.balance || 0) - deal.amount })
    .eq("id", user.id);

  if (balanceError) {
    return { error: "Failed to deduct balance" };
  }

  const { error: updateError } = await supabase
    .from("deals")
    .update({ status: "in_escrow", funded_at: new Date().toISOString() } as any)
    .eq("id", dealId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deals");
  revalidatePath(`/dashboard/deals/${dealId}`);

  return { success: true };
}

export async function markDelivered(dealId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the deal
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  // Only seller can mark as delivered
  if (deal.seller_id !== user.id) {
    return { error: "Only the seller can mark as delivered" };
  }

  if (deal.status !== "in_escrow") {
    return { error: "Deal must be funded before marking as delivered" };
  }

  const { error: updateError } = await supabase
    .from("deals")
    .update({ status: "delivered", delivered_at: new Date().toISOString() })
    .eq("id", dealId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deals");
  revalidatePath(`/dashboard/deals/${dealId}`);

  return { success: true };
}

export async function confirmDelivery(dealId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the deal
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  // Only buyer can confirm delivery
  if (deal.buyer_id !== user.id) {
    return { error: "Only the buyer can confirm delivery" };
  }

  if (deal.status !== "delivered") {
    return { error: "Seller must mark as delivered first" };
  }

  // Release funds to seller
  const { data: sellerProfile } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", deal.seller_id)
    .single();

  const { error: balanceError } = await supabase
    .from("profiles")
    .update({ balance: (sellerProfile?.balance || 0) + deal.amount })
    .eq("id", deal.seller_id);

  if (balanceError) {
    return { error: "Failed to release funds" };
  }

  const { error: updateError } = await supabase
    .from("deals")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", dealId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deals");
  revalidatePath(`/dashboard/deals/${dealId}`);

  return { success: true };
}

export async function openDispute(dealId: string, reason: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the deal
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  // Must be participant
  if (deal.buyer_id !== user.id && deal.seller_id !== user.id) {
    return { error: "You are not part of this deal" };
  }

  // Can only dispute funded or delivered deals
  if (deal.status !== "in_escrow" && deal.status !== "delivered") {
    return { error: "Cannot dispute this deal at current stage" };
  }

  const { error: updateError } = await supabase
    .from("deals")
    .update({
      status: "disputed",
      dispute_reason: reason,
      disputed_by: user.id,
      disputed_at: new Date().toISOString(),
    })
    .eq("id", dealId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deals");
  revalidatePath(`/dashboard/deals/${dealId}`);

  return { success: true };
}

export async function cancelDeal(dealId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the deal
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  // Must be participant
  if (deal.buyer_id !== user.id && deal.seller_id !== user.id) {
    return { error: "You are not part of this deal" };
  }

  // If both buyer and seller have joined, only admin can cancel
  if (deal.buyer_id && deal.seller_id) {
    return {
      error: "Both parties have joined this deal. Only an admin can cancel it now. Please open a dispute if there's an issue."
    };
  }

  // Can only cancel deals that are not yet funded
  if (deal.status === "in_escrow" || deal.status === "delivered" || deal.status === "completed" || deal.status === "disputed") {
    return { error: "Cannot cancel a deal that has been funded. Please open a dispute instead." };
  }

  const { error: updateError } = await supabase
    .from("deals")
    .update({ status: "cancelled" })
    .eq("id", dealId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deals");
  revalidatePath(`/dashboard/deals/${dealId}`);

  return { success: true };
}
