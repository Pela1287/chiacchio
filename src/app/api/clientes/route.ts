// ============================================
// CHIACCHIO - API Clientes
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getScopeSucursal } from "@/lib/permisoSucursal";


// GET - Listar clientes con info de membresía
export async function GET() {

  try {

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const clientes = await prisma.cliente.findMany({

      include: {
        membresias: {
          where: { estado: "ACTIVA" },
          select: { id: true }
        }
      },

      orderBy: {
        createdAt: "desc"
      }

    });

    const clientesConMembresia = clientes.map(c => ({
      ...c,
      tieneMembresia: c.membresias.length > 0
    }));

    return NextResponse.json(clientesConMembresia);

  } catch (error) {

    console.error("Error obteniendo clientes:", error);

    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );

  }

}