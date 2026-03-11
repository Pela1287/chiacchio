import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function isSuper(session: any) {
  return session?.user && (session.user as any).role === 'SUPER';
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isSuper(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const all = request.nextUrl.searchParams.get('all') === '1';

  const sucursales = await prisma.sucursal.findMany({
    where: all ? undefined : { activa: true },
    select: {
      id: true,
      codigo: true,
      nombre: true,
      activa: true,
      createdAt: true,
      _count: { select: { usuarios: true } },
      usuarios: {
        where: { rol: 'ADMIN' },
        select: { nombre: true, apellido: true },
        take: 3,
      },
    },
    orderBy: { codigo: 'asc' },
  });

  return NextResponse.json({
    sucursales: sucursales.map((s) => ({
      id: s.id,
      codigo: s.codigo,
      nombre: s.nombre,
      activa: s.activa,
      createdAt: s.createdAt,
      _count: s._count,
      admins: s.usuarios,
    })),
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isSuper(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { codigo, nombre } = await request.json();
  if (!codigo?.trim() || !nombre?.trim()) {
    return NextResponse.json({ error: 'Código y nombre son obligatorios' }, { status: 400 });
  }

  const exists = await prisma.sucursal.findUnique({ where: { codigo: codigo.trim().toUpperCase() } });
  if (exists) {
    return NextResponse.json({ error: 'Ya existe una sucursal con ese código' }, { status: 409 });
  }

  const sucursal = await prisma.sucursal.create({
    data: { codigo: codigo.trim().toUpperCase(), nombre: nombre.trim() },
  });

  return NextResponse.json({ sucursal }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isSuper(session)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const { id, codigo, nombre, activa } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }

  const data: any = {};
  if (codigo !== undefined) data.codigo = codigo.trim().toUpperCase();
  if (nombre !== undefined) data.nombre = nombre.trim();
  if (activa !== undefined) data.activa = activa;

  const sucursal = await prisma.sucursal.update({ where: { id }, data });
  return NextResponse.json({ sucursal });
}
