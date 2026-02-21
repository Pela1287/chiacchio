// ============================================
// CHIACCHIO - API Perfil
// ============================================

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

    // Obtener el usuario y su cliente
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cliente: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      perfil: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono || '',
        direccion: user.cliente?.direccion || '',
        ciudad: user.cliente?.ciudad || '',
        codigoPostal: user.cliente?.codigoPostal || '',
      },
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
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

    // Actualizar usuario
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        nombre,
        apellido,
        telefono,
      },
      include: { cliente: true },
    });

    // Actualizar cliente si existe
    if (user.cliente) {
      await prisma.cliente.update({
        where: { id: user.cliente.id },
        data: {
          nombre,
          apellido,
          telefono,
          direccion,
          ciudad,
          codigoPostal,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
