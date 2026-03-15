export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { tecnicoId, estado, prioridad, fechaProgramada, notas } = await request.json();

  const data: any = {};
  if (tecnicoId !== undefined) data.tecnicoId = tecnicoId || null;
  if (estado !== undefined) data.estado = estado;
  if (prioridad !== undefined) data.prioridad = prioridad;
  if (fechaProgramada !== undefined) data.fechaProgramada = fechaProgramada ? new Date(fechaProgramada) : null;
  if (notas !== undefined) data.notas = notas;

  const solicitud = await prisma.solicitud.update({
    where: { id: params.id },
    data,
    include: {
      tecnico: { select: { id: true, nombre: true, apellido: true } },
      cliente: { select: { nombre: true, apellido: true } },
    },
  });

  return NextResponse.json(solicitud);
}
