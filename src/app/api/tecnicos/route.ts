import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const all = request.nextUrl.searchParams.get('all') === 'true';
  const tecnicos = await prisma.tecnico.findMany({
    where: all ? undefined : { activo: true },
    include: {
      solicitudes: {
        where: { estado: { in: ['PENDIENTE', 'CONFIRMADA', 'EN_PROGRESO'] } },
        select: { id: true },
      },
    },
    orderBy: [{ activo: 'desc' }, { apellido: 'asc' }],
  });

  return NextResponse.json(tecnicos.map((t) => ({
    ...t,
    trabajosActivos: t.solicitudes.length,
    solicitudes: undefined,
  })));
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const { nombre, apellido, email, dni, especialidad, telefono, avatar, antecedentes, observaciones } = body;

  if (!nombre?.trim() || !apellido?.trim()) {
    return NextResponse.json({ error: 'Nombre y apellido son requeridos' }, { status: 400 });
  }

  const tecnico = await prisma.tecnico.create({
    data: { nombre, apellido, email, dni, especialidad, telefono, avatar, antecedentes, observaciones },
  });

  return NextResponse.json(tecnico, { status: 201 });
}
