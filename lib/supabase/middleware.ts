import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/verify-email", "/auth/callback"]
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith("/auth/")
  )

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin")

  // Protected routes (dashboard, deals, etc.)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/deals") ||
    pathname.startsWith("/withdrawals") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/chat")

  // If user is not authenticated and trying to access protected/admin routes
  if (!user && (isProtectedRoute || isAdminRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated, check if their profile still exists (account may have been deleted)
  if (user && (isProtectedRoute || isAdminRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single()

    if (!profile) {
      // Profile was deleted - sign them out and redirect to login
      await supabase.auth.signOut({ scope: 'local' })
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("error", "account_deleted")
      return NextResponse.redirect(url)
    }
  }

  // If user is authenticated
  if (user) {
    // Check email verification status
    const isEmailVerified = user.email_confirmed_at !== null

    // TEMPORARILY DISABLED: Email verification check
    // This allows users to access dashboard without email confirmation
    // TODO: Re-enable after fixing the white screen issue
    // if (!isEmailVerified && !pathname.startsWith("/verify-email") && isProtectedRoute) {
    //   const url = request.nextUrl.clone()
    //   url.pathname = "/verify-email"
    //   return NextResponse.redirect(url)
    // }

    // Check user role for admin routes
    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profile || profile.role !== "admin") {
        const url = request.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
      }
    }

    // Redirect admin users away from regular dashboard to admin dashboard
    if (pathname === "/dashboard") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role === "admin") {
        const url = request.nextUrl.clone()
        url.pathname = "/admin"
        return NextResponse.redirect(url)
      }
    }

    // Redirect authenticated users away from login/register
    if (pathname === "/login" || pathname === "/register") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
