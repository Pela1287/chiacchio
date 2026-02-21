// ============================================
// CHIACCHIO - Servicio Bot IA (FASE 3)
// ============================================

import prisma from '@/lib/prisma';
import { notificarNuevoLead } from './whatsapp';

// Tipos
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface BotResponse {
  message: string;
  leadCaptured?: boolean;
  needsHuman?: boolean;
}

// Configuración
const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gpt-3.5-turbo';

// System prompt del bot
const SYSTEM_PROMPT = `Eres el asistente virtual de Chiacchio, una empresa de mantenimiento domiciliario por membresía en Argentina.

Tu objetivo es:
1. Ayudar a los visitantes a entender los servicios y planes de membresía
2. Capturar leads interesados (nombre, teléfono, zona y necesidad)
3. Derivar a un asesor humano cuando sea necesario

INFORMACIÓN DE LA EMPRESA:
- Plan Básico: $5.000/mes, 3 servicios de mantenimiento
- Plan Estándar: $9.000/mes, 5 servicios de mantenimiento  
- Plan Premium: $15.000/mes, 10 servicios de mantenimiento
- Todos los planes incluyen atención prioritaria y soporte WhatsApp
- Servicios: electricidad, plomería, pintura, aire acondicionado, cerrajería, jardinería, obras

REGLAS IMPORTANTES:
- Sé amable, profesional y conciso
- Cuando detectes interés real, solicita: nombre, teléfono, zona y describe tu necesidad
- Si el cliente quiere hablar con una persona, indica que lo conectarás con un asesor
- NO des precios específicos de trabajos de obra (requieren visita técnica)
- NO prometas tiempos de respuesta específicos
- NO inventes información que no tengas

Cuando captures datos de un lead, usa el formato:
[NOMBRE: nombre del cliente]
[TELEFONO: número con código de país]
[ZONA: barrio/localidad]
[NECESIDAD: descripción breve]`;

/**
 * Busca artículos relevantes en la base de conocimiento
 */
async function buscarEnBaseConocimiento(pregunta: string): Promise<string> {
  const articulos = await prisma.kbArticulo.findMany({
    where: { activo: true },
  });

  // Búsqueda simple por palabras clave
  const palabrasClave = pregunta.toLowerCase().split(' ');
  const relevantes = articulos.filter(a => {
    const contenido = `${a.titulo} ${a.contenido}`.toLowerCase();
    return palabrasClave.some(p => contenido.includes(p));
  });

  if (relevantes.length === 0) return '';
  
  return relevantes.map(a => `[${a.titulo}]: ${a.contenido}`).join('\n\n');
}

/**
 * Extrae datos del lead del mensaje del bot
 */
function extraerLead(mensaje: string): { nombre: string; telefono: string; zona: string; necesidad: string } | null {
  const nombreMatch = mensaje.match(/\[NOMBRE:\s*([^\]]+)\]/);
  const telefonoMatch = mensaje.match(/\[TELEFONO:\s*([^\]]+)\]/);
  const zonaMatch = mensaje.match(/\[ZONA:\s*([^\]]+)\]/);
  const necesidadMatch = mensaje.match(/\[NECESIDAD:\s*([^\]]+)\]/);

  if (nombreMatch && telefonoMatch) {
    return {
      nombre: nombreMatch[1].trim(),
      telefono: telefonoMatch[1].trim(),
      zona: zonaMatch?.[1]?.trim() || '',
      necesidad: necesidadMatch?.[1]?.trim() || '',
    };
  }

  return null;
}

/**
 * Detecta si el usuario quiere hablar con un humano
 */
function detectaNecesidadHumano(mensaje: string): boolean {
  const palabrasClave = [
    'hablar con alguien',
    'asesor',
    'humano',
    'persona real',
    'llamame',
    'telefono',
    'comunicarme',
    'urgente',
    'ya',
  ];
  
  return palabrasClave.some(p => mensaje.toLowerCase().includes(p));
}

/**
 * Procesa un mensaje del chatbot
 */
export async function procesarMensaje(
  mensaje: string,
  historial: ChatMessage[],
  telefono?: string
): Promise<BotResponse> {
  // Verificar si quiere hablar con humano
  if (detectaNecesidadHumano(mensaje)) {
    return {
      message: '¡Entendido! Te conectaré con un asesor humano. En breve te contactarán por WhatsApp.',
      needsHuman: true,
    };
  }

  // Buscar contexto en la base de conocimiento
  const contexto = await buscarEnBaseConocimiento(mensaje);

  // Si no hay API de IA, usar respuestas predefinidas (modo mock)
  if (!AI_API_KEY) {
    return procesarMensajeMock(mensaje, historial);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...(contexto ? [{ role: 'system', content: `Contexto adicional:\n${contexto}` }] : []),
          ...historial,
          { role: 'user', content: mensaje },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const respuestaBot = data.choices?.[0]?.message?.content || 'Disculpa, no pude procesar tu consulta.';

    // Verificar si capturó un lead
    const lead = extraerLead(respuestaBot);
    if (lead) {
      // Guardar lead en BD
      const nuevoLead = await prisma.lead.create({
        data: {
          nombre: lead.nombre,
          telefono: lead.telefono,
          zona: lead.zona,
          necesidad: lead.necesidad,
          conversacion: historial as any,
          estado: 'NUEVO',
        },
      });

      // Notificar por WhatsApp
      await notificarNuevoLead({
        id: nuevoLead.id,
        nombre: lead.nombre,
        telefono: lead.telefono,
        zona: lead.zona,
        necesidad: lead.necesidad,
      });

      return {
        message: respuestaBot.replace(/\[NOMBRE:.*\]|\[TELEFONO:.*\]|\[ZONA:.*\]|\[NECESIDAD:.*\]/g, '').trim(),
        leadCaptured: true,
      };
    }

    return { message: respuestaBot };
  } catch (error) {
    console.error('Error en Bot IA:', error);
    return procesarMensajeMock(mensaje, historial);
  }
}

/**
 * Procesa mensaje sin IA (modo mock/desarrollo)
 */
function procesarMensajeMock(mensaje: string, historial: ChatMessage[]): BotResponse {
  const lower = mensaje.toLowerCase();

  // Respuestas predefinidas
  if (lower.includes('precio') || lower.includes('cuanto') || lower.includes('costo')) {
    return {
      message: 'Nuestros planes de membresía son:\n\n• Básico: $5.000/mes (3 servicios)\n• Estándar: $9.000/mes (5 servicios)\n• Premium: $15.000/mes (10 servicios)\n\n¿Te interesa alguno en particular?',
    };
  }

  if (lower.includes('servicio') || lower.includes('hacen')) {
    return {
      message: 'Ofrecemos servicios de:\n\n🔧 Electricidad\n🚿 Plomería\n🎨 Pintura\n❄️ Aire acondicionado\n🔐 Cerrajería\n🌳 Jardinería\n🏗️ Obras y ampliaciones\n\n¿Qué servicio necesitas?',
    };
  }

  if (lower.includes('membresia') || lower.includes('plan') || lower.includes('suscripcion')) {
    return {
      message: 'Con una membresía tenés:\n\n✅ Servicios mensuales incluidos\n✅ Atención prioritaria\n✅ Descuentos en obras\n✅ Soporte por WhatsApp\n\n¿Querés que te contacte un asesor para contarte más?',
    };
  }

  if (lower.includes('si') || lower.includes('interes') || lower.includes('quiero')) {
    return {
      message: '¡Genial! Para ayudarte mejor, necesito algunos datos:\n\n¿Cuál es tu nombre?\n¿Tu teléfono?\n¿En qué zona estás?\n¿Qué servicio necesitás?\n\nO si preferís, puedo conectarte con un asesor.',
    };
  }

  // Si el usuario está dando datos personales
  const tieneDatos = lower.includes('llamo') || lower.includes('mi nombre') || /\d{8,}/.test(mensaje);
  if (tieneDatos && historial.length > 2) {
    return {
      message: '¡Perfecto! Hemos recibido tus datos. Un asesor te contactará por WhatsApp en las próximas horas. ¿Hay algo más en lo que pueda ayudarte?',
      leadCaptured: true,
    };
  }

  // Respuesta por defecto
  return {
    message: '¡Hola! Soy el asistente virtual de Chiacchio. Puedo ayudarte con:\n\n• Información sobre membresías\n• Tipos de servicios\n• Precios y planes\n\n¿En qué puedo ayudarte?',
  };
}

/**
 * Guarda un lead manualmente
 */
export async function guardarLead(datos: {
  nombre: string;
  telefono: string;
  zona: string;
  necesidad: string;
  conversacion?: ChatMessage[];
}) {
  const lead = await prisma.lead.create({
    data: {
      nombre: datos.nombre,
      telefono: datos.telefono,
      zona: datos.zona,
      necesidad: datos.necesidad,
      conversacion: datos.conversacion as any,
      estado: 'NUEVO',
    },
  });

  // Notificar
  await notificarNuevoLead({
    id: lead.id,
    nombre: datos.nombre,
    telefono: datos.telefono,
    zona: datos.zona,
    necesidad: datos.necesidad,
  });

  return lead;
}
