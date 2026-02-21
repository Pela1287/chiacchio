/* ============================================
   CHIACCHIO - Ver Membresía
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Card, Badge, LoadingOverlay } from '@/components/ui';
import { formatearFecha, formatearMoneda } from '@/lib/helpers';
import styles from './page.module.css';

export default function MembresiaPage() {
  const { data: session, status } = useSession();
  const [membresia, setMembresia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchMembresia();
    }
  }, [session]);

  const fetchMembresia = async () => {
    try {
      const res = await fetch('/api/cliente/membresia');
      if (res.ok) {
        const data = await res.json();
        setMembresia(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingOverlay text="Cargando..." />;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/panel/cliente" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver
        </Link>
        <h1 className={styles.title}>Mi Membresía</h1>
        <p className={styles.subtitle}>Plan de Mantenimiento Eléctrico</p>
      </div>

      {membresia ? (
        <>
          {/* Card Principal */}
          <Card className={styles.membresiaCard}>
            <div className={styles.membresiaHeader}>
              <div className={styles.planIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className={styles.planInfo}>
                <h2 className={styles.planName}>Membresía Eléctrica</h2>
                <Badge variant={membresia.estado === 'ACTIVA' ? 'success' : 'warning'}>
                  {membresia.estado}
                </Badge>
              </div>
              <div className={styles.planPrecio}>
                <span className={styles.precio}>{formatearMoneda(9900)}</span>
                <span className={styles.periodo}>/mes</span>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fecha de inicio</span>
                <span className={styles.infoValue}>{formatearFecha(membresia.fechaInicio)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Próximo pago</span>
                <span className={styles.infoValue}>{formatearFecha(membresia.fechaProximoPago)}</span>
              </div>
            </div>
          </Card>

          {/* Beneficios */}
          <Card className={styles.beneficiosCard}>
            <h3 className={styles.beneficiosTitle}>✨ Beneficios de tu plan</h3>
            <ul className={styles.beneficiosList}>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Atención SIN límite</strong> - Llamá las veces que necesites</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Respuesta prioritaria ante urgencias eléctricas</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Diagnóstico sin cargo</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Soporte por WhatsApp</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Ampliaciones:</strong> 20% descuento + 3 cuotas sin interés</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Obras:</strong> 30% descuento + cuotas a convenir</span>
              </li>
            </ul>
          </Card>

          {/* Pago */}
          <Card className={styles.pagoCard}>
            <h3 className={styles.pagoTitle}>💳 Pago con Mercado Pago</h3>
            <p className={styles.pagoText}>
              Tu pago se procesa de forma segura a través de Mercado Pago.
              Una vez acreditado, recibirás confirmación por WhatsApp.
            </p>
            {membresia.estado !== 'ACTIVA' && (
              <Button variant="primary" fullWidth>
                Pagar Membresía
              </Button>
            )}
          </Card>

          {/* Acciones */}
          <div className={styles.actions}>
            <Link href="/panel/cliente/solicitudes/nueva">
              <Button variant="primary" fullWidth>
                ⚡ Solicitar Servicio
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <Card className={styles.noMembresia}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--space-4)', color: '#9ca3af' }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2 style={{ marginBottom: 'var(--space-2)' }}>Sin membresía activa</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            Contratá tu membresía por <strong>$9.900/mes</strong> con atención eléctrica SIN límite.
          </p>
          <a 
            href="https://wa.me/5492216011455?text=Hola!%20Quiero%20contratar%20la%20membresía%20de%20$9.900" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary">Contratar por WhatsApp</Button>
          </a>
        </Card>
      )}
    </div>
  );
}
