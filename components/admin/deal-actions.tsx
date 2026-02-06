"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { resolveDispute } from "@/lib/actions/admin";

interface AdminDealActionsProps {
  deal: any;
}

export function AdminDealActions({ deal }: AdminDealActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resolution, setResolution] = useState<string>("release_to_seller");
  const [splitPercentage, setSplitPercentage] = useState("50");
  const router = useRouter();

  async function handleResolve() {
    setIsLoading(true);

    const result = await resolveDispute(
      deal.id,
      resolution as "release_to_seller" | "refund_to_buyer" | "split",
      resolution === "split" ? parseFloat(splitPercentage) : undefined
    );

    if (result?.error) {
      alert(result.error);
    }

    setIsLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <RadioGroup value={resolution} onValueChange={setResolution}>
        <div className="flex items-center space-x-2 rounded-lg border p-4">
          <RadioGroupItem value="release_to_seller" id="release" />
          <Label htmlFor="release" className="flex-1 cursor-pointer">
            <span className="font-medium">Release to Seller</span>
            <p className="text-sm text-muted-foreground">
              Release ₦{deal.amount?.toFixed(2)} to the seller's balance
            </p>
          </Label>
        </div>

        <div className="flex items-center space-x-2 rounded-lg border p-4">
          <RadioGroupItem value="refund_to_buyer" id="refund" />
          <Label htmlFor="refund" className="flex-1 cursor-pointer">
            <span className="font-medium">Refund to Buyer</span>
            <p className="text-sm text-muted-foreground">
              Refund ₦{deal.amount?.toFixed(2)} to the buyer's balance
            </p>
          </Label>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="split" id="split" />
            <Label htmlFor="split" className="flex-1 cursor-pointer">
              <span className="font-medium">Split Amount</span>
              <p className="text-sm text-muted-foreground">
                Divide the funds between both parties
              </p>
            </Label>
          </div>
          {resolution === "split" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="buyerPercent">Buyer Gets (%)</Label>
                <Input
                  id="buyerPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={splitPercentage}
                  onChange={(e) => setSplitPercentage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  ₦{((deal.amount || 0) * (parseFloat(splitPercentage) / 100)).toFixed(2)}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Seller Gets (%)</Label>
                <Input
                  type="number"
                  value={100 - parseFloat(splitPercentage)}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  ₦{((deal.amount || 0) * ((100 - parseFloat(splitPercentage)) / 100)).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </RadioGroup>

      <Button onClick={handleResolve} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resolving...
          </>
        ) : (
          "Resolve Dispute"
        )}
      </Button>
    </div>
  );
}

