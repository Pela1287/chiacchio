/* ============================================
   CHIACCHIO - Middleware de Autenticación
   ============================================ */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/panel')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = (token.role as string)?.toLowerCase();

    if (pathname.startsWith('/panel/super') && userRole !== 'super') {
      return NextResponse.redirect(new URL('/panel/cliente', request.url));
    }

    if (pathname.startsWith('/panel/admin') && userRole !== 'super' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/panel/cliente', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*'],
};
