// ============================================
// CHIACCHIO - API Solicitudes
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { SolicitudRepo } from '@/lib/repositories';
import { notificarNuevaSolicitud } from '@/lib/whatsapp';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Listar solicitudes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('clienteId');
    const pendientes = searchParams.get('pendientes') === 'true';

    let solicitudes;
    if (clienteId) {
      solicitudes = await SolicitudRepo.findByClienteId(clienteId);
    } else if (pendientes) {
      solicitudes = await SolicitudRepo.findPendientes();
    } else {
      solicitudes = await SolicitudRepo.findAll();
    }

    return NextResponse.json({ solicitudes });
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// POST - Crear solicitud
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const solicitud = await SolicitudRepo.create({
      clienteId: body.clienteId,
      servicioId: body.servicioId,
      direccion: body.direccion,
      ciudad: body.ciudad,
      descripcion: body.descripcion,
      estado: 'pendiente',
      prioridad: body.prioridad || 'media',
      fechaSolicitada: new Date()
    });

    // Notificar por WhatsApp
    await notificarNuevaSolicitud({
      id: solicitud.id,
      cliente: body.clienteNombre || 'Cliente',
      servicio: body.servicioNombre || 'Servicio',
      descripcion: body.descripcion,
      direccion: body.direccion,
    });

    return NextResponse.json({ solicitud }, { status: 201 });
  } catch (error) {
    console.error('Error creando solicitud:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
