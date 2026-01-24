"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, Shield, ShoppingCart, Store, ImagePlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface Message {
  id: string;
  deal_id: string;
  sender_id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  sender?: {
    full_name: string | null;
    email?: string;
    role?: string;
  };
}

interface DealChatProps {
  dealId: string;
  userId: string;
  buyerId?: string | null;
  sellerId?: string | null;
  isAdmin?: boolean;
  dealStatus?: string;
}

function getRoleInfo(senderId: string, buyerId?: string | null, sellerId?: string | null, senderRole?: string) {
  if (senderRole === "admin") {
    return {
      role: "Admin",
      color: "bg-purple-500 text-white",
      icon: Shield,
    };
  }
  if (senderId === buyerId) {
    return {
      role: "Buyer",
      color: "bg-blue-500 text-white",
      icon: ShoppingCart,
    };
  }
  if (senderId === sellerId) {
    return {
      role: "Seller",
      color: "bg-green-500 text-white",
      icon: Store,
    };
  }
  return {
    role: "Admin",
    color: "bg-purple-500 text-white",
    icon: Shield,
  };
}

export function DealChat({
  dealId,
  userId,
  buyerId,
  sellerId,
  isAdmin = false,
  dealStatus,
}: DealChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Check if chat is closed (deal finalized and user is not admin)
  const isChatClosed = !isAdmin && (dealStatus === "completed" || dealStatus === "refunded" || dealStatus === "cancelled");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Load initial messages
  useEffect(() => {
    async function loadMessages() {
      setIsLoading(true);
      const { data } = await supabase
        .from("messages")
        .select("*, sender:profiles!sender_id(full_name, email, role)")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data as Message[]);
      }
      setIsLoading(false);
    }

    loadMessages();
  }, [dealId]);

  // Subscribe to realtime messages
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${dealId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `deal_id=eq.${dealId}`,
        },
        async (payload) => {
          // Fetch the sender info including role and email
          const { data: sender } = await supabase
            .from("profiles")
            .select("full_name, email, role")
            .eq("id", payload.new.sender_id)
            .single();

          setMessages((prev) => [
            ...prev,
            { ...payload.new, sender } as Message,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dealId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image (JPG, PNG, WebP, or GIF)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function clearSelectedImage() {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadImage(file: File): Promise<string | null> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${dealId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from("chat-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || isSending) return;

    setIsSending(true);
    let imageUrl: string | null = null;

    // Upload image if selected
    if (selectedImage) {
      setIsUploading(true);
      imageUrl = await uploadImage(selectedImage);
      setIsUploading(false);
    }

    const { error } = await supabase.from("messages").insert({
      deal_id: dealId,
      sender_id: userId,
      content: newMessage.trim() || (imageUrl ? "📷 Payment Receipt" : ""),
      image_url: imageUrl,
    });

    if (!error) {
      setNewMessage("");
      clearSelectedImage();
    }
    setIsSending(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[350px] overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {messages.map((message) => {
              const isOwn = message.sender_id === userId;
              const roleInfo = getRoleInfo(
                message.sender_id,
                buyerId,
                sellerId,
                message.sender?.role
              );
              const RoleIcon = roleInfo.icon;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${isOwn ? "text-primary-foreground" : ""}`}>
                        {message.sender?.full_name || message.sender?.email?.split('@')[0] || (roleInfo.role === "Admin" ? "Escrow Admin" : "User")}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 h-4 ${roleInfo.color}`}
                      >
                        <RoleIcon className="h-2.5 w-2.5 mr-0.5" />
                        {roleInfo.role}
                      </Badge>
                    </div>
                    {message.image_url && (
                      <div className="mb-2 rounded-lg overflow-hidden">
                        <a href={message.image_url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={message.image_url}
                            alt="Shared image"
                            className="max-w-full max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        </a>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${isOwn
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                        }`}
                    >
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isChatClosed ? (
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span className="text-sm">This deal has been finalized. Chat is closed.</span>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t space-y-2">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-24 rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={clearSelectedImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex gap-2">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
            />

            {/* Image upload button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              title="Upload payment receipt or image"
            >
              <ImagePlus className="h-4 w-4" />
            </Button>

            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isSending}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSending || isUploading || (!newMessage.trim() && !selectedImage)}
            >
              {isSending || isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
