'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Badge, Button, LoadingOverlay, useToast } from '@/components/ui';
import styles from '../clientes/page.module.css';

interface Membresia {
  id: string;
  precio: number;
  estado: string;
  fechaInicio: string;
  fechaVencimiento: string;
  ultimoPago: string | null;
  cliente: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
}

export default function MembresiasPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchMembresias();
    }
  }, [session]);

  const fetchMembresias = async () => {
    try {
      const res = await fetch('/api/admin/membresias');
      if (res.ok) {
        const data = await res.json();
        setMembresias(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (membresiaId: string, accion: string) => {
    if (!confirm(`¿Confirmar acción: ${accion}?`)) return;

    setActualizando(membresiaId);
    try {
      const res = await fetch('/api/admin/membresias', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membresiaId, accion }),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Membresía actualizada',
          message: `La membresía fue ${accion}da correctamente`
        });
        fetchMembresias();
      } else {
        const result = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: result.error || 'No se pudo actualizar'
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

  const getDiasRestantes = (fechaVencimiento: string | null) => {
    if (!fechaVencimiento) return null;
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const vencimiento = new Date(fechaVencimiento);
      vencimiento.setHours(0, 0, 0, 0);
      
      const diff = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    } catch {
      return null;
    }
  };

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return 'Sin fecha';
    try {
      const d = new Date(fecha);
      return d.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  if (loading) {
    return <LoadingOverlay text="Cargando membresías..." />;
  }

  return (
    <>
      <div className={styles.toolbar}>
        <h2 style={{ margin: 0 }}>Membresías Activas</h2>
        <Badge variant="success">{membresias.length} activas</Badge>
      </div>

      {membresias.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--space-4)', color: 'var(--text-tertiary)' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
          </svg>
          <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>No hay membresías activas</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Activá una membresía desde la sección de Clientes
          </p>
        </div>
      ) : (
        <div className={styles.clientesGrid}>
          {membresias.map((memb) => {
            const diasRestantes = getDiasRestantes(memb.fechaVencimiento);
            const isUpdating = actualizando === memb.id;
            
            return (
              <div key={memb.id} className={styles.clientCard}>
                <div className={styles.clientHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem'
                    }}>
                      ⚡
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {memb.cliente?.nombre} {memb.cliente?.apellido}
                      </p>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                        {memb.cliente?.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant={memb.estado === 'ACTIVA' ? 'success' : 'warning'}>
                    {memb.estado}
                  </Badge>
                </div>

                <div className={styles.clientDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Precio mensual</span>
                    <span className={styles.detailValue}>${memb.precio?.toLocaleString()}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Fecha inicio</span>
                    <span className={styles.detailValue}>{formatearFecha(memb.fechaInicio)}</span>
                  </div>
                  {memb.ultimoPago && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Último pago</span>
                      <span className={styles.detailValue}>{formatearFecha(memb.ultimoPago)}</span>
                    </div>
                  )}
                </div>

                {diasRestantes !== null && (
                  <div style={{
                    background: diasRestantes <= 7 ? '#fef3c7' : 'var(--bg-tertiary)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: 'var(--space-3)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                        Vencimiento
                      </span>
                      <span style={{
                        fontWeight: 600,
                        color: diasRestantes <= 7 ? '#d97706' : 'var(--text-primary)'
                      }}>
                        {formatearFecha(memb.fechaVencimiento)}
                      </span>
                    </div>
                    <div style={{ marginTop: 'var(--space-1)' }}>
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600,
                        color: diasRestantes <= 3 ? '#dc2626' : diasRestantes <= 7 ? '#d97706' : 'var(--text-tertiary)'
                      }}>
                        {diasRestantes > 0 
                          ? `Vence en ${diasRestantes} días` 
                          : diasRestantes === 0 
                            ? '¡Vence hoy!' 
                            : '¡Vencida!'}
                      </span>
                    </div>
                  </div>
                )}

                <div className={styles.clientActions}>
                  {memb.estado === 'ACTIVA' && (
                    <Button
                      variant="ghost"
                      size="small"
                      loading={isUpdating}
                      onClick={() => cambiarEstado(memb.id, 'suspender')}
                    >
                      ⏸️ Suspender
                    </Button>
                  )}
                  {memb.estado === 'SUSPENDIDA' && (
                    <Button
                      variant="primary"
                      size="small"
                      loading={isUpdating}
                      onClick={() => cambiarEstado(memb.id, 'activar')}
                    >
                      ▶️ Activar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="small"
                    loading={isUpdating}
                    onClick={() => cambiarEstado(memb.id, 'cancelar')}
                    style={{ color: '#ef4444' }}
                  >
                    ❌ Cancelar
                  </Button>
                  <a 
                    href={`https://wa.me/${memb.cliente?.telefono?.replace(/\D/g, '')}?text=Hola%20${memb.cliente?.nombre},%20te%20escribimos%20de%20Chiacchio`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button style={{
                      background: '#25D366',
                      color: 'white',
                      border: 'none',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--border-radius)',
                      fontSize: 'var(--font-size-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-1)'
                    }}>
                      💬 WhatsApp
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

