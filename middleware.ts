import { NextRequest, NextResponse } from "next/server"

// Public routes accessible without auth
const PUBLIC_ROUTES = [
  "/login",
  "/showcase",
  "/about",
  "/contact",
  "/reset-password",
]

// Only run middleware on certain paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/meetings/:path*",
    "/actions/:path*",
    "/business-goals/:path*",
    "/analytics/:path*",
    "/admin/:path*",
    "/settings/:path*",
  ],
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Skip token check — client-side will handle it
  return NextResponse.next()
}
