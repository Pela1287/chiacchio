export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const cliente = await prisma.cliente.findFirst({
      where: { usuarioId: session.user.id },
    });

    if (!cliente) {
      return NextResponse.json([]);
    }

    const presupuestos = await prisma.presupuesto.findMany({
      where: { clienteId: cliente.id },
      include: { solicitud: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      presupuestos.map((p) => ({
        id: p.id,
        titulo: p.solicitud?.descripcion || `Presupuesto N° ${p.numero}`,
        descripcion: p.notas || '',
        estado: p.estado.toLowerCase(),
        total: p.total ? Number(p.total) : null,
        createdAt: p.createdAt,
      }))
    );
  } catch (error) {
    console.error('Error obteniendo presupuestos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const cliente = await prisma.cliente.findFirst({
      where: { usuarioId: session.user.id },
    });

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    const { tipoTrabajo, titulo, descripcion, direccion, telefono } = await request.json();

    const servicio = await prisma.servicio.findFirst({ select: { id: true } });
    if (!servicio) {
      return NextResponse.json({ error: 'No hay servicios configurados' }, { status: 500 });
    }

    const descripcionCompleta = `[PRESUPUESTO${tipoTrabajo ? ` - ${tipoTrabajo}` : ''}] ${titulo}${descripcion ? `: ${descripcion}` : ''}`;

    await prisma.solicitud.create({
      data: {
        clienteId: cliente.id,
        servicioId: servicio.id,
        direccion: direccion || cliente.direccion || 'Sin especificar',
        ciudad: cliente.ciudad || 'Sin especificar',
        descripcion: descripcionCompleta,
        estado: 'PENDIENTE',
        prioridad: 'MEDIA',
        fechaSolicitada: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: 'Solicitud de presupuesto enviada correctamente' });
  } catch (error) {
    console.error('Error creando solicitud de presupuesto:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
