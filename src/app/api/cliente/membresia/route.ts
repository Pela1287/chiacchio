// ============================================
// CHIACCHIO - API Membresía del Cliente
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscar el cliente asociado al usuario
    const cliente = await prisma.cliente.findFirst({
      where: { usuarioId: session.user.id }
    });

    if (!cliente) {
      return NextResponse.json(null);
    }

    // Buscar membresía activa
    const membresia = await prisma.membresia.findFirst({
      where: { 
        clienteId: cliente.id,
        estado: 'ACTIVA'
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!membresia) {
      return NextResponse.json(null);
    }

    // Calcular días restantes de cobertura
    const hoy = new Date();
    const proximoPago = new Date(membresia.fechaProximoPago);
    const diasRestantes = Math.ceil((proximoPago.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      id: membresia.id,
      plan: 'ELÉCTRICO',
      precio: 9900,
      estado: membresia.estado,
      serviciosDisponibles: 'ILIMITADO', // Sin límite
      serviciosUsados: membresia.serviciosUsados,
      fechaInicio: membresia.fechaInicio,
      fechaProximoPago: membresia.fechaProximoPago,
      diasRestantes: diasRestantes > 0 ? diasRestantes : 0,
    });

  } catch (error) {
    console.error('Error obteniendo membresía:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
