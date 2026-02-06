"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SearchDeals() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);

        // Strip # prefix if present and convert to lowercase
        const query = searchQuery.trim().replace(/^#/, "").toLowerCase();

        // First try exact ID match (for full UUIDs)
        let { data: deal } = await supabase
            .from("deals")
            .select("id")
            .eq("id", query)
            .single();

        // If not found, fetch all deals and filter by partial ID or title
        if (!deal) {
            const { data: deals } = await supabase
                .from("deals")
                .select("id, title")
                .limit(100);

            // Check if any deal ID starts with or contains the search query
            if (deals && deals.length > 0) {
                const matchingDeal = deals.find(d =>
                    d.id.toLowerCase().startsWith(query) ||
                    d.id.toLowerCase().includes(query) ||
                    (d.title && d.title.toLowerCase().includes(query))
                );
                deal = matchingDeal || null;
            }
        }

        if (deal) {
            router.push(`/admin/deals/${deal.id}`);
        } else {
            alert(`No deal found matching "${searchQuery}". Try searching by deal title or the full Deal ID.`);
        }

        setIsSearching(false);
    }

    function handleClear() {
        setSearchQuery("");
    }

    return (
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by Deal ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
                {searchQuery && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={handleClear}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
                {isSearching ? "Searching..." : "Search"}
            </Button>
        </form>
    );
}

