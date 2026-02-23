import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { procesarMensajeWhatsApp } from '@/lib/whatsapp';
import { procesarMensaje } from '@/lib/bot';
import { logError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'chiacchio-webhook-2025';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages) {
      return NextResponse.json({ received: true });
    }

    const message = value.messages[0];
    const from = message.from;
    const text = message.text?.body;
    const messageId = message.id;

    if (!text) {
      return NextResponse.json({ received: true });
    }

    console.log(`📩 Mensaje recibido de ${from}: ${text}`);

    await prisma.notificacionWhatsApp.create({
      data: {
        tipo: 'MENSAJE_ENTRANTE',
        destino: from,
        mensaje: text,
        estado: 'ENVIADO',
        referenciaId: null
      }
    });

    const cliente = await prisma.cliente.findFirst({
      where: { telefono: { contains: from.slice(-10) } }
    });

    let respuesta: string;

    if (cliente) {
      const resultado = await procesarMensaje(text, [], from);
      respuesta = resultado.message;
    } else {
      const lead = await prisma.lead.findFirst({
        where: { telefono: { contains: from.slice(-10) } }
      });

      if (lead) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { 
            conversacion: {
              push: {
                rol: 'user',
                mensaje: text,
                timestamp: new Date().toISOString()
              }
            }
          }
        });
      }

      const resultado = await procesarMensaje(text, [], from);
      respuesta = resultado.message;
    }

    await procesarMensajeWhatsApp({
      to: from,
      message: respuesta
    });

    await prisma.notificacionWhatsApp.create({
      data: {
        tipo: 'MENSAJE_SALIENTE',
        destino: from,
        mensaje: respuesta,
        estado: 'ENVIADO',
        referenciaId: cliente?.id || null
      }
    });

    return NextResponse.json({ received: true, processed: true });
  } catch (error) {
    logError(error, { webhook: 'whatsapp' });
    return NextResponse.json({ received: true, error: 'Processing failed' }, { status: 500 });
  }
}
