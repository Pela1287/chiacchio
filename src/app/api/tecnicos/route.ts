// ============================================
// CHIACCHIO - API Técnicos (Público)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Listar técnicos (PÚBLICO - sin auth)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    // Si es público, solo mostrar activos
    const where = all ? {} : { activo: true };

    const tecnicos = await prisma.tecnico.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(tecnicos.map(t => ({
      id: t.id,
      nombre: t.nombre,
      apellido: t.apellido,
      especialidad: t.especialidad || 'Electricista',
      telefono: t.telefono || '',
      avatar: t.avatar,
      activo: t.activo,
    })));

  } catch (error) {
    console.error('Error obteniendo técnicos:', error);
    return NextResponse.json([]);
  }
}

// POST - Crear técnico (sin auth por ahora)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, apellido, especialidad, telefono, avatar } = body;

    if (!nombre || !apellido) {
      return NextResponse.json({ 
        error: 'Nombre y apellido son obligatorios' 
      }, { status: 400 });
    }

    const tecnico = await prisma.tecnico.create({
      data: {
        nombre,
        apellido,
        especialidad: especialidad || null,
        telefono: telefono || null,
        avatar: avatar || null,
        activo: true,
      }
    });

    return NextResponse.json({
      success: true,
      id: tecnico.id,
      tecnico: {
        id: tecnico.id,
        nombre: tecnico.nombre,
        apellido: tecnico.apellido,
        especialidad: tecnico.especialidad,
        telefono: tecnico.telefono,
        avatar: tecnico.avatar,
        activo: tecnico.activo,
      },
    });

  } catch (error) {
    console.error('Error creando técnico:', error);
    return NextResponse.json(
      { error: 'Error al crear técnico' },
      { status: 500 }
    );
  }
}
