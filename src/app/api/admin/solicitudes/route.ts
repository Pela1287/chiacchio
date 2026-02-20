// ============================================
// CHIACCHIO - API Admin Solicitudes
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Listar todas las solicitudes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que es admin o super
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || (user.rol !== 'ADMIN' && user.rol !== 'SUPER')) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    const solicitudes = await prisma.solicitud.findMany({
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          }
        },
        servicio: {
          select: {
            nombre: true,
            categoria: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(solicitudes.map(s => ({
      id: s.id,
      descripcion: s.descripcion,
      direccion: s.direccion,
      ciudad: s.ciudad,
      estado: s.estado,
      prioridad: s.prioridad,
      fechaSolicitada: s.fechaSolicitada,
      fechaProgramada: s.fechaProgramada,
      createdAt: s.createdAt,
      cliente: s.cliente,
      servicio: s.servicio,
    })));

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar estado de solicitud
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que es admin o super
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || (user.rol !== 'ADMIN' && user.rol !== 'SUPER')) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    const body = await request.json();
    const { id, estado, fechaProgramada, notas } = body;

    const solicitud = await prisma.solicitud.update({
      where: { id },
      data: {
        estado,
        fechaProgramada: fechaProgramada ? new Date(fechaProgramada) : undefined,
        notas,
      }
    });

    return NextResponse.json({
      success: true,
      solicitud: {
        id: solicitud.id,
        estado: solicitud.estado,
      }
    });

  } catch (error) {
    console.error('Error actualizando solicitud:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
