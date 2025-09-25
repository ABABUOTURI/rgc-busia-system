import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/'];
  
  // Admin routes that require admin role
  const adminRoutes = ['/admin'];
  
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // For admin routes, let client-side verify role
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
