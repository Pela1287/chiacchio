/* ============================================
   CHIACCHIO - API Servicios (CRUD)
   ============================================ */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Listar todos los servicios
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER', 'ADMIN'].includes(session.user?.role || '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const servicios = await prisma.servicio.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER', 'ADMIN'].includes(session.user?.role || '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { nombre, descripcion, categoria, tarifaBase, duracionEstimada, activo } = data;

    if (!nombre || !categoria || tarifaBase === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, categoria, tarifaBase' },
        { status: 400 }
      );
    }

    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion: descripcion || '',
        categoria,
        tarifaBase: parseFloat(tarifaBase),
        duracionEstimada: parseInt(duracionEstimada) || 60,
        activo: activo !== undefined ? activo : true,
      },
    });

    return NextResponse.json(servicio, { status: 201 });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    return NextResponse.json(
      { error: 'Error al crear servicio' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar servicio
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER', 'ADMIN'].includes(session.user?.role || '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { id, nombre, descripcion, categoria, tarifaBase, duracionEstimada, activo } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de servicio requerido' },
        { status: 400 }
      );
    }

    const servicio = await prisma.servicio.update({
      where: { id },
      data: {
        nombre,
        descripcion: descripcion || '',
        categoria,
        tarifaBase: parseFloat(tarifaBase),
        duracionEstimada: parseInt(duracionEstimada) || 60,
        activo: activo !== undefined ? activo : true,
      },
    });

    return NextResponse.json(servicio);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER', 'ADMIN'].includes(session.user?.role || '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de servicio requerido' },
        { status: 400 }
      );
    }

    // Verificar si tiene solicitudes asociadas
    const solicitudesAsociadas = await prisma.solicitud.count({
      where: { servicioId: id },
    });

    if (solicitudesAsociadas > 0) {
      // En lugar de borrar, desactivamos
      const servicio = await prisma.servicio.update({
        where: { id },
        data: { activo: false },
      });
      return NextResponse.json({
        message: 'Servicio desactivado (tiene solicitudes asociadas)',
        servicio,
      });
    }

    await prisma.servicio.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio' },
      { status: 500 }
    );
  }
}
