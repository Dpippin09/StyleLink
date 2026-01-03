import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Define which routes require authentication
const protectedRoutes = [
  '/user-profile',
  '/wishlist',
  '/cart'
]

// Define which routes should redirect authenticated users away
const authRoutes = [
  '/auth'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value
  
  // Verify the token
  const user = token ? verifyToken(token) : null
  
  // If accessing a protected route without authentication, redirect to auth
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // If accessing auth route while authenticated, redirect to home
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
