"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FinalizeDealButtonProps {
    dealId: string;
    dealStatus: string;
    dealTitle: string;
}

export function FinalizeDealButton({ dealId, dealStatus, dealTitle }: FinalizeDealButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Only show for active deals
    if (["completed", "cancelled", "refunded"].includes(dealStatus)) {
        return (
            <Button variant="ghost" size="sm" disabled title="Deal Already Closed">
                <CheckCircle className="h-4 w-4 text-green-500" />
            </Button>
        );
    }

    async function handleFinalize() {
        setIsLoading(true);

        // Get deal details first to notify participants and credit seller
        const { data: deal } = await supabase
            .from("deals")
            .select("buyer_id, seller_id, title, amount")
            .eq("id", dealId)
            .single();

        const { error } = await supabase
            .from("deals")
            .update({
                status: "completed",
                completed_at: new Date().toISOString(),
            })
            .eq("id", dealId);

        if (error) {
            alert("Error finalizing deal: " + error.message);
        } else {
            // Credit seller's balance with deal amount minus 2.5% escrow fee
            if (deal && deal.seller_id && deal.amount) {
                const escrowFee = deal.amount * 0.025; // 2.5% fee
                const sellerCredit = deal.amount - escrowFee;

                // Get current seller balance
                const { data: sellerProfile } = await supabase
                    .from("profiles")
                    .select("balance")
                    .eq("id", deal.seller_id)
                    .single();

                if (sellerProfile) {
                    const newBalance = (sellerProfile.balance || 0) + sellerCredit;

                    await supabase
                        .from("profiles")
                        .update({ balance: newBalance })
                        .eq("id", deal.seller_id);
                }
            }

            // Send notifications to buyer and seller
            if (deal) {
                const shortId = dealId.slice(0, 8).toUpperCase();
                const escrowFee = deal.amount ? deal.amount * 0.025 : 0;
                const sellerCredit = deal.amount ? deal.amount - escrowFee : 0;

                const buyerContent = `Deal "${deal.title}" (ID: ${shortId}) has been finalized. For any issues, contact support with your Deal ID.`;
                const sellerContent = `Deal "${deal.title}" (ID: ${shortId}) has been finalized. ₦${sellerCredit.toLocaleString()} has been added to your balance. Go to Withdrawals to request a payout.`;

                const notifications = [];

                if (deal.buyer_id) {
                    notifications.push({
                        user_id: deal.buyer_id,
                        deal_id: dealId,
                        title: "Deal Finalized",
                        content: buyerContent,
                    });
                }

                if (deal.seller_id) {
                    notifications.push({
                        user_id: deal.seller_id,
                        deal_id: dealId,
                        title: "Deal Finalized - Funds Added!",
                        content: sellerContent,
                    });
                }

                if (notifications.length > 0) {
                    await supabase.from("notifications").insert(notifications);
                }
            }

            setIsOpen(false);
            router.refresh();
        }

        setIsLoading(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Finalize Deal"
                >
                    <CheckCircle className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Finalize Deal</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to finalize &quot;{dealTitle}&quot;? This will mark the deal as completed.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleFinalize}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Finalizing...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Finalize Deal
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

