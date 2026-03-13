// src/lib/api-auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

type Role = 'SUPER' | 'ADMIN' | 'CLIENTE';
const ROLE_LEVEL: Record<Role, number> = { CLIENTE: 1, ADMIN: 2, SUPER: 3 };

interface AuthResult {
  session: Awaited<ReturnType<typeof getServerSession>>;
  userId: string;
  role: Role;
  error?: never;
}
interface AuthError {
  error: NextResponse;
  session?: never;
  userId?: never;
  role?: never;
}

/**
 * Validates session and optionally enforces a minimum role.
 * Usage:
 *   const auth = await requireAuth('ADMIN');
 *   if (auth.error) return auth.error;
 *   // auth.userId, auth.role available
 */
export async function requireAuth(minRole?: Role): Promise<AuthResult | AuthError> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) };
  }

  const role = (session.user as any).role as Role;
  const userId = (session.user as any).id as string;

  if (minRole && (ROLE_LEVEL[role] ?? 0) < ROLE_LEVEL[minRole]) {
    return { error: NextResponse.json({ error: 'Acceso denegado' }, { status: 403 }) };
  }

  return { session, userId, role };
}

/**
 * Generic 500 response that never leaks internal details.
 */
export function serverError(msg = 'Error interno del servidor'): NextResponse {
  return NextResponse.json({ error: msg }, { status: 500 });
}
