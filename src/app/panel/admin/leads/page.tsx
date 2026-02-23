'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Badge, Button, LoadingOverlay, useToast } from '@/components/ui';
import { tiempoTranscurrido } from '@/lib/helpers';
import styles from './page.module.css';

interface Lead {
  id: string;
  nombre: string;
  telefono: string;
  zona: string;
  necesidad: string;
  estado: string;
  conversacion: any[];
  createdAt: string;
}

export default function LeadsPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [leadSeleccionado, setLeadSeleccionado] = useState<Lead | null>(null);
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    setActualizando(id);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Estado actualizado',
          message: `Lead marcado como ${nuevoEstado.toLowerCase()}`
        });
        fetchLeads();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'No se pudo actualizar'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión'
      });
    } finally {
      setActualizando(null);
    }
  };

  const leadsFiltrados = filtroEstado === 'TODOS' 
    ? leads 
    : leads.filter(l => l.estado === filtroEstado);

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'NUEVO': return { variant: 'info' as const, label: '🆕 Nuevo' };
      case 'CONTACTADO': return { variant: 'warning' as const, label: '📞 Contactado' };
      case 'CALIFICADO': return { variant: 'success' as const, label: '✅ Calificado' };
      case 'CONVERTIDO': return { variant: 'success' as const, label: '🎉 Convertido' };
      case 'DESCARTADO': return { variant: 'error' as const, label: '❌ Descartado' };
      default: return { variant: 'default' as const, label: estado };
    }
  };

  const stats = [
    { label: 'Total Leads', value: leads.length, color: '#3b82f6' },
    { label: 'Nuevos', value: leads.filter(l => l.estado === 'NUEVO').length, color: '#22c55e' },
    { label: 'Calificados', value: leads.filter(l => l.estado === 'CALIFICADO').length, color: '#8b5cf6' },
    { label: 'Convertidos', value: leads.filter(l => l.estado === 'CONVERTIDO').length, color: '#f59e0b' },
  ];

  if (loading) {
    return <LoadingOverlay text="Cargando leads..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Leads Capturados</h1>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.filtros}>
        {['TODOS', 'NUEVO', 'CONTACTADO', 'CALIFICADO', 'CONVERTIDO', 'DESCARTADO'].map(estado => (
          <button
            key={estado}
            className={`${styles.filtroBtn} ${filtroEstado === estado ? styles.filtroActivo : ''}`}
            onClick={() => setFiltroEstado(estado)}
          >
            {estado}
          </button>
        ))}
      </div>

      <div className={styles.leadsGrid}>
        {leadsFiltrados.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay leads con este filtro</p>
          </div>
        ) : (
          leadsFiltrados.map(lead => {
            const estadoConfig = getEstadoConfig(lead.estado);
            const isUpdating = actualizando === lead.id;

            return (
              <div key={lead.id} className={styles.leadCard}>
                <div className={styles.cardHeader}>
                  <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>
                  <span className={styles.fecha}>{tiempoTranscurrido(lead.createdAt)}</span>
                </div>

                <div className={styles.leadInfo}>
                  <h3 className={styles.leadNombre}>{lead.nombre}</h3>
                  <div className={styles.leadContacto}>
                    <span>📱 {lead.telefono}</span>
                    <span>📍 {lead.zona}</span>
                  </div>
                </div>

                <div className={styles.necesidad}>
                  <strong>Necesidad:</strong>
                  <p>{lead.necesidad}</p>
                </div>

                {lead.conversacion && lead.conversacion.length > 0 && (
                  <div className={styles.ultimoMensaje}>
                    <strong>Último mensaje:</strong>
                    <p>{lead.conversacion[lead.conversacion.length - 1]?.mensaje || 'Sin mensaje'}</p>
                  </div>
                )}

                <div className={styles.acciones}>
                  {lead.estado === 'NUEVO' && (
                    <>
                      <Button
                        variant="primary"
                        size="small"
                        loading={isUpdating}
                        onClick={() => cambiarEstado(lead.id, 'CONTACTADO')}
                      >
                        📞 Marcar Contactado
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        loading={isUpdating}
                        onClick={() => cambiarEstado(lead.id, 'DESCARTADO')}
                      >
                        ❌ Descartar
                      </Button>
                    </>
                  )}
                  {lead.estado === 'CONTACTADO' && (
                    <>
                      <Button
                        variant="primary"
                        size="small"
                        loading={isUpdating}
                        onClick={() => cambiarEstado(lead.id, 'CALIFICADO')}
                      >
                        ✅ Calificar
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        loading={isUpdating}
                        onClick={() => cambiarEstado(lead.id, 'DESCARTADO')}
                      >
                        ❌ Descartar
                      </Button>
                    </>
                  )}
                  {lead.estado === 'CALIFICADO' && (
                    <Button
                      variant="primary"
                      size="small"
                      loading={isUpdating}
                      onClick={() => cambiarEstado(lead.id, 'CONVERTIDO')}
                    >
                      🎉 Convertir a Cliente
                    </Button>
                  )}
                  <a 
                    href={`https://wa.me/${lead.telefono.replace(/\D/g, '')}?text=Hola%20${lead.nombre},%20te%20escribimos%20de%20Chiacchio`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    💬 WhatsApp
                  </a>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setLeadSeleccionado(lead)}
                  >
                    👁️ Ver conversación
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {leadSeleccionado && (
        <div className={styles.modal} onClick={() => setLeadSeleccionado(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Conversación: {leadSeleccionado.nombre}</h2>
              <button onClick={() => setLeadSeleccionado(null)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            <div className={styles.conversacion}>
              {leadSeleccionado.conversacion && leadSeleccionado.conversacion.length > 0 ? (
                leadSeleccionado.conversacion.map((msg: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`${styles.mensaje} ${msg.rol === 'user' ? styles.mensajeUser : styles.mensajeBot}`}
                  >
                    <div className={styles.mensajeRol}>
                      {msg.rol === 'user' ? '👤 Cliente' : '🤖 Bot'}
                    </div>
                    <div className={styles.mensajeTexto}>{msg.mensaje}</div>
                    {msg.timestamp && (
                      <div className={styles.mensajeFecha}>
                        {new Date(msg.timestamp).toLocaleString('es-AR')}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.empty}>No hay conversación registrada</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
