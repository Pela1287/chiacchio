// ============================================
// CHIACCHIO - API Usuarios (Super User)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET - Listar todos los usuarios
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || (session?.user as any)?.rol;
    
    if (!session || userRole !== 'SUPER') {
      return NextResponse.json({ error: 'No autorizado - Solo Super Usuario' }, { status: 401 });
    }

    const usuarios = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        cliente: {
          select: { id: true, nombre: true, apellido: true }
        }
      }
    });

    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || (session?.user as any)?.rol;
    
    if (!session || userRole !== 'SUPER') {
      return NextResponse.json({ error: 'No autorizado - Solo Super Usuario' }, { status: 401 });
    }

    const body = await request.json();
    const { nombre, apellido, email, telefono, rol, password } = body;

    // Verificar si el email ya existe
    const existeUsuario = await prisma.user.findUnique({ where: { email } });
    if (existeUsuario) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password || '123456', 10);

    const usuario = await prisma.user.create({
      data: {
        nombre,
        apellido,
        email,
        telefono,
        rol: rol || 'CLIENTE',
        password: hashedPassword,
      }
    });

    return NextResponse.json({ usuario });
  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// PATCH - Actualizar usuario
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || (session?.user as any)?.rol;
    
    if (!session || userRole !== 'SUPER') {
      return NextResponse.json({ error: 'No autorizado - Solo Super Usuario' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    // Si hay password, hashearla
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const usuario = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        rol: data.rol as any,
      }
    });

    return NextResponse.json({ usuario });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar usuario
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || (session?.user as any)?.rol;
    
    if (!session || userRole !== 'SUPER') {
      return NextResponse.json({ error: 'No autorizado - Solo Super Usuario' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    // No permitir eliminar el propio usuario
    if (id === session.user.id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
