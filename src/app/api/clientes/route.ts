// ============================================
// CHIACCHIO - API Clientes
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Listar clientes con info de membresía
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const clientes = await prisma.cliente.findMany({
      include: {
        membresias: {
          where: { estado: 'ACTIVA' },
          select: { id: true, plan: true, estado: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Mapear para incluir tieneMembresia
    const clientesConMembresia = clientes.map(c => ({
      id: c.id,
      nombre: c.nombre,
      apellido: c.apellido,
      email: c.email,
      telefono: c.telefono,
      direccion: c.direccion,
      ciudad: c.ciudad,
      codigoPostal: c.codigoPostal,
      notas: c.notas,
      activo: c.activo,
      createdAt: c.createdAt,
      tieneMembresia: c.membresias.length > 0,
      membresia: c.membresias[0] || null
    }));

    return NextResponse.json(clientesConMembresia);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
