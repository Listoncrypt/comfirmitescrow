"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DealStatusListener({ dealId }: { dealId: string }) {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel(`deal_status_${dealId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "deals",
                    filter: `id=eq.${dealId}`,
                },
                (payload) => {
                    // Refresh the page when the deal updates (e.g. status change, new participant)
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [dealId, router, supabase]);

    return null;
}

