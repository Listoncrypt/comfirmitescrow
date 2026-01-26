"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createDeal } from "@/lib/actions/deals";

export default function NewDealPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("role", role);

    const result = await createDeal(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.dealId) {
      router.push(`/dashboard/deals/${result.dealId}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/deals">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Deal</h1>
          <p className="text-muted-foreground">
            Set up a new escrow transaction
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Deal Details</CardTitle>
          <CardDescription>
            Enter the details of your transaction. The other party will receive
            an invitation to join.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Your Role</Label>
              <Select
                value={role}
                onValueChange={(value: "buyer" | "seller") => setRole(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">
                    I am the Buyer (paying for goods/services)
                  </SelectItem>
                  <SelectItem value="seller">
                    I am the Seller (providing goods/services)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {role === "buyer"
                  ? "As the buyer, you will fund the escrow and confirm delivery."
                  : "As the seller, you will deliver the goods/services and receive payment."}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Deal Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Website Development Project"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the goods or services being exchanged..."
                rows={4}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amountDisplay">Amount (NGN)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">₦</span>
                  <Input
                    id="amountDisplay"
                    type="text"
                    placeholder="0.00"
                    className="pl-7"
                    required
                    disabled={isLoading}
                    onChange={(e) => {
                      // Remove non-numeric characters except decimal
                      const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                      // Split integer and decimal parts
                      const parts = rawValue.split('.');
                      // Format integer part with commas
                      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                      // Reassemble
                      e.target.value = parts.slice(0, 2).join('.');

                      // Update hidden input
                      const hiddenInput = document.getElementById('amount') as HTMLInputElement;
                      if (hiddenInput) {
                        hiddenInput.value = rawValue;
                      }
                    }}
                  />
                  <input type="hidden" id="amount" name="amount" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="counterpartyEmail">
                  {role === "buyer" ? "Seller's Email" : "Buyer's Email"}
                </Label>
                <Input
                  id="counterpartyEmail"
                  name="counterpartyEmail"
                  type="email"
                  placeholder="email@example.com"
                  required
                  disabled={isLoading}
                />

              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inspectionPeriod">Inspection Period (Days)</Label>
              <Select name="inspectionPeriod" defaultValue="3">
                <SelectTrigger>
                  <SelectValue placeholder="Select inspection period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="2">2 Days</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="5">5 Days</SelectItem>
                  <SelectItem value="7">7 Days (1 Week)</SelectItem>
                  <SelectItem value="14">14 Days (2 Weeks)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                The buyer has this many days to inspect the goods/services before confirming delivery.
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">How It Works</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Create the deal with the details above</li>
                <li>
                  The {role === "buyer" ? "seller" : "buyer"} receives an
                  invitation link to join
                </li>
                <li>
                  Both parties confirm the deal terms
                </li>
                <li>Buyer funds the escrow</li>
                <li>Seller delivers goods/services</li>
                <li>Buyer has the inspection period to review</li>
                <li>Buyer confirms delivery, funds released to seller</li>
              </ol>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Deal"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div >
  );
}
