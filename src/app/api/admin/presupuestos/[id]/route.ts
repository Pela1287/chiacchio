import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const presupuesto = await prisma.presupuesto.findUnique({
    where: { id: params.id },
    include: { items: true, cliente: true },
  });

  if (!presupuesto) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json({
    ...presupuesto,
    subtotal: Number(presupuesto.subtotal),
    descuentoMonto: Number(presupuesto.descuentoMonto),
    total: Number(presupuesto.total),
    iva: presupuesto.iva ? Number(presupuesto.iva) : 0,
    items: presupuesto.items.map(i => ({
      ...i,
      cantidad: Number(i.cantidad),
      precioUnitario: Number(i.precioUnitario),
      subtotal: Number(i.subtotal),
    })),
  });
}