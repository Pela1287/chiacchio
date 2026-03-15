export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { ValidationError, UnauthorizedError, handleApiError } from '@/lib/errors';
import { validarPrecio } from '@/lib/validators';
import { renovarMembresia } from '@/lib/services/membership';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }

    const userRole = session.user.role;
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('clienteId');

    if (clienteId) {
      if (!can(userRole, 'pagos:ver')) {
        throw new UnauthorizedError('No tienes permiso para ver pagos');
      }

      if (userRole === 'cliente' && session.user.id !== clienteId) {
        throw new UnauthorizedError('Solo puedes ver tus propios pagos');
      }

      const pagos = await prisma.pago.findMany({
        where: { clienteId },
        include: {
          cliente: {
            select: { nombre: true, apellido: true, email: true }
          },
          membresia: true
        },
        orderBy: { fechaPago: 'desc' }
      });

      return NextResponse.json(pagos);
    }

    if (!can(userRole, 'pagos:ver') || userRole === 'cliente') {
      throw new UnauthorizedError('No autorizado para ver todos los pagos');
    }

    const pagos = await prisma.pago.findMany({
      include: {
        cliente: {
          select: { nombre: true, apellido: true, email: true }
        },
        membresia: true
      },
      orderBy: { fechaPago: 'desc' },
      take: 100
    });

    return NextResponse.json(pagos);
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
    if (!session?.user || !can(session.user.role, 'pagos:crear')) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const { clienteId, monto, metodoPago, membresiaId, concepto } = body;

    if (!clienteId || !monto || !metodoPago) {
      throw new ValidationError('Faltan campos requeridos: clienteId, monto, metodoPago');
    }

    if (!validarPrecio(monto)) {
      throw new ValidationError('Monto inválido');
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId }
    });

    if (!cliente) {
      throw new ValidationError('Cliente no encontrado');
    }

    const pago = await prisma.pago.create({
      data: {
        clienteId,
        monto,
        metodo: metodoPago as any,
        estado: 'COMPLETADO',
        fechaPago: new Date(),
        referencia: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        membresiaId: membresiaId || null,
        presupuestoId: null
      },
      include: {
        cliente: {
          select: { nombre: true, apellido: true, email: true }
        }
      }
    });

    if (membresiaId) {
      await renovarMembresia(membresiaId, pago.id);
    }

    return NextResponse.json(pago, { status: 201 });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}
