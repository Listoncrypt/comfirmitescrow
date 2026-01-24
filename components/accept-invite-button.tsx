"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { acceptDealInvite } from "@/lib/actions/deals";

export function AcceptInviteButton({ dealId }: { dealId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setIsLoading(true);
    setError(null);

    try {
      await acceptDealInvite(dealId);
      // If we reach here, there was an error (redirect would have happened)
    } catch (err: any) {
      // Server action will redirect on success, only handle errors
      if (err?.message && !err.message.includes("NEXT_REDIRECT")) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
      <Button onClick={handleAccept} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Accept & Join Deal"
        )}
      </Button>
    </div>
  );
}
