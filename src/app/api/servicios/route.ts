// ============================================
// CHIACCHIO - API Servicios
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { ServicioRepo } from '@/lib/repositories';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Listar servicios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const soloActivos = searchParams.get('activos') === 'true';

    const servicios = soloActivos 
      ? await ServicioRepo.findActivos()
      : await ServicioRepo.findAll();

    return NextResponse.json({ servicios });
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// POST - Crear servicio
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER', 'ADMIN'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const servicio = await ServicioRepo.create({
      nombre: body.nombre,
      descripcion: body.descripcion,
      categoria: body.categoria,
      tarifaBase: body.tarifaBase,
      duracionEstimada: body.duracionEstimada,
      activo: true,
    });

    return NextResponse.json({ servicio }, { status: 201 });
  } catch (error) {
    console.error('Error creando servicio:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
