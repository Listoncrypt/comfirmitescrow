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
  Users,
  FileText,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get stats
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalDeals } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true });

  const { count: activeDisputes } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true })
    .eq("status", "disputed");

  const { count: pendingWithdrawals } = await supabase
    .from("withdrawals")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Get total escrow value (Deals + User Balances)
  const { data: fundedDeals } = await supabase
    .from("deals")
    .select("amount")
    .in("status", ["funded", "in_escrow", "delivered", "disputed"]);

  const { data: userBalances } = await supabase
    .from("profiles")
    .select("balance");

  const dealsValue =
    fundedDeals?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

  const balancesValue =
    userBalances?.reduce((sum, p) => sum + (p.balance || 0), 0) || 0;

  const totalEscrow = dealsValue + balancesValue;

  // Get recent deals
  const { data: recentDeals } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get recent disputes
  const { data: recentDisputes } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "disputed")
    .order("disputed_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of platform activity and key metrics
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Disputes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {activeDisputes || 0}
            </div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Escrow Holdings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalEscrow.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">In deals & wallets</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Deals</CardTitle>
              <CardDescription>Latest platform transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/deals">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentDeals && recentDeals.length > 0 ? (
              <div className="space-y-4">
                {recentDeals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/admin/deals/${deal.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-sm">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(deal.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {deal.status}
                      </Badge>
                      <span className="text-sm font-medium">
                        ₦{deal.amount?.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No deals yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Active Disputes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Active Disputes
                {(activeDisputes || 0) > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {activeDisputes}
                  </span>
                )}
              </CardTitle>
              <CardDescription>Requires admin resolution</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/disputes">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentDisputes && recentDisputes.length > 0 ? (
              <div className="space-y-4">
                {recentDisputes.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/admin/deals/${deal.id}`}
                    className="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-3 transition-colors hover:bg-destructive/10"
                  >
                    <div>
                      <p className="font-medium text-sm">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {deal.disputed_at &&
                          formatDistanceToNow(new Date(deal.disputed_at), {
                            addSuffix: true,
                          })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ₦{deal.amount?.toFixed(2)}
                      </span>
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No active disputes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Withdrawals Alert */}
      {(pendingWithdrawals || 0) > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Pending Withdrawals</p>
                <p className="text-sm text-muted-foreground">
                  {pendingWithdrawals} withdrawal requests need review
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/admin/withdrawals">Review</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

