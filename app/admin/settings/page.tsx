import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Shield, Bell, DollarSign, CreditCard } from "lucide-react";
import { revalidatePath } from "next/cache";

async function updateSettings(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile as any).role !== "admin") return;

  // Get escrow payment settings (Bank + USDT)
  const escrowSettings = {
    escrow_bank_name: formData.get("escrow_bank_name") as string || "",
    escrow_account_number: formData.get("escrow_account_number") as string || "",
    escrow_account_name: formData.get("escrow_account_name") as string || "",
    escrow_instructions: formData.get("escrow_instructions") as string || "",
    usdt_network: formData.get("usdt_network") as string || "TRC20",
    usdt_wallet_address: formData.get("usdt_wallet_address") as string || "",
    updated_by: user.id,
  };

  // Update escrow settings in admin_settings table (direct columns)
  const { data: existingSettings } = await supabase
    .from("admin_settings")
    .select("id")
    .limit(1)
    .single();

  if (existingSettings) {
    // Update existing row
    await supabase
      .from("admin_settings")
      .update(escrowSettings as any)
      .eq("id", (existingSettings as any).id);
  } else {
    // Insert new row
    await supabase
      .from("admin_settings")
      .insert(escrowSettings as any);
  }

  // Also save other settings as key-value pairs
  const otherSettings = {
    platform_fee_percentage: parseFloat(formData.get("platform_fee") as string) || 2.5,
    min_deal_amount: parseFloat(formData.get("min_deal_amount") as string) || 10,
    max_deal_amount: parseFloat(formData.get("max_deal_amount") as string) || 100000,
    min_withdrawal_amount: parseFloat(formData.get("min_withdrawal") as string) || 10,
    maintenance_mode: formData.get("maintenance_mode") === "on",
    support_email: formData.get("support_email") as string,
    terms_url: formData.get("terms_url") as string,
  };

  // Log audit
  await supabase.from("admin_audit_log").insert({
    admin_id: user.id,
    action: "update_settings",
    target_type: "settings",
    target_id: "admin_settings",
    details: { ...escrowSettings, ...otherSettings },
  } as any);

  revalidatePath("/admin/settings");
  revalidatePath("/dashboard/make-payment");
}

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Get current settings from direct columns
  const { data: settingsData } = await supabase
    .from("admin_settings")
    .select("*")
    .limit(1)
    .single();

  // Map the direct column values to our settings object
  const settings: Record<string, string | number | boolean> = {
    escrow_bank_name: (settingsData as any)?.escrow_bank_name || "",
    escrow_account_number: (settingsData as any)?.escrow_account_number || "",
    escrow_account_name: (settingsData as any)?.escrow_account_name || "",
    escrow_instructions: (settingsData as any)?.escrow_instructions || "",
    usdt_network: (settingsData as any)?.usdt_network || "TRC20",
    usdt_wallet_address: (settingsData as any)?.usdt_wallet_address || "",
    // Default values for other settings (these could be added as columns later)
    platform_fee_percentage: 2.5,
    min_deal_amount: 10,
    max_deal_amount: 100000,
    min_withdrawal_amount: 10,
    maintenance_mode: false,
    support_email: "",
    terms_url: "/terms",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global platform settings</p>
      </div>

      <form action={updateSettings}>
        <div className="grid gap-6">
          {/* Fee Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Fee Configuration
              </CardTitle>
              <CardDescription>Set platform fees and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform_fee">Platform Fee (%)</Label>
                  <Input
                    id="platform_fee"
                    name="platform_fee"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    defaultValue={settings.platform_fee_percentage as number || 2.5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Fee charged on completed deals
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_deal_amount">Minimum Deal Amount (₦)</Label>
                  <Input
                    id="min_deal_amount"
                    name="min_deal_amount"
                    type="number"
                    min="1"
                    defaultValue={settings.min_deal_amount as number || 10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_deal_amount">Maximum Deal Amount (₦)</Label>
                  <Input
                    id="max_deal_amount"
                    name="max_deal_amount"
                    type="number"
                    min="100"
                    defaultValue={settings.max_deal_amount as number || 100000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_withdrawal">Minimum Withdrawal (₦)</Label>
                  <Input
                    id="min_withdrawal"
                    name="min_withdrawal"
                    type="number"
                    min="1"
                    defaultValue={settings.min_withdrawal_amount as number || 10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Account Settings - NEW */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Account Details
              </CardTitle>
              <CardDescription>
                Configure the escrow account details shown on the Make Payment page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="escrow_bank_name">Bank Name</Label>
                  <Input
                    id="escrow_bank_name"
                    name="escrow_bank_name"
                    placeholder="First Bank"
                    defaultValue={settings.escrow_bank_name as string || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escrow_account_number">Account Number</Label>
                  <Input
                    id="escrow_account_number"
                    name="escrow_account_number"
                    placeholder="1234567890"
                    defaultValue={settings.escrow_account_number as string || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escrow_account_name">Account Name</Label>
                  <Input
                    id="escrow_account_name"
                    name="escrow_account_name"
                    placeholder="Confirmit Escrow Ltd"
                    defaultValue={settings.escrow_account_name as string || ""}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                <div className="col-span-2">
                  <h4 className="text-sm font-medium mb-2">USDT Configuration (Optional)</h4>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usdt_network">Network</Label>
                  <Input
                    id="usdt_network"
                    name="usdt_network"
                    placeholder="TRC20"
                    defaultValue={settings.usdt_network as string || "TRC20"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usdt_wallet_address">Wallet Address</Label>
                  <Input
                    id="usdt_wallet_address"
                    name="usdt_wallet_address"
                    placeholder="TJ..."
                    defaultValue={settings.usdt_wallet_address as string || ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to disable crypto payments
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escrow_instructions">Payment Instructions</Label>
                <Textarea
                  id="escrow_instructions"
                  name="escrow_instructions"
                  placeholder="Please use your deal ID as payment reference..."
                  rows={3}
                  defaultValue={settings.escrow_instructions as string || ""}
                />
                <p className="text-xs text-muted-foreground">
                  This will be shown to users on the Make Payment page
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Platform Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Platform-wide configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable new signups and deal creation
                  </p>
                </div>
                <Switch
                  name="maintenance_mode"
                  defaultChecked={settings.maintenance_mode as boolean || false}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support_email">Support Email</Label>
                <Input
                  id="support_email"
                  name="support_email"
                  type="email"
                  placeholder="comfirmitescrow@gmail.com"
                  defaultValue={settings.support_email as string || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms_url">Terms of Service URL</Label>
                <Input
                  id="terms_url"
                  name="terms_url"
                  type="url"
                  placeholder="https://..."
                  defaultValue={settings.terms_url as string || ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Security and verification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Email Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Email verification is enabled by default through Supabase Auth.
                  Users must verify their email before creating deals.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Row Level Security</h4>
                <p className="text-sm text-muted-foreground">
                  All database tables have RLS policies enabled to ensure users
                  can only access their own data.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Save Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
