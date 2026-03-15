export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { hash } from 'bcryptjs';
import { 
  ValidationError, 
  UnauthorizedError, 
  NotFoundError,
  ForbiddenError,
  handleApiError 
} from '@/lib/errors';
import { validarEmail, validarTelefonoArgentino, validarRol } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !can(session.user.role, 'usuarios:ver')) {
      throw new UnauthorizedError();
    }

    const { id } = params;

    const usuario = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        rol: true,
        activo: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return NextResponse.json(usuario);
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !can(session.user.role, 'usuarios:editar')) {
      throw new UnauthorizedError();
    }

    const { id } = params;
    const body = await request.json();

    const usuarioExistente = await prisma.user.findUnique({
      where: { id }
    });

    if (!usuarioExistente) {
      throw new NotFoundError('Usuario no encontrado');
    }

    if (usuarioExistente.id === session.user.id && body.activo === false) {
      throw new ForbiddenError('No puedes desactivarte a ti mismo');
    }

    const dataToUpdate: any = {};

    if (body.nombre !== undefined) dataToUpdate.nombre = body.nombre;
    if (body.apellido !== undefined) dataToUpdate.apellido = body.apellido;
    if (body.telefono !== undefined) {
      if (body.telefono && !validarTelefonoArgentino(body.telefono)) {
        throw new ValidationError('Teléfono inválido');
      }
      dataToUpdate.telefono = body.telefono || null;
    }
    if (body.activo !== undefined) dataToUpdate.activo = body.activo;
    if (body.rol !== undefined) {
      if (!validarRol(body.rol)) {
        throw new ValidationError('Rol inválido');
      }
      dataToUpdate.rol = body.rol.toUpperCase();
    }

    if (body.password) {
      if (body.password.length < 6) {
        throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
      }
      dataToUpdate.password = await hash(body.password, 12);
    }

    const usuarioActualizado = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        rol: true,
        activo: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !can(session.user.role, 'usuarios:eliminar')) {
      throw new UnauthorizedError();
    }

    const { id } = params;

    if (id === session.user.id) {
      throw new ForbiddenError('No puedes eliminarte a ti mismo');
    }

    const usuario = await prisma.user.findUnique({
      where: { id }
    });

    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}
