"use client";

import { Button } from "@/components/ui/button";
import { cancelWithdrawal } from "@/lib/actions/withdrawals";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface WithdrawalCancelButtonProps {
  withdrawalId: string;
}

export function WithdrawalCancelButton({ withdrawalId }: WithdrawalCancelButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this withdrawal?")) return;
    
    setIsLoading(true);
    const result = await cancelWithdrawal(withdrawalId);
    
    if (result.error) {
      alert(result.error);
    }
    
    setIsLoading(false);
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCancel}
      disabled={isLoading}
      className="text-destructive hover:text-destructive"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </>
      )}
    </Button>
  );
}

