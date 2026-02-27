import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getScopeSucursal() {
  const session = await getServerSession(authOptions);

  const role = (session?.user as any)?.role;
  const sucursalId = (session?.user as any)?.sucursalId ?? null;

  if (!session?.user) {
    return { ok: false as const, status: 401, role: null, sucursalId: null };
  }

  if (role === "SUPER") {
    return { ok: true as const, status: 200, role, sucursalId: null };
  }

  if (role === "ADMIN") {
    if (!sucursalId) {
      return { ok: false as const, status: 403, role, sucursalId: null };
    }
    return { ok: true as const, status: 200, role, sucursalId };
  }

  return { ok: false as const, status: 403, role, sucursalId: null };
}