import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const tecnico = await prisma.tecnico.findUnique({
    where: { id: params.id },
    include: {
      solicitudes: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { cliente: { select: { nombre: true, apellido: true } } },
      },
    },
  });
  if (!tecnico) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(tecnico);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const { nombre, apellido, email, dni, especialidad, telefono, avatar, antecedentes, observaciones } = body;

  const tecnico = await prisma.tecnico.update({
    where: { id: params.id },
    data: { nombre, apellido, email, dni, especialidad, telefono, avatar, antecedentes, observaciones },
  });
  return NextResponse.json(tecnico);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const tecnico = await prisma.tecnico.update({ where: { id: params.id }, data: body });
  return NextResponse.json(tecnico);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await prisma.tecnico.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
