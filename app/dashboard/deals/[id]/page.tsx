import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  User,
  Calendar,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { DealActions } from "@/components/dashboard/deal-actions";
import { DealChat } from "@/components/dashboard/deal-chat";
import { PaymentInstructions } from "@/components/dashboard/payment-instructions";

const statusConfig = {
  draft: {
    label: "Awaiting Seller",
    description: "Waiting for the seller to join the deal",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-yellow-500",
  },
  awaiting_buyer: {
    label: "Awaiting Buyer",
    description: "Waiting for the buyer to join the deal",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-yellow-500",
  },
  awaiting_payment: {
    label: "Awaiting Payment",
    description: "Both parties joined, waiting for buyer to fund escrow",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-orange-500",
  },
  in_escrow: {
    label: "In Escrow",
    description: "Funds secured in escrow, waiting for seller to deliver",
    variant: "default" as const,
    icon: CheckCircle2,
    color: "text-blue-500",
  },
  delivered: {
    label: "Delivered",
    description: "Seller marked as delivered, buyer is in inspection period",
    variant: "default" as const,
    icon: CheckCircle2,
    color: "text-blue-500",
  },
  completed: {
    label: "Completed",
    description: "Deal completed successfully, funds released to seller",
    variant: "default" as const,
    icon: CheckCircle2,
    color: "text-green-500",
  },
  disputed: {
    label: "Disputed",
    description: "Deal is under dispute, admin will review",
    variant: "destructive" as const,
    icon: AlertCircle,
    color: "text-red-500",
  },
  cancelled: {
    label: "Cancelled",
    description: "Deal was cancelled",
    variant: "outline" as const,
    icon: XCircle,
    color: "text-gray-500",
  },
  refunded: {
    label: "Refunded",
    description: "Funds have been refunded to the buyer",
    variant: "outline" as const,
    icon: XCircle,
    color: "text-gray-500",
  },
};

// Force dynamic rendering to prevent caching issues when users join deals
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get the deal with related profiles - disable cache to ensure fresh data
  const { data: deal, error } = await supabase
    .from("deals")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !deal) {
    notFound();
  }

  // Check if user is part of this deal
  const isBuyer = deal.buyer_id === user.id;
  const isSeller = deal.seller_id === user.id;

  // If user is not a participant, return 404
  // Note: We check this AFTER fetching to ensure we have fresh data
  if (!isBuyer && !isSeller) {
    notFound();
  }

  // Get counterparty profile
  const counterpartyId = isBuyer ? deal.seller_id : deal.buyer_id;
  let counterparty = null;
  if (counterpartyId) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", counterpartyId)
      .single();
    counterparty = data;
  }

  const status = statusConfig[deal.status as keyof typeof statusConfig];
  const StatusIcon = status?.icon || Clock;

  // Build invite link
  const inviteLink = deal.invite_code
    ? `${process.env.NEXT_PUBLIC_APP_URL || ""}/invite/${deal.invite_code}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/deals">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{deal.title}</h1>
          <p className="text-muted-foreground">Deal #{deal.id.slice(0, 8)}</p>
        </div>
        <Badge variant={status?.variant || "secondary"} className="h-8 px-3">
          <StatusIcon className="mr-1 h-4 w-4" />
          {status?.label || deal.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${status?.color}`} />
                {status?.label}
              </CardTitle>
              <CardDescription>{status?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <DealActions
                deal={deal}
                isBuyer={isBuyer}
                isSeller={isSeller}
                inviteLink={inviteLink}
              />
            </CardContent>
          </Card>

          {/* Deal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Deal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Description
                </h4>
                <p className="text-foreground">{deal.description}</p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-lg font-semibold">
                      ₦{deal.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(new Date(deal.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inspection</p>
                  <p className="font-medium">
                    {(deal as any).inspection_period_days || 3} Days
                  </p>
                </div>
              </div>

              {(deal as any).delivery_period && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Truck className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Delivery</p>
                    <p className="font-medium">
                      {(deal as any).delivery_period} Days
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Role</p>
                  <p className="font-medium">{isBuyer ? "Buyer" : "Seller"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <User className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isBuyer ? "Seller" : "Buyer"}
                  </p>
                  <p className="font-medium">
                    {counterparty?.full_name ||
                      deal.counterparty_email ||
                      "Pending..."}
                  </p>
                </div>
              </div>
            </div>

            {deal.dispute_reason && (
              <>
                <Separator />
                <div className="rounded-lg bg-destructive/10 p-4">
                  <h4 className="font-medium text-destructive mb-1">
                    Dispute Reason
                  </h4>
                  <p className="text-sm">{deal.dispute_reason}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Instructions - Show for buyer when awaiting payment */}
        {deal.status === "awaiting_payment" && isBuyer && (
          <PaymentInstructions
            dealAmount={deal.amount || 0}
            dealTitle={deal.title || "Deal"}
          />
        )}

        {/* Chat */}
        {deal.buyer_id && deal.seller_id && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
              <CardDescription>
                Communicate with the other party
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DealChat
                dealId={deal.id}
                userId={user.id}
                buyerId={deal.buyer_id}
                sellerId={deal.seller_id}
                dealStatus={deal.status}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Timeline */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TimelineItem
                title="Deal Created"
                date={deal.created_at}
                completed
              />
              <TimelineItem
                title="Both Parties Joined"
                date={deal.buyer_id && deal.seller_id ? deal.created_at : null}
                completed={!!deal.buyer_id && !!deal.seller_id}
              />
              <TimelineItem
                title="Deal Commences in Chat"
                date={deal.buyer_id && deal.seller_id ? deal.created_at : null}
                completed={!!deal.buyer_id && !!deal.seller_id}
              />
              <TimelineItem
                title="Deal Finalised"
                date={deal.completed_at}
                completed={deal.status === "completed" || deal.status === "refunded"}
                isLast
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div >
  );
}

function TimelineItem({
  title,
  date,
  completed,
  isLast = false,
}: {
  title: string;
  date: string | null;
  completed: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${completed ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
        >
          {completed ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 ${completed ? "bg-primary" : "bg-muted"}`}
          />
        )}
      </div>
      <div className="pb-4">
        <p className={`font-medium ${!completed && "text-muted-foreground"}`}>
          {title}
        </p>
        {date && (
          <p className="text-sm text-muted-foreground">
            {format(new Date(date), "MMM d, yyyy 'at' h:mm a")}
          </p>
        )}
      </div>
    </div>
  );
}
