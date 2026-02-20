// ============================================
// CHIACCHIO - API Configuración
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Obtener configuración
export async function GET() {
  try {
    const linkMp = await prisma.configuracion.findUnique({
      where: { clave: 'link_mercado_pago' }
    });

    const precio = await prisma.configuracion.findUnique({
      where: { clave: 'membresia_precio' }
    });

    return NextResponse.json({
      linkMercadoPago: linkMp?.valor || '',
      precioMembresia: precio?.valor || '9900',
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      linkMercadoPago: '',
      precioMembresia: '9900'
    });
  }
}

// PUT - Actualizar configuración
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { linkMercadoPago, precioMembresia } = body;

    // Guardar link de Mercado Pago
    if (linkMercadoPago !== undefined) {
      await prisma.configuracion.upsert({
        where: { clave: 'link_mercado_pago' },
        update: { valor: linkMercadoPago },
        create: { 
          clave: 'link_mercado_pago', 
          valor: linkMercadoPago,
          descripcion: 'Link de pago de Mercado Pago'
        },
      });
    }

    // Guardar precio
    if (precioMembresia) {
      await prisma.configuracion.upsert({
        where: { clave: 'membresia_precio' },
        update: { valor: precioMembresia },
        create: { 
          clave: 'membresia_precio', 
          valor: precioMembresia,
          descripcion: 'Precio mensual de la membresía'
        },
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al guardar' },
      { status: 500 }
    );
  }
}
