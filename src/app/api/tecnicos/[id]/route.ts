// ============================================
// CHIACCHIO - API Técnicos [id]
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener un técnico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tecnico = await prisma.tecnico.findUnique({
      where: { id }
    });

    if (!tecnico) {
      return NextResponse.json({ error: 'Técnico no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      id: tecnico.id,
      nombre: tecnico.nombre,
      apellido: tecnico.apellido,
      especialidad: tecnico.especialidad,
      telefono: tecnico.telefono,
      avatar: tecnico.avatar,
      activo: tecnico.activo,
    });

  } catch (error) {
    console.error('Error obteniendo técnico:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar técnico
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nombre, apellido, especialidad, telefono, avatar } = body;

    const tecnico = await prisma.tecnico.update({
      where: { id },
      data: {
        nombre,
        apellido,
        especialidad: especialidad || null,
        telefono: telefono || null,
        avatar: avatar || null,
      }
    });

    return NextResponse.json({ 
      success: true,
      tecnico: {
        id: tecnico.id,
        nombre: tecnico.nombre,
        apellido: tecnico.apellido,
        especialidad: tecnico.especialidad,
        telefono: tecnico.telefono,
        avatar: tecnico.avatar,
        activo: tecnico.activo,
      }
    });

  } catch (error) {
    console.error('Error actualizando técnico:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar parcialmente (ej: activar/desactivar)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const tecnico = await prisma.tecnico.update({
      where: { id },
      data: body
    });

    return NextResponse.json({ 
      success: true,
      tecnico 
    });

  } catch (error) {
    console.error('Error actualizando técnico:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar técnico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.tecnico.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error eliminando técnico:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
