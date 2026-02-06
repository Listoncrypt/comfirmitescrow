import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  // Use configured app URL if available (fixes localhost redirect on production)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
    : origin;

  const supabase = await createClient();

  // Handle password recovery with token_hash (from email link)
  if (token_hash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: "recovery",
    });

    if (!error) {
      // Redirect to reset password page
      return NextResponse.redirect(`${appUrl}/reset-password`);
    }
  }

  // Handle code-based verification (sign up confirmation, magic links)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if this is a password reset flow
      if (next === "/reset-password") {
        return NextResponse.redirect(`${appUrl}/reset-password`);
      }
      return NextResponse.redirect(`${appUrl}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${appUrl}/auth/error`);
}

