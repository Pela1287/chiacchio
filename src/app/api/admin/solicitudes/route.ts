export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { UnauthorizedError, ValidationError, handleApiError } from '@/lib/errors';
import { validarEstadoSolicitud } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !can(session.user.role, 'solicitudes:ver')) {
      throw new UnauthorizedError();
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
      foto: s.foto || null,
    })));

  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !can(session.user.role, 'solicitudes:editar')) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const { id, estado, fechaProgramada, notas } = body;

    if (!id) {
      throw new ValidationError('El ID de solicitud es requerido');
    }

    if (estado && !validarEstadoSolicitud(estado)) {
      throw new ValidationError('Estado inválido');
    }

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
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}

