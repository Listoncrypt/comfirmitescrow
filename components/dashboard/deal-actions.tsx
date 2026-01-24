"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Check, Loader2, AlertTriangle } from "lucide-react";
import {
  fundDeal,
  markDelivered,
  confirmDelivery,
  openDispute,
  cancelDeal,
} from "@/lib/actions/deals";

interface DealActionsProps {
  deal: any;
  isBuyer: boolean;
  isSeller: boolean;
  inviteLink: string | null;
}

export function DealActions({
  deal,
  isBuyer,
  isSeller,
  inviteLink,
}: DealActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeOpen, setDisputeOpen] = useState(false);
  const router = useRouter();

  async function copyInviteLink() {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleFund() {
    setIsLoading(true);
    const result = await fundDeal(deal.id);
    if (result?.error) {
      alert(result.error);
    }
    setIsLoading(false);
    router.refresh();
  }

  async function handleDeliver() {
    setIsLoading(true);
    const result = await markDelivered(deal.id);
    if (result?.error) {
      alert(result.error);
    }
    setIsLoading(false);
    router.refresh();
  }

  async function handleConfirm() {
    setIsLoading(true);
    const result = await confirmDelivery(deal.id);
    if (result?.error) {
      alert(result.error);
    }
    setIsLoading(false);
    router.refresh();
  }

  async function handleDispute() {
    if (!disputeReason.trim()) {
      alert("Please provide a reason for the dispute");
      return;
    }
    setIsLoading(true);
    const result = await openDispute(deal.id, disputeReason);
    if (result?.error) {
      alert(result.error);
    }
    setIsLoading(false);
    setDisputeOpen(false);
    router.refresh();
  }

  async function handleCancel() {
    setIsLoading(true);
    const result = await cancelDeal(deal.id);
    if (result?.error) {
      alert(result.error);
    }
    setIsLoading(false);
    router.refresh();
  }

  // Show invite link for pending deals (draft or awaiting_buyer)
  if (
    (deal.status === "draft" || deal.status === "awaiting_buyer") &&
    inviteLink
  ) {
    const needsOtherParty =
      (deal.status === "draft" && !deal.seller_id) ||
      (deal.status === "awaiting_buyer" && !deal.buyer_id);

    if (needsOtherParty) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share this link with the {deal.status === "draft" ? "seller" : "buyer"} to invite them to the deal:
          </p>
          <div className="flex gap-2">
            <Input value={inviteLink} readOnly className="flex-1" />
            <Button variant="outline" onClick={copyInviteLink}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive bg-transparent">
                  Cancel Deal
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this deal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The deal will be marked as cancelled.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Deal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Cancel Deal"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      );
    }
  }

  // Awaiting payment state - Show payment instructions for bank transfer
  if (deal.status === "awaiting_payment") {
    return (
      <div className="space-y-4">
        {isBuyer && (
          <>
            <p className="text-sm text-muted-foreground">
              Both parties have joined. Make a bank transfer to the escrow account and share your payment receipt in the chat below.
            </p>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                💰 Amount to Pay: ₦{deal.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                After sending the payment, upload your receipt/screenshot in the chat so the admin can verify and proceed with the deal.
              </p>
            </div>
          </>
        )}
        {isSeller && (
          <p className="text-sm text-muted-foreground">
            Waiting for the buyer to make payment. They will share the payment receipt in the chat once done.
          </p>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive bg-transparent">
              Cancel Deal
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this deal?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The deal will be marked as cancelled.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Deal</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Cancel Deal"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // In escrow state - Seller can mark delivered
  if (deal.status === "in_escrow") {
    return (
      <div className="space-y-4">
        {isSeller && (
          <>
            <p className="text-sm text-muted-foreground">
              Deliver the goods/services, then mark this deal as delivered.
            </p>
            <Button onClick={handleDeliver} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Mark as Delivered
            </Button>
          </>
        )}
        {isBuyer && (
          <p className="text-sm text-muted-foreground">
            Waiting for the seller to deliver. You'll be notified when they mark the deal as delivered.
          </p>
        )}
        <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-destructive bg-transparent">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Open Dispute
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Open a Dispute</DialogTitle>
              <DialogDescription>
                Describe the issue with this deal. An admin will review and resolve the dispute.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Explain why you're opening this dispute..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              rows={4}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setDisputeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDispute} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Submit Dispute
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Delivered state - Buyer can confirm
  if (deal.status === "delivered") {
    return (
      <div className="space-y-4">
        {isBuyer && (
          <>
            <p className="text-sm text-muted-foreground">
              The seller has marked this as delivered. Confirm if you received the goods/services.
            </p>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>Confirm Delivery</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm delivery?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will release the funds (₦{deal.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2 })}) to the seller.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Release Funds"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-destructive bg-transparent">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Open Dispute
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Open a Dispute</DialogTitle>
                    <DialogDescription>
                      Describe the issue with this deal. An admin will review and resolve the dispute.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Explain why you're opening this dispute..."
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    rows={4}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDisputeOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleDispute} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Submit Dispute
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
        {isSeller && (
          <p className="text-sm text-muted-foreground">
            You've marked this as delivered. Waiting for the buyer to confirm receipt.
          </p>
        )}
      </div>
    );
  }

  // Completed state
  if (deal.status === "completed") {
    return (
      <div className="rounded-lg bg-green-500/10 p-4">
        <p className="text-sm text-green-700 dark:text-green-400">
          This deal has been completed successfully. Funds have been released to the seller.
        </p>
      </div>
    );
  }

  // Disputed state
  if (deal.status === "disputed") {
    return (
      <div className="rounded-lg bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          This deal is under dispute. An admin will review and resolve this issue.
        </p>
      </div>
    );
  }

  // Cancelled/Refunded state
  if (deal.status === "cancelled" || deal.status === "refunded") {
    return (
      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          This deal has been {deal.status}.
        </p>
      </div>
    );
  }

  return null;
}
