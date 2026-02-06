"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, MessageSquare, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Notification {
    id: string;
    user_id: string;
    deal_id: string;
    message_id: string | null;
    title: string;
    content: string | null;
    read: boolean;
    created_at: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Load notifications
    useEffect(() => {
        async function loadNotifications() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(20);

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter((n) => !n.read).length);
            }
        }

        loadNotifications();

        // Subscribe to new notifications
        const channel = supabase
            .channel("notifications")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                },
                (payload) => {
                    setNotifications((prev) => [payload.new as Notification, ...prev]);
                    setUnreadCount((prev) => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function handleNotificationClick(notification: Notification) {
        // Mark as read
        if (!notification.read) {
            await supabase
                .from("notifications")
                .update({ read: true })
                .eq("id", notification.id);

            setNotifications((prev) =>
                prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        // Navigate to deal
        setIsOpen(false);
        router.push(`/dashboard/deals/${notification.deal_id}`);
    }

    async function markAllAsRead() {
        const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length === 0) return;

        await supabase
            .from("notifications")
            .update({ read: true })
            .in("id", unreadIds);

        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1 px-2 text-xs"
                            onClick={markAllAsRead}
                        >
                            <Check className="h-3 w-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""
                                    }`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <MessageSquare className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="font-medium text-sm truncate flex-1">
                                        {notification.title}
                                    </span>
                                    {!notification.read && (
                                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                    )}
                                </div>
                                {notification.content && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 pl-6">
                                        {notification.content}
                                    </p>
                                )}
                                <span className="text-[10px] text-muted-foreground pl-6">
                                    {formatDistanceToNow(new Date(notification.created_at), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

