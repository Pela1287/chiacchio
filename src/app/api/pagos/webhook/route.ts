import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { renovarMembresia } from '@/lib/services/membership';
import { logError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature');
    const topic = request.headers.get('x-topic');

    if (!signature) {
      return NextResponse.json({ error: 'Sin firma' }, { status: 401 });
    }

    const body = await request.json();

    if (topic === 'payment') {
      const { data } = body;
      const paymentId = data?.id;

      if (!paymentId) {
        return NextResponse.json({ error: 'Sin ID de pago' }, { status: 400 });
      }

      const pago = await prisma.pago.findFirst({
        where: { referencia: paymentId }
      });

      if (!pago) {
        await prisma.notificacionWhatsApp.create({
          data: {
            tipo: 'PAGO_WEBHOOK',
            destino: '',
            mensaje: `Pago ${paymentId} no encontrado en sistema`,
            estado: 'FALLIDO',
            referenciaId: null,
            error: JSON.stringify(body)
          }
        });
        return NextResponse.json({ received: true });
      }

      await prisma.pago.update({
        where: { id: pago.id },
        data: { estado: 'COMPLETADO' }
      });

      if (pago.membresiaId) {
        await renovarMembresia(pago.membresiaId, pago.id);
      }

      await prisma.notificacionWhatsApp.create({
        data: {
          tipo: 'PAGO_CONFIRMADO',
          destino: '',
          mensaje: `Pago de $${pago.monto} confirmado`,
          estado: 'ENVIADO',
          referenciaId: pago.id
        }
      });

      return NextResponse.json({ received: true, processed: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logError(error, { webhook: 'mercadopago' });
    return NextResponse.json({ error: 'Error procesando webhook' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'Webhook de pagos activo' });
}
