import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "./lib/supabase/server"

// Change the middleware function to include public routes
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup") ||
    req.nextUrl.pathname.startsWith("/forgot-password") ||
    req.nextUrl.pathname.startsWith("/reset-password")

  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")

  // Public routes that don't require authentication
  const isPublicRoute =
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/catalog") ||
    req.nextUrl.pathname.startsWith("/pricing") ||
    req.nextUrl.pathname.startsWith("/docs")

  // If accessing a protected route without being logged in
  if (!session && !isAuthRoute && !isApiAuthRoute && !isPublicRoute) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing auth routes while logged in
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
