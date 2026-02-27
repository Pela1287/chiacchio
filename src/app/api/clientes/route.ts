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

    const scope = await getScopeSucursal();

    if (!scope.ok) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: scope.status }
      );
    }

    const where =
      scope.role === "ADMIN"
        ? { sucursalId: scope.sucursalId }
        : {};

    const clientes = await prisma.cliente.findMany({

      where,

      include: {
        membresias: {
          where: { estado: "ACTIVA" },
          select: {
            id: true,
            plan: true,
            estado: true
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }

    });

    return NextResponse.json(clientes);

  } catch (error) {

    console.error("Error obteniendo clientes:", error);

    return NextResponse.json(
      { error: "Error del servidor" },
      { status: 500 }
    );

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

  }
}
