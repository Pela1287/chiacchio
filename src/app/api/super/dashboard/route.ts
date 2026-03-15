export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'SUPER') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const [
    sucursalesTotal,
    sucursalesActivas,
    admins,
    adminsActivos,
    clientes,
    clientesActivos,
    usuarios,
    solicitudesPendientes,
    presupuestosPendientes,
    totalPresupuestadoRaw,
    actividadSolicitudes,
    actividadPresupuestos,
    actividadClientes,
  ] = await Promise.all([
    prisma.sucursal.count(),
    prisma.sucursal.count({ where: { activa: true } }),
    prisma.user.count({ where: { rol: 'ADMIN' } }),
    prisma.user.count({ where: { rol: 'ADMIN', activo: true } }),
    prisma.cliente.count(),
    prisma.cliente.count({ where: { activo: true } }),
    prisma.user.count(),
    prisma.solicitud.count({ where: { estado: 'PENDIENTE' } }),
    prisma.presupuesto.count({ where: { estado: 'PENDIENTE' } }),
    prisma.presupuesto.aggregate({ _sum: { total: true } }),
    prisma.solicitud.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, descripcion: true, createdAt: true, cliente: { select: { nombre: true, apellido: true } } },
    }),
    prisma.presupuesto.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, numero: true, createdAt: true, clienteNombre: true },
    }),
    prisma.cliente.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, nombre: true, apellido: true, createdAt: true },
    }),
  ]);

  const actividadRaw = [
    ...actividadSolicitudes.map((s) => ({
      id: s.id,
      tipo: 'solicitud',
      descripcion: `Nueva solicitud de ${s.cliente?.nombre || 'cliente'} ${s.cliente?.apellido || ''}`.trim(),
      fecha: s.createdAt.toISOString(),
    })),
    ...actividadPresupuestos.map((p) => ({
      id: p.id,
      tipo: 'presupuesto',
      descripcion: `Presupuesto N° ${p.numero} — ${p.clienteNombre || 'cliente'}`,
      fecha: p.createdAt.toISOString(),
    })),
    ...actividadClientes.map((c) => ({
      id: c.id,
      tipo: 'cliente',
      descripcion: `Nuevo cliente: ${c.nombre} ${c.apellido}`,
      fecha: c.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 10);

  return NextResponse.json({
    metrics: {
      sucursales: sucursalesTotal,
      sucursalesActivas,
      admins,
      adminsActivos,
      clientes,
      clientesActivos,
      usuarios,
      solicitudesPendientes,
      presupuestosPendientes,
      totalPresupuestado: Number(totalPresupuestadoRaw._sum.total ?? 0),
    },
    actividad: actividadRaw,
  });
}
