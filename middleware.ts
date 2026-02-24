import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function isApi(pathname: string) {
  return pathname.startsWith("/api/");
}

function jsonUnauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function jsonForbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Dejar pasar auth, assets, next internals
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Solo proteger panel y APIs internas
  const shouldProtect =
    pathname.startsWith("/panel") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/super") ||
    pathname.startsWith("/api/cliente");

  if (!shouldProtect) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // No autenticado
  if (!token) {
    if (isApi(pathname)) return jsonUnauthorized();
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  const role = (token as any).role as string | undefined;

  // SUPER: puede TODO
  if (role === "SUPER") return NextResponse.next();

  // SUPER routes
  if (pathname.startsWith("/panel/super") || pathname.startsWith("/api/super")) {
    if (isApi(pathname)) return jsonForbidden();
    const url = req.nextUrl.clone();
    url.pathname = "/panel";
    return NextResponse.redirect(url);
  }

  // ADMIN routes (ADMIN puede admin)
  if (pathname.startsWith("/panel/admin") || pathname.startsWith("/api/admin")) {
    if (role === "ADMIN") return NextResponse.next();
    if (isApi(pathname)) return jsonForbidden();
    const url = req.nextUrl.clone();
    url.pathname = "/panel";
    return NextResponse.redirect(url);
  }

  // CLIENTE routes (solo CLIENTE)
  if (pathname.startsWith("/panel/cliente") || pathname.startsWith("/api/cliente")) {
    if (role === "CLIENTE") return NextResponse.next();
    if (isApi(pathname)) return jsonForbidden();
    const url = req.nextUrl.clone();
    url.pathname = "/panel";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/api/admin/:path*", "/api/super/:path*", "/api/cliente/:path*"],
};