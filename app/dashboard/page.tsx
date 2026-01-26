import React from "react"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusConfig = {
  pending_seller: {
    label: "Awaiting Seller",
    variant: "secondary" as const,
    icon: Clock,
  },
  pending_buyer: {
    label: "Awaiting Buyer",
    variant: "secondary" as const,
    icon: Clock,
  },
  funded: {
    label: "Funded",
    variant: "default" as const,
    icon: CheckCircle2,
  },
  delivered: {
    label: "Delivered",
    variant: "default" as const,
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    variant: "default" as const,
    icon: CheckCircle2,
  },
  disputed: {
    label: "Disputed",
    variant: "destructive" as const,
    icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    variant: "outline" as const,
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    variant: "outline" as const,
    icon: ArrowDownRight,
  },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user's deals (as buyer or seller)
  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(5);

  // Calculate stats
  const { data: allDeals } = await supabase
    .from("deals")
    .select("status, amount, buyer_id, seller_id")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

  const stats = {
    totalDeals: allDeals?.length || 0,
    activeDeals:
      allDeals?.filter(
        (d) =>
          !["completed", "cancelled", "refunded"].includes(d.status as string)
      ).length || 0,
    completedDeals:
      allDeals?.filter((d) => d.status === "completed").length || 0,
    totalVolume:
      allDeals
        ?.filter((d) => d.status === "completed")
        .reduce((sum, d) => sum + (d.amount || 0), 0) || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your deals today.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/deals/new">
            <Plus className="mr-2 h-4 w-4" />
            New Deal
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <span className="text-2xl">₦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{profile?.balance?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Available to withdraw</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeals}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedDeals}</div>
            <p className="text-xs text-muted-foreground">Successful deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stats.totalVolume.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>
              Your latest transactions and their status
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/deals">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {deals && deals.length > 0 ? (
            <div className="space-y-4">
              {deals.map((deal) => {
                const status =
                  statusConfig[deal.status as keyof typeof statusConfig];
                const isBuyer = deal.buyer_id === user.id;
                const StatusIcon = status?.icon || Clock;

                return (
                  <Link
                    key={deal.id}
                    href={`/dashboard/deals/${deal.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${isBuyer ? "bg-blue-500/10" : "bg-green-500/10"
                          }`}
                      >
                        {isBuyer ? (
                          <ArrowUpRight
                            className={`h-5 w-5 ${isBuyer ? "text-blue-500" : "text-green-500"
                              }`}
                          />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{deal.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {isBuyer ? "Buying" : "Selling"} •{" "}
                          {formatDistanceToNow(new Date(deal.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={status?.variant || "secondary"}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status?.label || deal.status}
                      </Badge>
                      <span className="font-semibold">
                        ₦{deal.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-medium">No deals yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first deal to get started
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/deals/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Deal
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
