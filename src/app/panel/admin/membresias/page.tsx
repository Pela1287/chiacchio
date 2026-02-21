/* ============================================
   CHIACCHIO - Admin - Membresías Activas
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Badge, LoadingOverlay } from '@/components/ui';
import styles from '../clientes/page.module.css';

interface Membresia {
  id: string;
  plan: string;
  precio: number;
  estado: string;
  fechaInicio: string;
  fechaProximoPago: string;
  serviciosUsados: number;
  cliente: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
}

export default function MembresiasPage() {
  const { data: session } = useSession();
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getDiasRestantes = (fechaProximoPago: string) => {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const proximo = new Date(fechaProximoPago);
      proximo.setHours(0, 0, 0, 0);
      
      const diff = Math.ceil((proximo.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    } catch {
      return 0;
    }
  };

  const formatearFecha = (fecha: string) => {
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
            const diasRestantes = getDiasRestantes(memb.fechaProximoPago);
            
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
                  <Badge variant="success">Activa</Badge>
                </div>

                <div className={styles.clientDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Plan</span>
                    <span className={styles.detailValue}>{memb.plan}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Precio mensual</span>
                    <span className={styles.detailValue}>${memb.precio?.toLocaleString()}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Servicios usados</span>
                    <span className={styles.detailValue}>{memb.serviciosUsados || 0} (ilimitados)</span>
                  </div>
                </div>

                <div style={{
                  background: diasRestantes <= 7 ? '#fef3c7' : 'var(--bg-tertiary)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--border-radius)',
                  marginBottom: 'var(--space-3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      Próximo pago
                    </span>
                    <span style={{
                      fontWeight: 600,
                      color: diasRestantes <= 7 ? '#d97706' : 'var(--text-primary)'
                    }}>
                      {formatearFecha(memb.fechaProximoPago)}
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

                <div className={styles.clientActions}>
                  <a 
                    href={`https://wa.me/${memb.cliente?.telefono?.replace(/\D/g, '')}?text=Hola%20${memb.cliente?.nombre},%20te%20escribimos%20de%20Chiacchio%20para%20recordarte%20que%20tu%20membresía%20está%20activa`}
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
