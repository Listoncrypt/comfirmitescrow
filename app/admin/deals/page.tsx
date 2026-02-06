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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ExternalLink, MessageSquare } from "lucide-react";
import { FinalizeDealButton } from "@/components/admin/finalize-deal-button";
import { SearchDeals } from "@/components/admin/search-deals";

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending_seller: "secondary",
  pending_buyer: "secondary",
  funded: "default",
  delivered: "default",
  completed: "default",
  disputed: "destructive",
  cancelled: "outline",
  refunded: "outline",
};

export default async function AdminDealsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get all deals with profiles
  const { data: deals } = await supabase
    .from("deals")
    .select("*, buyer:profiles!deals_buyer_id_fkey(full_name), seller:profiles!deals_seller_id_fkey(full_name)")
    .order("created_at", { ascending: false });

  const activeDeals = deals?.filter(
    (d) => !["completed", "cancelled", "refunded"].includes(d.status as string)
  );
  const completedDeals = deals?.filter(
    (d) => ["completed", "cancelled", "refunded"].includes(d.status as string)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Deals</h1>
          <p className="text-muted-foreground">
            View and manage all escrow transactions
          </p>
        </div>
        <SearchDeals />
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeDeals?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedDeals?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="all">All ({deals?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <DealsTable deals={activeDeals || []} />
        </TabsContent>

        <TabsContent value="completed">
          <DealsTable deals={completedDeals || []} />
        </TabsContent>

        <TabsContent value="all">
          <DealsTable deals={deals || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DealsTable({ deals }: { deals: any[] }) {
  if (deals.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No deals found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-xs text-muted-foreground">
                      #{deal.id.slice(0, 8)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {deal.buyer?.full_name || (
                    <span className="text-muted-foreground">Pending</span>
                  )}
                </TableCell>
                <TableCell>
                  {deal.seller?.full_name || (
                    <span className="text-muted-foreground">Pending</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  ₦{deal.amount?.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariants[deal.status] || "secondary"}>
                    {deal.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(deal.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <FinalizeDealButton
                      dealId={deal.id}
                      dealStatus={deal.status}
                      dealTitle={deal.title}
                    />
                    <Button variant="ghost" size="sm" asChild title="View Chat">
                      <Link href={`/admin/deals/${deal.id}#chat`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild title="View Details">
                      <Link href={`/admin/deals/${deal.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

