import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'SUPER') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const now = new Date();
  const hace6Meses = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    presupuestosPorEstado,
    pagosPorMetodo,
    totalesGlobales,
    pagosRecientes,
    solicitudesPorEstado,
  ] = await Promise.all([
    prisma.presupuesto.groupBy({
      by: ['estado'],
      _count: { estado: true },
      _sum: { total: true },
    }),
    prisma.pago.groupBy({
      by: ['metodo'],
      where: { estado: 'COMPLETADO' },
      _count: { metodo: true },
      _sum: { monto: true },
    }),
    Promise.all([
      prisma.presupuesto.aggregate({ _sum: { total: true }, _count: true }),
      prisma.pago.aggregate({ _sum: { monto: true }, where: { estado: 'COMPLETADO' } }),
      prisma.pago.aggregate({ _sum: { monto: true }, where: { estado: 'PENDIENTE' } }),
    ]),
    prisma.pago.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { cliente: { select: { nombre: true, apellido: true } } },
    }),
    prisma.solicitud.groupBy({
      by: ['estado'],
      _count: { estado: true },
    }),
  ]);

  // Pagos mensuales últimos 6 meses
  const pagosMensuales = await prisma.pago.findMany({
    where: {
      estado: 'COMPLETADO',
      createdAt: { gte: hace6Meses },
    },
    select: { monto: true, createdAt: true },
  });

  const meses: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    meses[key] = 0;
  }
  for (const p of pagosMensuales) {
    const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`;
    if (key in meses) meses[key] += Number(p.monto);
  }

  const mesesLabels: Record<string, string> = {
    '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic',
  };

  const evolucion = Object.entries(meses).map(([key, valor]) => ({
    mes: mesesLabels[key.split('-')[1]] + ' ' + key.split('-')[0].slice(2),
    valor,
  }));

  return NextResponse.json({
    resumen: {
      totalPresupuestado: Number(totalesGlobales[0]._sum.total ?? 0),
      cantidadPresupuestos: totalesGlobales[0]._count,
      totalCobrado: Number(totalesGlobales[1]._sum.monto ?? 0),
      totalPendiente: Number(totalesGlobales[2]._sum.monto ?? 0),
    },
    presupuestosPorEstado: presupuestosPorEstado.map((p) => ({
      estado: p.estado,
      cantidad: p._count.estado,
      total: Number(p._sum.total ?? 0),
    })),
    pagosPorMetodo: pagosPorMetodo.map((p) => ({
      metodo: p.metodo,
      cantidad: p._count.metodo,
      total: Number(p._sum.monto ?? 0),
    })),
    evolucion,
    solicitudesPorEstado: solicitudesPorEstado.map((s) => ({
      estado: s.estado,
      cantidad: s._count.estado,
    })),
    pagosRecientes: pagosRecientes.map((p) => ({
      id: p.id,
      cliente: `${p.cliente?.nombre || ''} ${p.cliente?.apellido || ''}`.trim(),
      monto: Number(p.monto),
      metodo: p.metodo,
      estado: p.estado,
      fecha: p.createdAt,
    })),
  });
}
