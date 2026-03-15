// ============================================
// CHIACCHIO - API Perfil Cliente
// ============================================
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cliente: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono || '',
      avatar: user.avatar || null,
      direccion: user.cliente?.direccion || '',
      ciudad: user.cliente?.ciudad || '',
      codigoPostal: user.cliente?.codigoPostal || '',
    });
  } catch (error) {
    console.error('Error al obtener perfil cliente:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { nombre, apellido, telefono, direccion, ciudad, codigoPostal } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { nombre, apellido, telefono },
      include: { cliente: true },
    });

    if (user.cliente) {
      await prisma.cliente.update({
        where: { id: user.cliente.id },
        data: { nombre, apellido, telefono, direccion, ciudad, codigoPostal },
      });
    }

    return NextResponse.json({ success: true, message: 'Perfil actualizado' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { avatar } = body;

    if (!avatar) {
      return NextResponse.json({ error: 'Avatar requerido' }, { status: 400 });
    }

    // Limite: ~5MB en base64 (aprox. 3.75MB imagen real)
    if (avatar.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagen demasiado grande (max 3.75MB)' }, { status: 400 });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { avatar },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar avatar:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
