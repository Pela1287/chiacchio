// ============================================
// CHIACCHIO - API Chat Bot
// ============================================
export const dynamic = "force-dynamic";


import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Sos el asistente virtual de Chiacchio, una empresa de MANTENIMIENTO ELECTRICO DOMICILIARIO Y COMERCIAL por membresia en La Plata, Argentina.

IDENTIDAD:
- Tu nombre es "Chachi", el asistente de Chiacchio
- Sos amable, profesional, pacienta y empatico
- Usas espanol argentino: "vos", "te", "hace", "podes"
- Nunca sos agresivo, nunca discutis con el cliente
- Si el cliente esta molesto, reconoces su frustracion y ofreces soluciones

INFORMACION DE LA EMPRESA:
- Servicio: MANTENIMIENTO ELECTRICO DOMICILIARIO Y COMERCIAL exclusivamente
- Zona de cobertura: La Plata y alrededores, Buenos Aires, Argentina
- Membresia: $9.900/mes con ATENCION SIN LIMITE MENSUAL
- WhatsApp directo: +54 9 221 601-1455
- Email: contacto@chiacchio.com
- Pago: a traves de Mercado Pago, confirmacion por WhatsApp

BENEFICIOS DE LA MEMBRESIA:
* Atencion electrica ilimitada mensual (sin limite de llamadas)
* Respuesta prioritaria
* Diagnostico sin cargo
* Soporte por WhatsApp
* AMPLIACIONES: 20% de descuento + hasta 3 cuotas sin interes
* OBRAS: 30% de descuento + cuotas a convenir

SERVICIOS ELECTRICOS:
- Corte de luz general o parcial
- Problemas con llave termica/diferencial que salta
- Reparacion de tomas corrientes e interruptores
- Instalacion/reparacion de lamparas y luminarias
- Problemas en tablero electrico
- Instalacion/reparacion de aires acondicionados
- Tiro electrico (aumentar potencia)
- Puesta a tierra
- Cableado nuevo
- Conexion de electrodomesticos
- Instalaciones comerciales e industriales livianas

SOLO HACEMOS ELECTRICIDAD: Si preguntan por plomeria, gasista, pintura, cerrajeria: deciles amablemente que solo trabajamos con electricidad.

REGLAS DE CONDUCTA:
1. NUNCA conflictes con el cliente
2. Si esta enojado: "Entiendo tu frustracion, te ayudo ahora mismo."
3. Si hay insultos: "Quiero ayudarte, pero necesito que hablemos con respeto. Un asesor puede contactarte si preferis."
4. NUNCA inventes precios de obras (requieren visita tecnica)
5. NUNCA prometas tiempos exactos que no podes garantizar

CUANDO DERIVAR AL ADMIN (poner tag exacto):
- Reclamos por trabajos anteriores
- Solicitudes de reembolso
- Problemas de facturacion o cobros
- Emergencias electricas graves (riesgo de incendio, cortocircuito activo)
- Disputas sobre presupuestos
- Quejas formales
Usar: [DERIVAR_ADMIN: motivo]

CAPTURA DE LEADS (cuando hay interes real):
Usar: [NOMBRE: nombre][TELEFONO: numero][ZONA: zona][NECESIDAD: descripcion]`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Respuestas contextuales de fallback (cuando no hay IA externa)
function respuestaFallback(mensaje: string, historial: ChatMessage[]): string {
  const lower = mensaje.toLowerCase();
  const turno = historial.filter(m => m.role === 'user').length;

  // Saludo inicial — solo si el mensaje ES un saludo
  const esSaludo = /^(hola|buenos|buenas|buen dia|buenas tardes|buenas noches|hey|hi|saludos|que tal|como estan|buenas!|hola!)[\s!.]*$/.test(lower.trim());
  if (esSaludo) {
    return 'Hola! Soy Chachi, el asistente de Chiacchio Electricidad. Estoy aca para ayudarte con todo lo que necesites sobre nuestros servicios electricos. Como puedo ayudarte?';
  }

  // Queja o reclamo
  if (lower.includes('reclamo') || lower.includes('queja') || lower.includes('mal trabajo') || 
      lower.includes('no funciona') || lower.includes('rompio')) {
    return 'Entiendo tu frustracion y lamento mucho lo que paso. Esto es algo que necesita atencion urgente de uno de nuestros asesores. [DERIVAR_ADMIN: reclamo por trabajo anterior]\n\nTe voy a conectar con un asesor ahora mismo para que puedan resolver tu situacion.';
  }

  // Emergencia
  if (lower.includes('incendio') || lower.includes('chispa') || lower.includes('humo') || 
      lower.includes('emergencia') || lower.includes('peligro') || lower.includes('se quemo')) {
    return 'IMPORTANTE: Si hay riesgo de incendio o peligro electrico activo, llama al 911 inmediatamente. [DERIVAR_ADMIN: emergencia electrica]\n\nTambien comunicate con nosotros urgente por WhatsApp al +54 9 221 601-1455.';
  }

  // Precio / costo
  if (lower.includes('precio') || lower.includes('cuanto') || lower.includes('costo') || lower.includes('valor')) {
    return 'Nuestra membresia mensual tiene un valor de $9.900 por mes e incluye ATENCION ELECTRICA ILIMITADA.\n\nCon la membresia tenes:\n• Todas las visitas que necesites sin costo adicional\n• Diagnostico sin cargo\n• Respuesta prioritaria\n• Descuentos en obras y ampliaciones\n\nLos trabajos de obra o ampliacion requieren una visita tecnica previa para presupuestar. Te interesa mas info sobre la membresia?';
  }

  // Membresia / plan
  if (lower.includes('membresia') || lower.includes('plan') || lower.includes('suscripcion') || lower.includes('afiliacion')) {
    return 'Nuestra membresia cuesta $9.900 por mes e incluye:\n\n✓ Atencion electrica ILIMITADA (sin limite de visitas)\n✓ Respuesta prioritaria\n✓ Diagnostico sin cargo\n✓ Soporte por WhatsApp\n✓ 20% de descuento en ampliaciones\n✓ 30% de descuento en obras\n\nEl pago se realiza por Mercado Pago y recibis confirmacion por WhatsApp.\n\nQueres que un asesor te contacte para contarte mas?';
  }

  // Servicios que ofrecen
  if (lower.includes('servicio') || lower.includes('que hacen') || lower.includes('que trabajan') || lower.includes('trabajo')) {
    return 'Nos especializamos en mantenimiento electrico domiciliario y comercial. Algunos de nuestros servicios:\n\n⚡ Cortes de luz general o parcial\n⚡ Llaves termicas y diferenciales\n⚡ Tomas corrientes e interruptores\n⚡ Tableros electricos\n⚡ Lamparas y luminarias\n⚡ Aires acondicionados\n⚡ Puesta a tierra\n⚡ Cableado nuevo\n⚡ Tiro electrico (aumento de potencia)\n\nTodos estos servicios estan incluidos en la membresia mensual. Necesitas algo en particular?';
  }

  // Zona de cobertura
  if (lower.includes('zona') || lower.includes('donde') || lower.includes('cubren') || lower.includes('la plata') || lower.includes('berisso') || lower.includes('ensenada')) {
    return 'Trabajamos en La Plata y alrededores: Berisso, Ensenada, City Bell, Gonnet, Villa Elisa y zonas cercanas.\n\nEsta en esa zona? Te puedo ayudar a iniciar la membresia.';
  }

  // Hablar con asesor / persona
  if (lower.includes('asesor') || lower.includes('hablar con') || lower.includes('persona') || lower.includes('humano') || lower.includes('llamar')) {
    return 'Claro! Podes comunicarte directamente con un asesor por WhatsApp al +54 9 221 601-1455.\n\nO si queres que te contactemos nosotros, dejame tu nombre, telefono y zona y te llamamos a la brevedad.';
  }

  // WhatsApp
  if (lower.includes('whatsapp') || lower.includes('wsp') || lower.includes('numero')) {
    return 'Nuestro WhatsApp es +54 9 221 601-1455. Podes escribirnos directamente ahi para consultas urgentes o agendar una visita.';
  }

  // Contacto / email
  if (lower.includes('email') || lower.includes('mail') || lower.includes('contacto')) {
    return 'Podes contactarnos por:\n\n📱 WhatsApp: +54 9 221 601-1455\n📧 Email: contacto@chiacchio.com\n\nO si queres, deja tus datos y un asesor te contacta.';
  }

  // El cliente quiere contratar o mostro interes
  if (lower.includes('quiero') || lower.includes('me interesa') || lower.includes('contratar') || 
      lower.includes('registrar') || lower.includes('darme de alta') || lower.includes('si') && turno > 1) {
    return 'Excelente! Para que un asesor te contacte y te ayude a activar tu membresia, necesito algunos datos:\n\n¿Cual es tu nombre?\n¿Tu numero de telefono?\n¿En que zona estas (barrio/localidad)?';
  }

  // Corte de luz especifico
  if (lower.includes('corte') || lower.includes('sin luz') || lower.includes('se fue la luz') || lower.includes('oscuro')) {
    return 'Entiendo, un corte de luz puede ser muy molesto. Como miembro de Chiacchio, un electricista puede visitarte sin costo adicional.\n\nSi ya sos cliente, podes reportar la emergencia por WhatsApp al +54 9 221 601-1455.\n\nSi todavia no sos cliente, te cuento que con la membresia de $9.900/mes tenes atencion ilimitada. Te interesa?';
  }

  // Pago / factura
  if (lower.includes('pago') || lower.includes('factura') || lower.includes('mercado pago') || lower.includes('cobro')) {
    return 'El pago de la membresia se realiza a traves de Mercado Pago. Una vez acreditado, recibis confirmacion por WhatsApp.\n\nSi tenes algun problema con un cobro o factura, te conecto con un asesor. [DERIVAR_ADMIN: consulta sobre pago/facturacion]';
  }

  // No electrico
  if (lower.includes('plomero') || lower.includes('plomeria') || lower.includes('gasista') || 
      lower.includes('pintura') || lower.includes('cerraj') || lower.includes('jardin')) {
    return 'Gracias por consultarnos! Lamentablemente solo trabajamos con servicios electricos domiciliarios y comerciales. Para plomeria, pintura u otros servicios, te recomendamos buscar un profesional de esa especialidad.\n\nEn lo que es electricidad, estamos a tu disposicion. Tenes algun problema electrico en casa o en tu negocio?';
  }

  // Respuesta por defecto
  const defaults = [
    'Entiendo tu consulta. Podrias darme mas detalles para ayudarte mejor? O si preferis, podes contactarnos directamente por WhatsApp al +54 9 221 601-1455.',
    'Gracias por escribirnos! Para ayudarte mejor, podes contarme que tipo de problema electrico tenes o que informacion necesitas sobre nuestros servicios?',
    'Estoy aca para ayudarte con todo lo relacionado a servicios electricos. Podes preguntarme sobre precios, cobertura, servicios o la membresia mensual.',
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mensaje, historial = [] } = body;

    if (!mensaje?.trim()) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    // Intentar usar OpenAI si hay API key configurada
    const openaiKey = process.env.OPENAI_API_KEY;
    let respuesta: string;

    if (openaiKey) {
      try {
        const messages = [
          { role: 'system' as const, content: SYSTEM_PROMPT },
          ...(historial as ChatMessage[]).slice(-8),
          { role: 'user' as const, content: mensaje },
        ];

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages,
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          respuesta = data.choices?.[0]?.message?.content || respuestaFallback(mensaje, historial as ChatMessage[]);
        } else {
          respuesta = respuestaFallback(mensaje, historial as ChatMessage[]);
        }
      } catch {
        respuesta = respuestaFallback(mensaje, historial as ChatMessage[]);
      }
    } else {
      // Sin API key: usar respuestas contextuales inteligentes
      respuesta = respuestaFallback(mensaje, historial as ChatMessage[]);
    }

    // Detectar si hay que derivar al admin
    const derivarAdmin = respuesta.includes('[DERIVAR_ADMIN:');
    const motivoDerivacion = derivarAdmin
      ? (respuesta.match(/\[DERIVAR_ADMIN:\s*([^\]]+)\]/) || [])[1] || 'Consulta sensible'
      : null;

    // Detectar lead capturado
    const leadCapturado = respuesta.includes('[NOMBRE:') && respuesta.includes('[TELEFONO:');

    // Limpiar tags internos de la respuesta
    const respuestaLimpia = respuesta
      .replace(/\[NOMBRE:[^\]]+\]/g, '')
      .replace(/\[TELEFONO:[^\]]+\]/g, '')
      .replace(/\[ZONA:[^\]]+\]/g, '')
      .replace(/\[NECESIDAD:[^\]]+\]/g, '')
      .replace(/\[DERIVAR_ADMIN:[^\]]+\]/g, '')
      .trim();

    return NextResponse.json({
      success: true,
      message: respuestaLimpia,
      leadCaptured: leadCapturado,
      needsAdmin: derivarAdmin,
      adminReason: motivoDerivacion,
    });

  } catch (error) {
    console.error('Error en chat bot:', error);
    return NextResponse.json({
      success: false,
      message: 'Disculpa, hubo un problema. Podes contactarnos por WhatsApp al +54 9 221 601-1455',
    }, { status: 500 });
  }
}
