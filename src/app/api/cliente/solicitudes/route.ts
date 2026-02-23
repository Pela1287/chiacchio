// ============================================
// CHIACCHIO - API Solicitudes del Cliente
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Listar solicitudes del cliente
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const cliente = await prisma.cliente.findFirst({
      where: { usuarioId: session.user.id }
    });

    if (!cliente) {
      return NextResponse.json([]);
    }

    const solicitudes = await prisma.solicitud.findMany({
      where: { clienteId: cliente.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(solicitudes.map(s => ({
      id: s.id,
      descripcion: s.descripcion,
      estado: s.estado.toLowerCase(),
      prioridad: s.prioridad.toLowerCase(),
      direccion: s.direccion,
      fechaSolicitada: s.fechaSolicitada,
      fechaProgramada: s.fechaProgramada,
      createdAt: s.createdAt,
    })));

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva solicitud (NO descuenta servicios - es ILIMITADO)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { servicioId, tipoTrabajo, urgencia, direccion, ciudad, descripcion, telefono } = body;

    const cliente = await prisma.cliente.findFirst({
      where: { usuarioId: session.user.id }
    });

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    const membresia = await prisma.membresia.findFirst({
      where: { 
        clienteId: cliente.id,
        estado: 'ACTIVA'
      }
    });

    if (!membresia) {
      return NextResponse.json({ 
        error: 'No tienes una membresía activa',
        needsMembership: true
      }, { status: 400 });
    }

    const prioridadMap: Record<string, string> = {
      'baja': 'BAJA',
      'media': 'MEDIA',
      'alta': 'ALTA',
      'urgente': 'URGENTE',
    };
    const prioridad = prioridadMap[urgencia?.toLowerCase()] || 'MEDIA';

    const servicioIdFinal = servicioId || 'serv-1';

    const solicitud = await prisma.solicitud.create({
      data: {
        clienteId: cliente.id,
        servicioId: servicioIdFinal,
        direccion: direccion || cliente.direccion || 'Sin especificar',
        ciudad: ciudad || cliente.ciudad || 'Sin especificar',
        descripcion: tipoTrabajo 
          ? `[${tipoTrabajo}] ${descripcion || ''}` 
          : descripcion || 'Servicio eléctrico',
        estado: 'PENDIENTE',
        prioridad: prioridad as any,
        fechaSolicitada: new Date(),
      }
    });

    await prisma.membresia.update({
      where: { id: membresia.id },
      data: {
        serviciosUsados: { increment: 1 },
      }
    });

    return NextResponse.json({
      success: true,
      id: solicitud.id,
      message: 'Solicitud creada correctamente'
    });

  } catch (error) {
    console.error('Error creando solicitud:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
