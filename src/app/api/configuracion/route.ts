import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { ValidationError, UnauthorizedError, handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !can(session.user.role, 'configuracion:ver')) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const clave = searchParams.get('clave');

    if (clave) {
      const config = await prisma.configuracion.findUnique({
        where: { clave }
      });

      if (!config) {
        return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 });
      }

      return NextResponse.json(config);
    }

    const configuraciones = await prisma.configuracion.findMany({
      orderBy: { clave: 'asc' }
    });

    return NextResponse.json(configuraciones);
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
    
    if (!session?.user?.id || !can(session.user.role, 'configuracion:editar')) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const { clave, valor } = body;

    if (!clave || valor === undefined) {
      throw new ValidationError('clave y valor son requeridos');
    }

    const config = await prisma.configuracion.findUnique({
      where: { clave }
    });

    if (!config) {
      throw new ValidationError('Configuración no encontrada');
    }

    if (clave === 'membresia_precio') {
      const precio = parseFloat(valor);
      if (isNaN(precio) || precio < 1000 || precio > 100000) {
        throw new ValidationError('Precio de membresía debe estar entre $1.000 y $100.000');
      }
    }

    if (clave.includes('descuento')) {
      const descuento = parseFloat(valor);
      if (isNaN(descuento) || descuento < 0 || descuento > 100) {
        throw new ValidationError('El descuento debe estar entre 0% y 100%');
      }
    }

    const configActualizada = await prisma.configuracion.update({
      where: { clave },
      data: { valor: valor.toString() }
    });

    return NextResponse.json({
      success: true,
      message: 'Configuración actualizada',
      configuracion: configActualizada
    });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}

export async function PUT(request: NextRequest) {
  return PATCH(request);
}

