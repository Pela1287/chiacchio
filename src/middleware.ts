/* ============================================
   CHIACCHIO - Middleware de Autenticación
   ============================================ */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Por ahora, dejar pasar todo
  // La protección se hace en cada página
  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*'],
};
