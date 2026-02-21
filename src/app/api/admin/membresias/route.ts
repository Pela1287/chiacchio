// ============================================
// CHIACCHIO - API Admin Membresías
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Listar membresías activas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const membresias = await prisma.membresia.findMany({
      where: { estado: 'ACTIVA' },
      include: {
        cliente: {
          select: {
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          }
        }
      },
      orderBy: { fechaProximoPago: 'asc' },
    });

    return NextResponse.json(membresias.map(m => ({
      id: m.id,
      plan: m.plan,
      precio: m.precio.toNumber(),
      estado: m.estado,
      fechaInicio: m.fechaInicio,
      fechaProximoPago: m.fechaProximoPago,
      serviciosUsados: m.serviciosUsados,
      cliente: m.cliente,
    })));

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

// POST - Crear membresía para un cliente
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que es admin o super
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || (user.rol !== 'ADMIN' && user.rol !== 'SUPER')) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    const body = await request.json();
    const { clienteId } = body;

    if (!clienteId) {
      return NextResponse.json({ error: 'clienteId es requerido' }, { status: 400 });
    }

    // Verificar si ya tiene membresía activa
    const membresiaExistente = await prisma.membresia.findFirst({
      where: { 
        clienteId: clienteId,
        estado: 'ACTIVA'
      }
    });

    if (membresiaExistente) {
      return NextResponse.json({ 
        error: 'El cliente ya tiene una membresía activa',
        membresia: membresiaExistente
      }, { status: 400 });
    }

    // Crear membresía nueva
    const hoy = new Date();
    const proximoPago = new Date(hoy);
    proximoPago.setMonth(proximoPago.getMonth() + 1);

    const membresia = await prisma.membresia.create({
      data: {
        clienteId: clienteId,
        plan: 'ESTANDAR',
        precio: 9900,
        estado: 'ACTIVA',
        fechaInicio: hoy,
        fechaProximoPago: proximoPago,
        serviciosDisponibles: 999, // ILIMITADO
        serviciosUsados: 0,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Membresía creada correctamente',
      membresia: {
        id: membresia.id,
        plan: membresia.plan,
        precio: membresia.precio.toNumber(),
        estado: membresia.estado,
        fechaInicio: membresia.fechaInicio,
        fechaProximoPago: membresia.fechaProximoPago,
      }
    });

  } catch (error) {
    console.error('Error creando membresía:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
