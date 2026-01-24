"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendMessage(dealId: string, content: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify user is part of this deal
  const { data: deal } = await supabase
    .from("deals")
    .select("buyer_id, seller_id, status")
    .eq("id", dealId)
    .single();

  if (!deal) {
    return { error: "Deal not found" };
  }

  if (deal.buyer_id !== user.id && deal.seller_id !== user.id) {
    return { error: "Not authorized to send messages in this deal" };
  }

  // Can only send messages when deal is active or in dispute
  const allowedStatuses = ["funded", "delivered", "dispute"];
  if (!allowedStatuses.includes(deal.status)) {
    return { error: "Cannot send messages at this deal stage" };
  }

  // Insert message
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      deal_id: dealId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("Message insert error:", error);
    return { error: "Failed to send message" };
  }

  revalidatePath(`/dashboard/deals/${dealId}`);

  return { success: true, message };
}

export async function getMessages(dealId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated", messages: [] };
  }

  // Verify user is part of this deal or is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: deal } = await supabase
    .from("deals")
    .select("buyer_id, seller_id")
    .eq("id", dealId)
    .single();

  if (!deal) {
    return { error: "Deal not found", messages: [] };
  }

  const isParticipant = deal.buyer_id === user.id || deal.seller_id === user.id;
  const isAdmin = profile?.role === "admin";

  if (!isParticipant && !isAdmin) {
    return { error: "Not authorized", messages: [] };
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey (
        id,
        full_name,
        email
      )
    `)
    .eq("deal_id", dealId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Messages fetch error:", error);
    return { error: "Failed to fetch messages", messages: [] };
  }

  return { messages: messages || [] };
}

export async function adminSendMessage(dealId: string, content: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { error: "Unauthorized" };
  }

  // Insert admin message
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      deal_id: dealId,
      sender_id: user.id,
      content: `[ADMIN] ${content.trim()}`,
      is_system: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Admin message error:", error);
    return { error: "Failed to send message" };
  }

  revalidatePath(`/admin/deals/${dealId}`);

  return { success: true, message };
}
