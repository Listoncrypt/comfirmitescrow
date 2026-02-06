import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as "recovery" | "signup" | "email" | null;
    const next = searchParams.get("next") ?? "/dashboard";

    if (token_hash && type) {
        const supabase = await createClient();
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
        });

        if (!error) {
            // For password recovery, redirect to reset password page
            if (type === "recovery") {
                return NextResponse.redirect(`${origin}/reset-password`);
            }
            // For other types (signup, email change), redirect to next
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/error`);
}

