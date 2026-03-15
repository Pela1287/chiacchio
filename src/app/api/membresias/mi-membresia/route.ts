// ============================================
// CHIACCHIO - API Mi Membresía
// ============================================
export const dynamic = "force-dynamic";

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

    // Obtener la membresía activa
    const membresia = await prisma.membresia.findFirst({
      where: {
        clienteId: user.cliente.id,
        estado: 'ACTIVA',
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      membresia: membresia ? {
        id: membresia.id,
        plan: membresia.plan,
        precio: Number(membresia.precio),
        estado: membresia.estado,
        fechaInicio: membresia.fechaInicio,
        fechaProximoPago: membresia.fechaProximoPago,
        serviciosDisponibles: membresia.serviciosDisponibles,
        serviciosUsados: membresia.serviciosUsados,
      } : null,
    });

  } catch (error) {
    console.error('Error al obtener membresía:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
