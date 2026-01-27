"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Loader2, DollarSign, Shield, Building2, Trash2, AlertCircle } from "lucide-react";
import { updateUserBalance, updateUserRole, updateUserBankDetails, deleteUser } from "@/lib/actions/admin";

interface AdminUserActionsProps {
  user: any;
  onSuccess?: () => void;
}

export function AdminUserActions({ user, onSuccess }: AdminUserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [newBalance, setNewBalance] = useState(user.balance?.toString() || "0");

  const [bankOpen, setBankOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bank_name: user.bank_name || "",
    account_number: user.account_number || "",
    account_name: user.account_name || "",
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const router = useRouter();

  async function handleUpdateBalance() {
    setIsLoading(true);
    const result = await updateUserBalance(user.id, parseFloat(newBalance));
    if (result?.error) {
      alert(result.error);
    }
    setIsLoading(false);
    setBalanceOpen(false);
    router.refresh();
  }

  async function handleUpdateBankDetails() {
    setIsLoading(true);
    const result = await updateUserBankDetails(user.id, bankDetails);
    if (result?.error) {
      alert(result.error);
    }
    setIsLoading(false);
    setBankOpen(false);
    router.refresh();
  }

  async function handleDeleteUser() {
    setIsLoading(true);
    const result = await deleteUser(user.id, adminKey);
    if (result?.error) {
      alert(result.error);
    } else {
      setDeleteOpen(false);
      setAdminKey("");

      // Refresh data
      router.refresh();

      // Call success callback (to clear search, etc.)
      if (onSuccess) {
        onSuccess();
        // Force fully reload page to ensure search state is cleared
        window.location.reload();
      }
    }
    setIsLoading(false);
  }

  async function handleToggleAdmin() {
    setIsLoading(true);
    const newRole = user.role === "admin" ? "user" : "admin";
    const result = await updateUserRole(user.id, newRole);
    if (result?.error) {
      alert(result.error);
    }
    setIsLoading(false);
    router.refresh();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setBalanceOpen(true)}>
            <DollarSign className="mr-2 h-4 w-4" />
            Update Balance
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setBankOpen(true)}>
            <Building2 className="mr-2 h-4 w-4" />
            Edit Bank Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleAdmin}>
            <Shield className="mr-2 h-4 w-4" />
            {user.role === "admin" ? "Remove Admin" : "Make Admin"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Balance Dialog */}
      <Dialog open={balanceOpen} onOpenChange={setBalanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Balance</DialogTitle>
            <DialogDescription>
              Set a new balance for {user.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="balance">New Balance (NGN)</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBalanceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBalance} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bank Details Dialog */}
      <Dialog open={bankOpen} onOpenChange={setBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Bank Details</DialogTitle>
            <DialogDescription>
              Edit bank information for {user.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={bankDetails.bank_name}
                onChange={(e) => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
                placeholder="e.g. First Bank"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={bankDetails.account_number}
                onChange={(e) => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                placeholder="0123456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={bankDetails.account_name}
                onChange={(e) => setBankDetails({ ...bankDetails, account_name: e.target.value })}
                placeholder="Account Holder Name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBankOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBankDetails} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Details"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-destructive">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{user.full_name}</strong>?
              This action cannot be undone. Enter the Admin Key to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminKey">Admin Key</Label>
              {/* Hidden input to trick browser autofill heuristics */}
              <input type="text" name="fake-username" style={{ display: "none" }} autoComplete="username" />
              <Input
                id="adminKey"
                type="password"
                autoComplete="new-password"
                data-1p-ignore
                placeholder="Enter unique delete key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} disabled={isLoading} variant="destructive">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
