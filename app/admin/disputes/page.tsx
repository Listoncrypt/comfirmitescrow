import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, DollarSign, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default async function AdminDisputesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get all disputed deals
  const { data: disputes } = await supabase
    .from("deals")
    .select(
      "*, buyer:profiles!deals_buyer_id_fkey(full_name, email), seller:profiles!deals_seller_id_fkey(full_name, email)"
    )
    .eq("status", "disputed")
    .order("disputed_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Disputes</h1>
        <p className="text-muted-foreground">
          Review and resolve disputed transactions
        </p>
      </div>

      {disputes && disputes.length > 0 ? (
        <div className="space-y-4">
          {disputes.map((deal) => (
            <Card
              key={deal.id}
              className="border-destructive/50 bg-destructive/5"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                      <CardDescription>
                        Disputed{" "}
                        {deal.disputed_at &&
                          formatDistanceToNow(new Date(deal.disputed_at), {
                            addSuffix: true,
                          })}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="destructive">Needs Resolution</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">₦{deal.amount?.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Buyer</p>
                    <p className="font-medium">{deal.buyer?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Seller</p>
                    <p className="font-medium">{deal.seller?.full_name}</p>
                  </div>
                </div>

                {deal.dispute_reason && (
                  <div className="rounded-lg bg-background p-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Dispute Reason:
                    </p>
                    <p className="text-sm">{deal.dispute_reason}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button asChild>
                    <Link href={`/admin/deals/${deal.id}`}>
                      Review & Resolve
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-green-500/10 p-4">
              <AlertTriangle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="mt-4 font-medium">No Active Disputes</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              All transactions are running smoothly
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
