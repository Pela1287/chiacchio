// ============================================
// CHIACCHIO - API Mis Presupuestos
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el usuario y su cliente
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cliente: true },
    });

    if (!user?.cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    // Obtener los presupuestos del cliente
    const presupuestos = await prisma.presupuesto.findMany({
      where: {
        clienteId: user.cliente.id,
      },
      include: {
        items: true,
        solicitud: {
          include: {
            servicio: {
              select: { nombre: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      presupuestos: presupuestos.map(p => ({
        id: p.id,
        subtotal: Number(p.subtotal),
        iva: Number(p.iva),
        total: Number(p.total),
        estado: p.estado,
        fechaEmision: p.fechaEmision,
        fechaValidez: p.fechaValidez,
        notas: p.notas,
        items: p.items.map(item => ({
          id: item.id,
          descripcion: item.descripcion,
          cantidad: Number(item.cantidad),
          precioUnitario: Number(item.precioUnitario),
          subtotal: Number(item.subtotal),
        })),
        solicitud: p.solicitud ? {
          descripcion: p.solicitud.descripcion,
          servicio: p.solicitud.servicio,
        } : null,
      })),
    });

  } catch (error) {
    console.error('Error al obtener presupuestos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
