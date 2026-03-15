export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'SUPER') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const sucursalCodigo = request.nextUrl.searchParams.get('sucursal') || '';

  const clientes = await prisma.cliente.findMany({
    where: sucursalCodigo
      ? { usuario: { sucursal: { codigo: sucursalCodigo } } }
      : undefined,
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      telefono: true,
      activo: true,
      createdAt: true,
      usuario: {
        select: {
          sucursal: { select: { codigo: true, nombre: true } },
        },
      },
      membresias: {
        where: { estado: 'ACTIVA' },
        select: { plan: true, estado: true },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    clientes: clientes.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      apellido: c.apellido,
      email: c.email,
      telefono: c.telefono,
      activo: c.activo,
      createdAt: c.createdAt,
      sucursal: c.usuario?.sucursal ?? null,
      membresia: c.membresias[0] ?? null,
    })),
  });
}
