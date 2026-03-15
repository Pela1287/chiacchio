/* ============================================
   CHIACCHIO - Bot Chat Widget
   ============================================ */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useUIStore, useDataStore } from '@/lib/store';
import { Input, Button, useToast } from '@/components/ui';
import { generarId } from '@/lib/helpers';
import type { MensajeChat, Lead } from '@/types';
import styles from './ChatWidget.module.css';

// Respuestas mock del bot
const respuestasBot: Record<string, string[]> = {
  saludo: [
    'Hola! Soy "Chiacchin" el asistente virtual de Chiacchio. Estoy aqui para ayudarte con tus consultas sobre mantenimiento domiciliario.',
    'Como puedo ayudarte hoy?'
  ],
  membresia: [
    'Tenemos 3 planes de membresia: Basico, Estandar y Premium.',
    'El plan Basico incluye 3 servicios mensuales por $5.000.',
    'El plan Estandar incluye 5 servicios por $9.000.',
    'El plan Premium incluye 10 servicios por $15.000 con beneficios exclusivos.',
    'Te gustaria que te cuente mas sobre algun plan en particular?'
  ],
  servicios: [
    'Ofrecemos servicios de: mantenimiento electrico, plomeria, pintura, instalacion de aires acondicionados, cerrajeria, jardineria y mas.',
    'Tambien realizamos trabajos de obra como ampliaciones y reformas.',
    'Que tipo de servicio necesitas?'
  ],
  presupuesto: [
    'Para solicitarte un presupuesto, necesito conocerte un poco mejor.',
    'Podrias decirme tu nombre y telefono para que un asesor te contacte?'
  ],
  default: [
    'Gracias por tu consulta! Para darte una respuesta mas precisa, necesito algunos datos.',
    'Un asesor puede contactarte por WhatsApp para ayudarte mejor.',
    'Te gustaria que te contactemos?'
  ]
};

const quickReplies = [
  'Quiero info sobre membresia',
  'Necesito un presupuesto',
  'Tipos de servicios',
  'Hablar con asesor'
];

export function ChatWidget() {
  const { chatOpen, toggleChat } = useUIStore();
 
  const { showToast } = useToast();
  const [messages, setMessages] = useState<MensajeChat[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadData, setLeadData] = useState({ nombre: '', telefono: '', zona: '', necesidad: '' });
  const [showLeadForm, setShowLeadForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Funciones definidas primero con useCallback
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const addBotMessage = useCallback((content: string) => {
    setMessages(prev => [...prev, {
      id: generarId('msg'),
      rol: 'bot',
      contenido: content,
      timestamp: new Date()
    }]);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    setMessages(prev => [...prev, {
      id: generarId('msg'),
      rol: 'usuario',
      contenido: content,
      timestamp: new Date()
    }]);
  }, []);

  // Efecto para scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Efecto para mensaje inicial
  useEffect(() => {
    if (chatOpen && !initializedRef.current) {
      initializedRef.current = true;
      const timer1 = setTimeout(() => {
        addBotMessage(respuestasBot.saludo[0]);
      }, 500);
      const timer2 = setTimeout(() => {
        addBotMessage(respuestasBot.saludo[1]);
      }, 1500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [chatOpen, addBotMessage]);

  const processMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('membresia') || lowerMessage.includes('plan') || lowerMessage.includes('precio')) {
      return respuestasBot.membresia;
    }
    if (lowerMessage.includes('servicio') || lowerMessage.includes('trabajo')) {
      return respuestasBot.servicios;
    }
    if (lowerMessage.includes('presupuesto') || lowerMessage.includes('cotizacion')) {
      setShowLeadForm(true);
      return respuestasBot.presupuesto;
    }
    if (lowerMessage.includes('asesor') || lowerMessage.includes('humano') || lowerMessage.includes('whatsapp')) {
      setShowLeadForm(true);
      return ['Claro! Te conectare con un asesor. Primero necesito algunos datos.'];
    }
    
    return respuestasBot.default;
  };

  const enviarMensajeIA = useCallback(async (texto: string) => {
    setIsTyping(true);
    try {
      // Construir historial para la IA (ultimos 10 mensajes)
      const historial = messages.slice(-10).map(m => ({
        role: m.rol === 'bot' ? 'assistant' : 'user',
        content: m.contenido,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto, historial }),
      });

      const data = await res.json();
      const respuesta = data.message || 'Disculpá, no pude responder. Contactanos por WhatsApp.';

      setIsTyping(false);
      addBotMessage(respuesta);

      // Si hay que derivar al admin
      if (data.needsAdmin) {
        setTimeout(() => {
          addBotMessage('Un asesor se va a comunicar con vos a la brevedad. También podés escribirnos al WhatsApp +54 9 221 601-1455.');
        }, 800);
      }

      // Si capturó un lead
      if (data.leadCaptured) {
        setTimeout(() => {
          addBotMessage('¡Gracias! Un asesor de Chiacchio te va a contactar pronto.');
          setShowLeadForm(false);
        }, 800);
      }
    } catch (error) {
      setIsTyping(false);
      addBotMessage('Disculpá, hubo un error. Contactanos directamente al WhatsApp +54 9 221 601-1455.');
    }
  }, [messages, addBotMessage]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const texto = inputValue.trim();
    addUserMessage(texto);
    setInputValue('');
    enviarMensajeIA(texto);
  };

  const handleQuickReply = (reply: string) => {
    addUserMessage(reply);
    enviarMensajeIA(reply);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLead: Lead = {
      id: generarId('lead'),
      nombre: leadData.nombre,
      telefono: leadData.telefono,
      zona: leadData.zona,
      necesidad: leadData.necesidad || 'Consulta desde chatbot',
      conversacion: messages,
      estado: 'nuevo',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    
    
    showToast({
      type: 'success',
      title: 'Lead capturado',
      message: 'Se ha guardado la informacion del contacto'
    });
    
    showToast({
      type: 'info',
      title: 'WhatsApp Mock',
      message: 'Notificacion enviada al Super Usuario'
    });
    
    addBotMessage('Gracias por tus datos! Un asesor te contactara pronto por WhatsApp.');
    setShowLeadForm(false);
    setLeadData({ nombre: '', telefono: '', zona: '', necesidad: '' });
  };

  const handleWhatsAppClick = () => {
    const mensaje = encodeURIComponent('Hola! Vengo del sitio de Chiacchio y me gustaria obtener mas informacion.');
    window.open(`https://wa.me/5492216011455?text=${mensaje}`, '_blank');
  };

  return (
    <div className={styles.widget}>
      <button className={styles.triggerButton} onClick={toggleChat} aria-label="Abrir chat">
        {chatOpen ? (
          <svg className={styles.closeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg className={styles.triggerIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
            <span className={styles.notificationDot} />
          </>
        )}
      </button>

      {chatOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.botAvatar}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7.5 13A1.5 1.5 0 006 14.5 1.5 1.5 0 007.5 16 1.5 1.5 0 009 14.5 1.5 1.5 0 007.5 13m9 0a1.5 1.5 0 00-1.5 1.5 1.5 1.5 0 001.5 1.5 1.5 1.5 0 001.5-1.5 1.5 1.5 0 00-1.5-1.5M12 17a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1z" />
              </svg>
            </div>
            <div className={styles.headerInfo}>
              <p className={styles.headerTitle}>Asistente Chiacchio</p>
              <p className={styles.headerStatus}>
                <span className={styles.statusDot} />
                En linea
              </p>
            </div>
          </div>

          <div className={styles.messages}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.rol === 'bot' ? styles.bot : styles.user}`}
              >
                {msg.contenido}
              </div>
            ))}
            {isTyping && (
              <div className={styles.typing}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showLeadForm ? (
            <form onSubmit={handleLeadSubmit} className={styles.leadForm}>
              <p className={styles.leadFormTitle}>Dejanos tus datos para contactarte:</p>
              <Input
                placeholder="Tu nombre"
                required
                value={leadData.nombre}
                onChange={(e) => setLeadData(prev => ({ ...prev, nombre: e.target.value }))}
              />
              <Input
                placeholder="Tu telefono"
                required
                value={leadData.telefono}
                onChange={(e) => setLeadData(prev => ({ ...prev, telefono: e.target.value }))}
              />
              <Input
                placeholder="Tu zona/barrio"
                required
                value={leadData.zona}
                onChange={(e) => setLeadData(prev => ({ ...prev, zona: e.target.value }))}
              />
              <Button type="submit" variant="primary" fullWidth>
                Enviar
              </Button>
              <button type="button" className={styles.whatsappButton} onClick={handleWhatsAppClick}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hablar por WhatsApp
              </button>
            </form>
          ) : (
            <>
              <div className={styles.quickReplies}>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className={styles.quickReply}
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <div className={styles.inputArea}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Escribe tu mensaje..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button
                    className={styles.sendButton}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
