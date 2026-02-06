"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { processWithdrawal } from "@/lib/actions/admin";
import { CheckCircle, XCircle, Loader2, Upload, FileText, X } from "lucide-react";
import Image from "next/image";

interface WithdrawalActionsProps {
  withdrawalId: string;
  amount: number;
  userName?: string;
}

export function WithdrawalActions({ withdrawalId, amount, userName }: WithdrawalActionsProps) {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Proof of Payment State
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
      setError(null);
    }
  }

  function clearFile() {
    setProofFile(null);
    setProofPreview(null);
  }

  async function handleApprove() {
    setApproving(true);
    setError(null);
    let proofUrl = undefined;

    // Upload proof if selected
    if (proofFile) {
      setUploading(true);
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `withdrawals/${withdrawalId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-images') // Using existing bucket
        .upload(fileName, proofFile);

      if (uploadError) {
        setUploading(false);
        setApproving(false);
        setError("Failed to upload proof of payment: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      proofUrl = data.publicUrl;
      setUploading(false);
    }

    const result = await processWithdrawal(withdrawalId, "approve", undefined, proofUrl);

    if (result.error) {
      setError(result.error);
      setApproving(false);
    } else {
      setSuccessMessage(result.message || "Withdrawal approved successfully");
      setApproveOpen(false);
      setApproving(false);
      router.refresh();
      // Reset state
      setProofFile(null);
      setProofPreview(null);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    setRejecting(true);
    setError(null);

    const result = await processWithdrawal(withdrawalId, "reject", rejectReason);

    if (result.error) {
      setError(result.error);
      setRejecting(false);
    } else {
      setRejectOpen(false);
      setRejecting(false);
      router.refresh();
    }
  }

  // Calculate fee for display
  const fee = amount * 0.025;
  const amountToSend = amount - fee;

  return (
    <div className="flex gap-2">
      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={(open) => {
        setApproveOpen(open);
        if (!open) {
          setError(null);
          clearFile();
        }
      }}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark Successful
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Withdrawal as Successful</DialogTitle>
            <DialogDescription>
              Confirm that you have sent the money to the user&apos;s bank account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Withdrawal Amount:</span>
                <span className="font-medium">₦{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee (2.5%):</span>
                <span className="font-medium text-red-500">-₦{fee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">Amount to Send:</span>
                <span className="font-bold text-emerald-600">₦{amountToSend.toLocaleString()}</span>
              </div>
            </div>

            {/* Proof of Payment Upload */}
            <div className="space-y-2 border-t pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="proof" className="text-sm font-medium">Proof of Payment</Label>
                {!proofFile && (
                  <label htmlFor="proof-upload" className="cursor-pointer text-sm text-primary hover:underline flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    Attach Screenshot
                  </label>
                )}
              </div>

              <input
                id="proof-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />

              {proofFile && (
                <div className="relative border rounded-lg p-2 flex items-center gap-3 bg-muted/30">
                  {proofPreview ? (
                    <div className="h-10 w-10 relative shrink-0 rounded overflow-hidden border">
                      <Image
                        src={proofPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <FileText className="h-8 w-8 text-primary" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate max-w-[180px]">{proofFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(proofFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFile}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              By clicking confirm, you acknowledge that you have sent ₦{amountToSend.toLocaleString()} to the user.
            </p>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setApproveOpen(false);
              clearFile();
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={approving || uploading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {approving || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploading ? "Uploading Proof..." : "Processing..."}
                </>
              ) : (
                "Confirm & Mark Successful"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="text-red-500 border-red-500/50 hover:bg-red-500/10 bg-transparent">
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this withdrawal. The user&apos;s balance will NOT be affected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejecting}
              variant="destructive"
            >
              {rejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

