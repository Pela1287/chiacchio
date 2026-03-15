export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { ValidationError, UnauthorizedError, handleApiError } from '@/lib/errors';
import { crearMembresia, suspenderMembresia, cancelarMembresia } from '@/lib/services/membership';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !can(session.user.role, 'membresias:ver')) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const estadoParam = searchParams.get('estado');

    const membresias = await prisma.membresia.findMany({
      where: estadoParam ? { estado: estadoParam as any } : undefined,
      include: {
        cliente: {
          select: {
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          }
        }
      },
      orderBy: { fechaProximoPago: 'asc' },
    });

    return NextResponse.json(membresias.map(m => ({
      id: m.id,
      precio: m.precio.toNumber(),
      estado: m.estado,
      fechaInicio: m.fechaInicio,
      fechaVencimiento: m.fechaProximoPago,
      ultimoPago: null,
      cliente: m.cliente,
    })));

  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !can(session.user.role, 'membresias:crear')) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const { clienteId, precio, pagoId } = body;

    if (!clienteId) {
      throw new ValidationError('clienteId es requerido');
    }

    const precioFinal = precio || 9900;

    const membresia = await crearMembresia(clienteId, precioFinal, pagoId);

    return NextResponse.json({
      success: true,
      message: 'Membresía creada correctamente',
      membresia
    }, { status: 201 });

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
    
    if (!session?.user?.id || !can(session.user.role, 'membresias:editar')) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const { membresiaId, accion } = body;

    if (!membresiaId || !accion) {
      throw new ValidationError('membresiaId y accion son requeridos');
    }

    let result;

    switch (accion) {
      case 'suspender':
        result = await suspenderMembresia(membresiaId);
        break;
      case 'cancelar':
        result = await cancelarMembresia(membresiaId);
        break;
      case 'activar':
        result = await prisma.membresia.update({
          where: { id: membresiaId },
          data: { estado: 'ACTIVA' }
        });
        break;
      default:
        throw new ValidationError('Acción inválida. Opciones: suspender, cancelar, activar');
    }

    return NextResponse.json({
      success: true,
      message: `Membresía ${accion}da correctamente`,
      membresia: result
    });

  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}

