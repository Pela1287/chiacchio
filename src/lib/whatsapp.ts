// ============================================
// CHIACCHIO - Servicio WhatsApp (FASE 3)
// ============================================

import prisma from '@/lib/prisma';

interface SendMessageParams {
  to: string;
  message: string;
  tipo: string;
  referenciaId?: string;
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Configuración
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

/**
 * Envía un mensaje de WhatsApp usando Meta Cloud API
 */
export async function sendWhatsAppMessage({
  to,
  message,
  tipo,
  referenciaId,
}: SendMessageParams): Promise<WhatsAppResponse> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    await prisma.notificacionWhatsApp.create({
      data: {
        tipo,
        destino: to,
        mensaje: message,
        estado: 'MOCK',
        referenciaId,
        enviadoAt: new Date(),
      },
    });
    
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  try {
    const formattedTo = to.replace(/\D/g, '');
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedTo,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      await prisma.notificacionWhatsApp.create({
        data: {
          tipo,
          destino: to,
          mensaje: message,
          estado: 'FALLIDO',
          referenciaId,
          error: JSON.stringify(data),
        },
      });

      return { success: false, error: data.error?.message || 'Error enviando mensaje' };
    }

    await prisma.notificacionWhatsApp.create({
      data: {
        tipo,
        destino: to,
        mensaje: message,
        estado: 'ENVIADO',
        referenciaId,
        enviadoAt: new Date(),
      },
    });

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    console.error('Error en WhatsApp:', error);
    
    await prisma.notificacionWhatsApp.create({
      data: {
        tipo,
        destino: to,
        mensaje: message,
        estado: 'FALLIDO',
        referenciaId,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
    });

    return { success: false, error: 'Error de conexión' };
  }
}

/**
 * Notifica al Super Usuario de un nuevo registro
 */
export async function notificarNuevoRegistro(cliente: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}) {
  const config = await prisma.configuracion.findUnique({
    where: { clave: 'whatsapp_super' },
  });

  if (!config?.valor) {
    console.log('[DEV] No hay número de super usuario configurado');
    return;
  }

  const message = `🆕 *NUEVO REGISTRO*

👤 *Cliente:* ${cliente.nombre} ${cliente.apellido}
📧 *Email:* ${cliente.email}
📱 *Teléfono:* ${cliente.telefono}

_Ingrese al panel para gestionar este nuevo cliente._`;

  return sendWhatsAppMessage({
    to: config.valor,
    message,
    tipo: 'nuevo_registro',
  });
}

/**
 * Notifica de una nueva solicitud de servicio
 */
export async function notificarNuevaSolicitud(solicitud: {
  id: string;
  cliente: string;
  servicio: string;
  descripcion: string;
  direccion: string;
}) {
  const config = await prisma.configuracion.findUnique({
    where: { clave: 'whatsapp_super' },
  });

  if (!config?.valor) return;

  const message = `📋 *NUEVA SOLICITUD*

👤 *Cliente:* ${solicitud.cliente}
🔧 *Servicio:* ${solicitud.servicio}
📍 *Dirección:* ${solicitud.direccion}
📝 *Descripción:* ${solicitud.descripcion.substring(0, 200)}

_ID: ${solicitud.id}_`;

  return sendWhatsAppMessage({
    to: config.valor,
    message,
    tipo: 'nueva_solicitud',
    referenciaId: solicitud.id,
  });
}

/**
 * Notifica de un nuevo lead captado por el bot
 */
export async function notificarNuevoLead(lead: {
  id: string;
  nombre: string;
  telefono: string;
  zona: string;
  necesidad: string;
}) {
  const config = await prisma.configuracion.findUnique({
    where: { clave: 'whatsapp_super' },
  });

  if (!config?.valor) return;

  const message = `🤖 *NUEVO LEAD (BOT)*

👤 *Nombre:* ${lead.nombre}
📱 *Teléfono:* ${lead.telefono}
📍 *Zona:* ${lead.zona}
💬 *Necesidad:* ${lead.necesidad.substring(0, 200)}

_Este lead fue capturado por el bot de IA._
_ID: ${lead.id}_`;

  return sendWhatsAppMessage({
    to: config.valor,
    message,
    tipo: 'nuevo_lead',
    referenciaId: lead.id,
  });
}

/**
 * Notifica solicitud de hablar con asesor
 */
export async function notificarEscalarAAsesor(telefono: string, contexto: string) {
  const config = await prisma.configuracion.findUnique({
    where: { clave: 'whatsapp_super' },
  });

  if (!config?.valor) return;

  const message = `🔄 *ESCALAR A ASESOR*

📱 *Cliente:* ${telefono}
💬 *Contexto:*
${contexto}

_El cliente solicitó hablar con un asesor humano._`;

  return sendWhatsAppMessage({
    to: config.valor,
    message,
    tipo: 'escalar',
  });
}

export async function procesarMensajeWhatsApp(params: {
  to: string;
  message: string;
}): Promise<WhatsAppResponse> {
  return sendWhatsAppMessage({
    to: params.to,
    message: params.message,
    tipo: 'respuesta_bot',
  });
}

