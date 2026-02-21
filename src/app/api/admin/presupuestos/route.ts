/* ============================================
   CHIACCHIO - API Presupuestos (Admin)
   ============================================ */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Listar presupuestos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER', 'ADMIN'].includes(session.user.rol)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const presupuestos = await prisma.presupuesto.findMany({
      include: {
        cliente: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(presupuestos);
  } catch (error) {
    console.error('Error fetching presupuestos:', error);
    return NextResponse.json(
      { error: 'Error al obtener presupuestos' },
      { status: 500 }
    );
  }
}

// POST - Crear presupuesto
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER', 'ADMIN'].includes(session.user.rol)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      clienteId,
      clienteNombre,
      clienteDireccion,
      clienteTelefono,
      clienteEmail,
      lugar,
      fecha,
      items,
      subtotal,
      descuentoPorcentaje,
      descuentoMonto,
      total,
      financiacion,
      cuotas,
      notas,
    } = body;

    // Crear presupuesto con items
    const presupuesto = await prisma.presupuesto.create({
      data: {
        clienteId: clienteId || null,
        clienteNombre: clienteId ? null : clienteNombre,
        clienteDireccion: clienteId ? null : clienteDireccion,
        clienteTelefono: clienteId ? null : clienteTelefono,
        clienteEmail: clienteId ? null : clienteEmail,
        lugar: lugar || 'La Plata',
        fecha: new Date(fecha),
        subtotal,
        descuentoPorcentaje,
        descuentoMonto,
        total,
        financiacion,
        cuotas,
        notas,
        items: {
          create: items.map((item: any) => ({
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(presupuesto);
  } catch (error) {
    console.error('Error creating presupuesto:', error);
    return NextResponse.json(
      { error: 'Error al crear presupuesto' },
      { status: 500 }
    );
  }
}
