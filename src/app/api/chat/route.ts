// ============================================
// CHIACCHIO - API Chat Bot con IA
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// System prompt del bot - SOLO SERVICIOS ELÉCTRICOS
const SYSTEM_PROMPT = `Eres el asistente virtual de Chiacchio, una empresa de MANTENIMIENTO ELÉCTRICO DOMICILIARIO Y COMERCIAL por membresía en La Plata, Argentina.

IMPORTANTE: Solo respondes sobre servicios ELÉCTRICOS. Si preguntan sobre plomería, jardinería u otros servicios NO eléctricos, indicá amablemente que solo trabajamos con electricidad.

INFORMACIÓN DE LA EMPRESA:
- Servicio: MANTENIMIENTO ELÉCTRICO DOMICILIARIO Y COMERCIAL exclusivamente
- Membresía: $9.900/mes con ATENCIÓN SIN LÍMITE MENSUAL
- Beneficios incluidos:
  * Atención eléctrica ilimitada
  * Respuesta prioritaria
  * Diagnóstico sin cargo
  * Soporte por WhatsApp

BENEFICIOS ADICIONALES:
- AMPLIACIONES: 20% de descuento sobre el presupuesto + hasta 3 cuotas sin interés
- OBRAS: 30% de descuento sobre el presupuesto + cuotas a convenir con el cliente

SERVICIOS ELÉCTRICOS QUE OFRECEMOS:
- Corte de luz general
- Problemas con llave térmica/diferencial
- Reparación de tomas corrientes
- Reparación de interruptores
- Instalación/reparación de lámparas y luminiarias
- Problemas en tablero eléctrico
- Instalación de aires acondicionados
- Reparación de aires acondicionados
- Tiro/ingeniería eléctrica (aumentar potencia)
- Puesta a tierra
- Cableado nuevo
- Conexión de electrodomésticos

PAGO:
- Se realiza a través de Mercado Pago
- El cliente recibe confirmación por WhatsApp una vez acreditado el pago

CONTACTO:
- WhatsApp: +54 9 221 601-1455
- Email: contacto@chiacchio.com
- Zona: La Plata y alrededores, Buenos Aires, Argentina

REGLAS IMPORTANTES:
- Sé amable, profesional y conciso
- Respondé en español argentino (usá "vos" no "tú")
- Si preguntan por servicios NO eléctricos, explicá que solo hacemos electricidad
- Cuando detectes interés real, pedí nombre, teléfono y zona para que un asesor contacte
- Si el cliente quiere hablar con una persona, indicá que lo conectarás con un asesor
- La membresía NO tiene límite de atenciones mensuales, es ILIMITADA
- NO inventes información que no tengas
- Si no sabés algo, ofrecé conectar con un asesor

Cuando captures datos de un interesado, usa el formato:
[NOMBRE: nombre del cliente]
[TELEFONO: número con código de país]
[ZONA: barrio/localidad]
[NECESIDAD: descripción breve]`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mensaje, historial = [] } = body;

    if (!mensaje) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    // Crear cliente ZAI
    const zai = await ZAI.create();

    // Construir mensajes para el chat
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Agregar historial de conversación
    for (const msg of historial as ChatMessage[]) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }

    // Agregar mensaje actual
    messages.push({ role: 'user', content: mensaje });

    // Llamar a la IA
    const completion = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const respuesta = completion.choices?.[0]?.message?.content || 
      'Disculpa, no pude procesar tu consulta. ¿Podés contactarnos por WhatsApp al +54 9 221 601-1455?';

    // Detectar si capturó datos de lead
    const leadCapturado = respuesta.includes('[NOMBRE:') && respuesta.includes('[TELEFONO:');

    // Limpiar la respuesta de los tags de datos
    const respuestaLimpia = respuesta
      .replace(/\[NOMBRE:[^\]]+\]/g, '')
      .replace(/\[TELEFONO:[^\]]+\]/g, '')
      .replace(/\[ZONA:[^\]]+\]/g, '')
      .replace(/\[NECESIDAD:[^\]]+\]/g, '')
      .trim();

    return NextResponse.json({
      success: true,
      message: respuestaLimpia,
      leadCaptured: leadCapturado,
    });

  } catch (error) {
    console.error('Error en chat bot:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar el mensaje',
        message: 'Disculpa, hubo un error. Podés contactarnos por WhatsApp al +54 9 221 601-1455'
      },
      { status: 500 }
    );
  }
}
