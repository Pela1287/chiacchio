/* ============================================
   CHIACCHIO - Panel Admin - Leads
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Badge, LoadingOverlay, useToast } from '@/components/ui';
import { tiempoTranscurrido } from '@/lib/helpers';
import styles from '../page.module.css';

interface Lead {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  zona: string;
  necesidad: string;
  estado: string;
  createdAt: string;
}

export default function LeadsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      const userRole = (session.user as any).role || (session.user as any).rol;
      if (!['SUPER', 'ADMIN'].includes(userRole)) {
        router.push('/panel');
        return;
      }
      fetchLeads();
    }
  }, [session, router]);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
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
          message: `El lead pasó a ${nuevoEstado}`
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

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'NUEVO': return { variant: 'error' as const, label: '🆕 Nuevo', color: '#ef4444' };
      case 'CONTACTADO': return { variant: 'warning' as const, label: '📞 Contactado', color: '#f59e0b' };
      case 'CALIFICADO': return { variant: 'info' as const, label: '✅ Calificado', color: '#3b82f6' };
      case 'CONVERTIDO': return { variant: 'success' as const, label: '💰 Convertido', color: '#22c55e' };
      case 'PERDIDO': return { variant: 'default' as const, label: '❌ Perdido', color: '#6b7280' };
      default: return { variant: 'default' as const, label: estado, color: '#6b7280' };
    }
  };

  if (loading) {
    return <LoadingOverlay text="Cargando leads..." />;
  }

  const leadsNuevos = leads.filter(l => l.estado === 'NUEVO').length;
  const leadsConvertidos = leads.filter(l => l.estado === 'CONVERTIDO').length;

  return (
    <>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
          Leads Captados
        </h1>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Badge variant="error">{leadsNuevos} nuevos</Badge>
          <Badge variant="success">{leadsConvertidos} convertidos</Badge>
        </div>
      </div>

      {/* Info */}
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
        Leads captados a traves del bot de WhatsApp y otras fuentes.
      </p>

      {/* Lista de leads */}
      <div className={styles.solicitudesGrid}>
        {leads.length === 0 ? (
          <div className={styles.emptyState} style={{ gridColumn: '1 / -1' }}>
            <p>No hay leads registrados</p>
          </div>
        ) : (
          leads.map((lead) => {
            const estadoConfig = getEstadoConfig(lead.estado);
            const isUpdating = actualizando === lead.id;

            return (
              <div key={lead.id} className={styles.solicitudCard}>
                {/* Header */}
                <div className={styles.cardHeader}>
                  <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>
                  <span className={styles.fechaSolicitud}>
                    {tiempoTranscurrido(lead.createdAt)}
                  </span>
                </div>

                {/* Cliente */}
                <div className={styles.clienteSection}>
                  <div className={styles.clienteAvatar}>
                    {lead.nombre.charAt(0)}
                  </div>
                  <div className={styles.clienteInfo}>
                    <span className={styles.clienteNombre}>{lead.nombre}</span>
                    <span className={styles.clienteContacto}>
                      {lead.telefono}
                    </span>
                  </div>
                </div>

                {/* Necesidad */}
                <div className={styles.descripcionSection}>
                  <p className={styles.descripcion}>{lead.necesidad}</p>
                </div>

                {/* Ubicación */}
                <div className={styles.ubicacionSection}>
                  <span className={styles.ubicacion}>📍 {lead.zona}</span>
                </div>

                {/* Acciones */}
                <div className={styles.accionesSection}>
                  {lead.estado === 'NUEVO' && (
                    <Button
                      variant="primary"
                      size="small"
                      loading={isUpdating}
                      onClick={() => cambiarEstado(lead.id, 'CONTACTADO')}
                    >
                      📞 Contactar
                    </Button>
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
                        onClick={() => cambiarEstado(lead.id, 'PERDIDO')}
                        style={{ color: '#ef4444' }}
                      >
                        ❌ Perdido
                      </Button>
                    </>
                  )}
                  {lead.estado === 'CALIFICADO' && (
                    <>
                      <Button
                        variant="primary"
                        size="small"
                        loading={isUpdating}
                        onClick={() => cambiarEstado(lead.id, 'CONVERTIDO')}
                      >
                        💰 Convertir
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        loading={isUpdating}
                        onClick={() => cambiarEstado(lead.id, 'PERDIDO')}
                        style={{ color: '#ef4444' }}
                      >
                        ❌ Perdido
                      </Button>
                    </>
                  )}
                  <a 
                    href={`https://wa.me/${lead.telefono?.replace(/\D/g, '')}?text=Hola%20${lead.nombre},%20te%20escribimos%20de%20Chiacchio%20sobre%20tu%20consulta`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
