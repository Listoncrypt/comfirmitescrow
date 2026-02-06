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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow, format } from "date-fns";
import { Suspense } from "react";

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

export default async function DealsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get all user's deals
  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const activeDeals = deals?.filter(
    (d) => !["completed", "cancelled", "refunded"].includes(d.status as string)
  );
  const completedDeals = deals?.filter(
    (d) => d.status === "completed" || d.status === "cancelled" || d.status === "refunded"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Deals</h1>
          <p className="text-muted-foreground">
            Manage and track all your escrow transactions
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/deals/new">
            <Plus className="mr-2 h-4 w-4" />
            New Deal
          </Link>
        </Button>
      </div>

      <Suspense fallback={null}>
        <Tabs defaultValue="active" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="active">
                Active ({activeDeals?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedDeals?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="all">All ({deals?.length || 0})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="space-y-4">
            <DealsList deals={activeDeals || []} userId={user.id} />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <DealsList deals={completedDeals || []} userId={user.id} />
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <DealsList deals={deals || []} userId={user.id} />
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  );
}

function DealsList({
  deals,
  userId,
}: {
  deals: any[];
  userId: string;
}) {
  if (deals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-medium">No deals found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a new deal or wait for an invitation
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/deals/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Deal
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {deals.map((deal) => {
        const status = statusConfig[deal.status as keyof typeof statusConfig];
        const isBuyer = deal.buyer_id === userId;
        const StatusIcon = status?.icon || Clock;

        return (
          <Link
            key={deal.id}
            href={`/dashboard/deals/${deal.id}`}
            className="block"
          >
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${isBuyer ? "bg-blue-500/10" : "bg-green-500/10"
                      }`}
                  >
                    {isBuyer ? (
                      <ArrowUpRight className="h-6 w-6 text-blue-500" />
                    ) : (
                      <ArrowDownRight className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{deal.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{isBuyer ? "Buying" : "Selling"}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(deal.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={status?.variant || "secondary"}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status?.label || deal.status}
                  </Badge>
                  <span className="text-lg font-semibold">
                    ₦{deal.amount?.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

