import React from "react"
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { InactivityLogout } from "@/components/inactivity-logout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profileError) {
    // Show error page instead of redirecting to prevent infinite loops
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-sm mb-4">
              Your account exists but has no profile in the database.
            </p>
            <p className="text-xs mb-4">
              Error: {profileError?.message || "Profile data is missing"}
            </p>
            <p className="text-xs">
              User ID: {user.id}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-left text-sm">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal ml-4 space-y-1 text-xs">
              <li>Open Supabase Dashboard</li>
              <li>Go to SQL Editor</li>
              <li>Run: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">INSERT INTO public.profiles (id, email, full_name) VALUES ('{user.id.slice(0, 20)}...', '{user.email}', 'Your Name');</code></li>
            </ol>
          </div>
          <a href="/login" className="block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  // If user is admin, redirect to admin dashboard
  if (profile.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-background">
      <InactivityLogout />
      <DashboardSidebar profile={profile} />
      <div className="lg:pl-72">
        <DashboardHeader profile={profile} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

