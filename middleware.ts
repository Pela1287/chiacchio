import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimit } from '@/lib/rate-limit';

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

function jsonUnauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}
function jsonForbidden() {
  return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
}
function jsonTooMany() {
  return NextResponse.json(
    { error: 'Demasiados intentos. Esperá unos minutos.' },
    { status: 429, headers: { 'Retry-After': '60' } }
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getIp(req);

  // ── Rate limiting ────────────────────────────────────────
  // Login: 8 intentos por minuto por IP
  if (pathname === '/api/auth/callback/credentials' && req.method === 'POST') {
    if (!rateLimit(`login:${ip}`, 8, 60_000)) return jsonTooMany();
  }
  // Registro: 3 registros por hora por IP
  if (pathname === '/api/auth/registro' && req.method === 'POST') {
    if (!rateLimit(`register:${ip}`, 3, 60 * 60_000)) return jsonTooMany();
  }
  // APIs generales: 120 req/min por IP
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (!rateLimit(`api:${ip}`, 120, 60_000)) return jsonTooMany();
  }

  // ── Rutas públicas ───────────────────────────────────────
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  const shouldProtect =
    pathname.startsWith('/panel') ||
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/api/super') ||
    pathname.startsWith('/api/cliente');

  if (!shouldProtect) return NextResponse.next();

  // ── Validar sesión ───────────────────────────────────────
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (pathname.startsWith('/api/')) return jsonUnauthorized();
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  const role = (token.role as string | undefined)?.toUpperCase();

  // SUPER tiene acceso a todo
  if (role === 'SUPER') return NextResponse.next();

  // Zona SUPER: solo SUPER
  if (pathname.startsWith('/panel/super') || pathname.startsWith('/api/super')) {
    if (pathname.startsWith('/api/')) return jsonForbidden();
    const url = req.nextUrl.clone();
    url.pathname = '/panel';
    return NextResponse.redirect(url);
  }

  // Zona ADMIN
  if (pathname.startsWith('/panel/admin') || pathname.startsWith('/api/admin')) {
    if (role === 'ADMIN') return NextResponse.next();
    if (pathname.startsWith('/api/')) return jsonForbidden();
    const url = req.nextUrl.clone();
    url.pathname = '/panel';
    return NextResponse.redirect(url);
  }

  // Zona CLIENTE
  if (pathname.startsWith('/panel/cliente') || pathname.startsWith('/api/cliente')) {
    if (role === 'CLIENTE') return NextResponse.next();
    if (pathname.startsWith('/api/')) return jsonForbidden();
    const url = req.nextUrl.clone();
    url.pathname = '/panel';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/panel/:path*',
    '/api/admin/:path*',
    '/api/super/:path*',
    '/api/cliente/:path*',
    '/api/auth/callback/credentials',
    '/api/auth/registro',
  ],
};
