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
import { MoreHorizontal, Loader2, DollarSign, Shield } from "lucide-react";
import { updateUserBalance, updateUserRole } from "@/lib/actions/admin";

interface AdminUserActionsProps {
  user: any;
}

export function AdminUserActions({ user }: AdminUserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [newBalance, setNewBalance] = useState(user.balance?.toString() || "0");
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
          <DropdownMenuItem onClick={handleToggleAdmin}>
            <Shield className="mr-2 h-4 w-4" />
            {user.role === "admin" ? "Remove Admin" : "Make Admin"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    </>
  );
}
