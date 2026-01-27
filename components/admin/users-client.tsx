"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { AdminUserActions } from "@/components/admin/user-actions";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// Helper component for highlighting text
// Helper component for highlighting text
function HighlightText({ text, highlight }: { text: string; highlight: string }) {
    if (!highlight || !highlight.trim()) {
        return <span>{text}</span>;
    }

    const trimmedHighlight = highlight.trim();
    // Escape special regex characters
    const escapedHighlight = trimmedHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));

    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === trimmedHighlight.toLowerCase() ? (
                    <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 font-bold">
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
}

// Ensure strict typing for the initial users prop
interface Profile {
    id: string;
    email: string | null;
    full_name: string | null;
    role: string;
    balance: number | null;
    created_at: string;
    bank_name?: string | null;
    account_number?: string | null;
    account_name?: string | null;
}

export function UsersClient({ initialUsers }: { initialUsers: Profile[] }) {
    const [query, setQuery] = useState("");

    const filteredUsers = initialUsers.filter((user) => {
        if (!query) return true;
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) return true; // Handle case where query is just whitespace

        const emailMatch = user.email?.toLowerCase().includes(lowerQuery) || false;
        const nameMatch = user.full_name?.toLowerCase().includes(lowerQuery) || false;
        return emailMatch || nameMatch;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Users</h1>
                    <p className="text-muted-foreground">
                        Manage all registered users on the platform
                    </p>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by email or name..."
                        className="pl-8"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        {filteredUsers?.length || 0} users found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers?.map((profile) => {
                                const initials = profile.full_name
                                    ? profile.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)
                                    : "U";

                                return (
                                    <TableRow key={profile.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">
                                                    <HighlightText
                                                        text={profile.full_name || ""}
                                                        highlight={query}
                                                    />
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            <HighlightText
                                                text={profile.email || ""}
                                                highlight={query}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    profile.role === "admin" ? "default" : "secondary"
                                                }
                                            >
                                                {profile.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>₦{profile.balance?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {format(new Date(profile.created_at), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AdminUserActions
                                                user={profile}
                                                onSuccess={() => setQuery("")}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
