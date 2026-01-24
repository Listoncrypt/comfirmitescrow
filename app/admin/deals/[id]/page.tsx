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
  User,
  Calendar,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { AdminDealActions } from "@/components/admin/deal-actions";
import { DealChat } from "@/components/dashboard/deal-chat";

const statusConfig = {
  pending_seller: {
    label: "Awaiting Seller",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-yellow-500",
  },
  pending_buyer: {
    label: "Awaiting Buyer",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-yellow-500",
  },
  funded: {
    label: "Funded",
    variant: "default" as const,
    icon: CheckCircle2,
    color: "text-blue-500",
  },
  delivered: {
    label: "Delivered",
    variant: "default" as const,
    icon: CheckCircle2,
    color: "text-blue-500",
  },
  completed: {
    label: "Completed",
    variant: "default" as const,
    icon: CheckCircle2,
    color: "text-green-500",
  },
  disputed: {
    label: "Disputed",
    variant: "destructive" as const,
    icon: AlertCircle,
    color: "text-red-500",
  },
  cancelled: {
    label: "Cancelled",
    variant: "outline" as const,
    icon: XCircle,
    color: "text-gray-500",
  },
  refunded: {
    label: "Refunded",
    variant: "outline" as const,
    icon: XCircle,
    color: "text-gray-500",
  },
};

export default async function AdminDealDetailPage({
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

  // Get the deal with related profiles
  const { data: deal, error } = await supabase
    .from("deals")
    .select(
      "*, buyer:profiles!deals_buyer_id_fkey(full_name, email), seller:profiles!deals_seller_id_fkey(full_name, email)"
    )
    .eq("id", id)
    .single();

  if (error || !deal) {
    notFound();
  }

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender:profiles!sender_id(full_name)")
    .eq("deal_id", id)
    .order("created_at", { ascending: true });

  const status = statusConfig[deal.status as keyof typeof statusConfig];
  const StatusIcon = status?.icon || Clock;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/deals">
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
          {/* Admin Actions for Disputes */}
          {deal.status === "disputed" && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Dispute Resolution Required
                </CardTitle>
                <CardDescription>
                  Review the dispute and choose a resolution
                </CardDescription>
              </CardHeader>
              <CardContent>
                {deal.dispute_reason && (
                  <div className="mb-4 rounded-lg bg-background p-4">
                    <p className="text-sm font-medium mb-1">Dispute Reason:</p>
                    <p className="text-sm text-muted-foreground">
                      {deal.dispute_reason}
                    </p>
                  </div>
                )}
                <AdminDealActions deal={deal} />
              </CardContent>
            </Card>
          )}

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
                      ₦{deal.amount?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {format(new Date(deal.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-blue-500/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Buyer</span>
                  </div>
                  <p className="font-medium">
                    {deal.buyer?.full_name || "Pending"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {deal.buyer?.email}
                  </p>
                </div>

                <div className="rounded-lg bg-green-500/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Seller</span>
                  </div>
                  <p className="font-medium">
                    {deal.seller?.full_name || "Pending"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {deal.seller?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat - Admin can participate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Deal Chat
              </CardTitle>
              <CardDescription>
                Chat with buyer and seller - you can participate as Admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DealChat
                dealId={deal.id}
                userId={user.id}
                buyerId={deal.buyer_id}
                sellerId={deal.seller_id}
                isAdmin={true}
              />
            </CardContent>
          </Card>

          {/* Admin Deal Control */}
          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <AlertCircle className="h-5 w-5" />
                Deal Control
              </CardTitle>
              <CardDescription>
                Complete, cancel, or archive this deal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Once payment is confirmed, use the buttons below to finalize the deal.
                </p>
                <AdminDealActions deal={deal} />
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
}

function TimelineItem({
  title,
  date,
  completed,
  isLast = false,
  isError = false,
}: {
  title: string;
  date: string | null;
  completed: boolean;
  isLast?: boolean;
  isError?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${isError
            ? "bg-destructive text-destructive-foreground"
            : completed
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
            }`}
        >
          {isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : completed ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 ${isError ? "bg-destructive" : completed ? "bg-primary" : "bg-muted"
              }`}
          />
        )}
      </div>
      <div className="pb-4">
        <p
          className={`font-medium ${isError
            ? "text-destructive"
            : !completed
              ? "text-muted-foreground"
              : ""
            }`}
        >
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
