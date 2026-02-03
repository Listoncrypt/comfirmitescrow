"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SquaresFour,
  FileText,
  Wallet,
  Gear,
  SignOut,
  X,
  List,
  User,
  CreditCard,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signOut } from "@/lib/actions/auth";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: SquaresFour },
  { name: "My Deals", href: "/dashboard/deals", icon: FileText },
  { name: "Make Payment", href: "/dashboard/make-payment", icon: CreditCard },
  { name: "Withdrawals", href: "/dashboard/withdrawals", icon: Wallet },
  { name: "Account Info", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Gear },
];

interface DashboardSidebarProps {
  profile: Profile;
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <List size={24} weight="regular" />
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Confirmdeal Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-foreground">
                Confirmdeal
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={20} weight="regular" />
            </Button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                {profile.full_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile.email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-primary">
                ₦{profile.balance?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
              </div>
              <span className="text-xs text-muted-foreground">Balance</span>
            </div>

            {profile.bank_name && (
              <div className="pt-2 border-t">
                <p className="text-[10px] uppercase text-muted-foreground font-semibold">Linked Account</p>
                <p className="text-xs font-medium truncate" title={profile.bank_name}>
                  {profile.bank_name}
                </p>
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {profile.account_number}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon size={20} weight="duotone" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="border-t p-3">
            <form action={signOut}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              >
                <SignOut size={20} weight="duotone" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
