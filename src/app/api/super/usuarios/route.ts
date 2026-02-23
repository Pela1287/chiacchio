import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { hash } from 'bcryptjs';
import { 
  ValidationError, 
  UnauthorizedError, 
  ForbiddenError,
  handleApiError 
} from '@/lib/errors';
import { validarEmail, validarTelefonoArgentino, validarRol } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || !can(session.user.role, 'usuarios:ver')) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const rolParam = searchParams.get('rol');

    const usuarios = await prisma.user.findMany({
      where: rolParam ? { rol: rolParam.toUpperCase() as any } : undefined,
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
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(usuarios);
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
    
    if (!session?.user?.id || !can(session.user.role, 'usuarios:crear')) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const { email, password, nombre, apellido, telefono, rol } = body;

    if (!email || !password || !nombre || !apellido || !rol) {
      throw new ValidationError('Faltan campos requeridos');
    }

    if (!validarEmail(email)) {
      throw new ValidationError('Email inválido');
    }

    if (telefono && !validarTelefonoArgentino(telefono)) {
      throw new ValidationError('Teléfono argentino inválido');
    }

    if (!validarRol(rol)) {
      throw new ValidationError('Rol inválido. Opciones: SUPER, ADMIN, CLIENTE');
    }

    if (password.length < 6) {
      throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
    }

    const existente = await prisma.user.findUnique({
      where: { email }
    });

    if (existente) {
      throw new ValidationError('El email ya está registrado');
    }

    const hashedPassword = await hash(password, 12);

    const usuario = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellido,
        telefono: telefono || null,
        rol: rol.toUpperCase(),
        activo: true
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        rol: true,
        activo: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario creado correctamente',
      usuario
    }, { status: 201 });
  } catch (error) {
    const apiError = handleApiError(error);
    return NextResponse.json(
      { error: apiError.error, code: apiError.code },
      { status: apiError.statusCode }
    );
  }
}
