// ============================================
// CHIACCHIO - API Configuración
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Obtener toda la configuración
export async function GET() {
  try {
    const configItems = await prisma.configuracion.findMany();
    
    return NextResponse.json({
      config: configItems.map(item => ({
        id: item.id,
        clave: item.clave,
        valor: item.valor,
        descripcion: item.descripcion,
      }))
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      config: [],
      linkMercadoPago: '',
      precioMembresia: '9900'
    });
  }
}

// POST - Actualizar configuración (múltiples items)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || (session?.user as any)?.rol;
    
    if (!session || !['SUPER', 'ADMIN'].includes(userRole || '')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { config } = body;

    if (!Array.isArray(config)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
    }

    // Guardar cada item de configuración
    for (const item of config) {
      await prisma.configuracion.upsert({
        where: { clave: item.clave },
        update: { valor: item.valor },
        create: { 
          clave: item.clave, 
          valor: item.valor,
          descripcion: item.descripcion || '',
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

// PUT - Actualizar configuración (formato antiguo para compatibilidad)
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
