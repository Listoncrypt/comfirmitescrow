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
import { DollarSign, User, FileText } from "lucide-react";
import { AcceptInviteButton } from "@/components/accept-invite-button";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the deal by invite code
  const { data: deal, error } = await supabase
    .from("deals")
    .select("*")
    .eq("invite_code", code)
    .single();

  if (error || !deal) {
    // Show a friendly error page instead of 404
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Invalid Invite Link</CardTitle>
            <CardDescription>
              This invite link is invalid or has expired. Please ask the deal creator for a new link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Error: {error?.message || "Deal not found"}
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if deal can still accept invites
  if (deal.buyer_id && deal.seller_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Deal Already Full</CardTitle>
            <CardDescription>
              This deal already has both parties. You cannot join.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get creator's profile
  const creatorId = deal.buyer_id || deal.seller_id;
  const { data: creator } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", creatorId)
    .single();

  const roleNeeded = deal.status === "draft" ? "Seller" : "Buyer";

  // If not logged in, redirect to register with return URL
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>You're Invited to a Deal</CardTitle>
            <CardDescription>
              Sign in or create an account to join this escrow transaction.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted p-4 space-y-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{deal.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">₦{deal.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    From: {creator?.full_name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-primary/10 p-3">
              <p className="text-sm text-center">
                You will join as the <strong>{roleNeeded}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href={`/register?redirect=/invite/${code}`}>
                  Create Account
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/login?redirect=/invite/${code}`}>
                  Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is already part of this deal
  if (deal.buyer_id === user.id || deal.seller_id === user.id) {
    redirect(`/dashboard/deals/${deal.id}`);
  }

  // Check if user's email matches the counterparty email
  const counterpartyEmail = (deal as any).counterparty_email;
  const emailMatches = !counterpartyEmail || user.email?.toLowerCase() === counterpartyEmail.toLowerCase();

  if (!emailMatches) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Wrong Account</CardTitle>
            <CardDescription>
              This invitation was sent to a different email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-destructive/10 p-4">
              <p className="text-sm text-center">
                This deal invitation was sent to <strong>{counterpartyEmail}</strong>.
              </p>
              <p className="text-sm text-center mt-2 text-muted-foreground">
                You are currently signed in as <strong>{user.email}</strong>.
              </p>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Please sign out and create an account or sign in with the correct email address.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Sign in with different account</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Join Deal</CardTitle>
          <CardDescription>
            Review the deal details and accept to join as the {roleNeeded.toLowerCase()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{deal.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{deal.description}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-xl font-bold">₦{deal.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="rounded-lg bg-primary/10 p-3">
            <p className="text-sm text-center">
              By accepting, you agree to join as the <strong>{roleNeeded}</strong>
            </p>
          </div>

          <AcceptInviteButton dealId={deal.id} />

          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
