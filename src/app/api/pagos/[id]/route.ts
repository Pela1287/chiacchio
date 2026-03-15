export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { NotFoundError, UnauthorizedError, handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new UnauthorizedError();
    }

    const { id } = params;
    const userRole = session.user.role;

    const pago = await prisma.pago.findUnique({
      where: { id },
      include: {
        cliente: {
          select: { id: true, nombre: true, apellido: true, email: true, telefono: true }
        },
        membresia: true
      }
    });

    if (!pago) {
      throw new NotFoundError('Pago no encontrado');
    }

    if (userRole === 'cliente' && pago.clienteId !== session.user.id) {
      throw new UnauthorizedError('No puedes ver pagos de otros clientes');
    }

    return NextResponse.json(pago);
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}
