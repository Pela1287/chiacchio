// ============================================
// CHIACCHIO - API Leads
// ============================================
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { LeadRepo } from '@/lib/repositories';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Listar leads
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER', 'ADMIN'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const nuevos = searchParams.get('nuevos') === 'true';

    const leads = nuevos 
      ? await LeadRepo.findNuevos()
      : await LeadRepo.findAll();

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error obteniendo leads:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// PATCH - Actualizar lead
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['SUPER', 'ADMIN'].includes(session.user.role || '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    const lead = await LeadRepo.update(id, data);
    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error actualizando lead:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
