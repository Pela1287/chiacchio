/* ============================================
   CHIACCHIO - Configuración (Admin)
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Input, Card, useToast, LoadingOverlay } from '@/components/ui';
import { formatearFecha, formatearMoneda } from '@/lib/helpers';
import styles from './page.module.css';

export default function ConfiguracionPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [config, setConfig] = useState({
    linkMercadoPago: '',
    precioMembresia: '9900',
  });

  const [membresias, setMembresias] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      // Cargar configuración
      const configRes = await fetch('/api/configuracion');
      if (configRes.ok) {
        const data = await configRes.json();
        setConfig({
          linkMercadoPago: data.linkMercadoPago || '',
          precioMembresia: data.precioMembresia || '9900',
        });
      }

      // Cargar membresías activas
      const membRes = await fetch('/api/admin/membresias');
      if (membRes.ok) {
        const data = await membRes.json();
        setMembresias(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/configuracion', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Guardado',
          message: 'Configuración actualizada correctamente'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo guardar'
      });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingOverlay text="Cargando..." />;
  }

  // Calcular días hasta vencimiento
  const getDiasRestantes = (fechaProximoPago: string) => {
    const hoy = new Date();
    const proximo = new Date(fechaProximoPago);
    return Math.ceil((proximo.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/panel/admin" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver
        </Link>
        <h1 className={styles.title}>⚙️ Configuración</h1>
        <p className={styles.subtitle}>Membresía y Mercado Pago</p>
      </div>

      {/* Configuración de Membresía */}
      <Card className={styles.configCard}>
        <h3 className={styles.cardTitle}>💳 Membresía</h3>
        
        <div className={styles.configInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Precio mensual</span>
            <span className={styles.infoValue}>{formatearMoneda(9900)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Atención</span>
            <span className={styles.infoValue}>SIN LÍMITE mensual</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Ampliaciones</span>
            <span className={styles.infoValue}>20% desc. + 3 cuotas s/interés</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Obras</span>
            <span className={styles.infoValue}>30% desc. + cuotas a convenir</span>
          </div>
        </div>
      </Card>

      {/* Mercado Pago */}
      <Card className={styles.configCard}>
        <h3 className={styles.cardTitle}>🔗 Link de Mercado Pago</h3>
        <p className={styles.cardDesc}>
          Pegá acá el link de pago de Mercado Pago. Cuando un cliente quiera pagar, 
          se le enviará este link por WhatsApp.
        </p>
        
        <Input
          label="Link de pago"
          value={config.linkMercadoPago}
          onChange={(e) => setConfig(prev => ({ ...prev, linkMercadoPago: e.target.value }))}
          placeholder="https://mpago.la/xxxxxx"
        />

        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
        >
          Guardar Configuración
        </Button>
      </Card>

      {/* Membresías Activas */}
      <Card className={styles.membresiasCard}>
        <h3 className={styles.cardTitle}>📊 Membresías Activas</h3>
        
        {membresias.length > 0 ? (
          <div className={styles.membresiasList}>
            <div className={styles.membresiasHeader}>
              <span>Cliente</span>
              <span>Próximo pago</span>
              <span>Estado</span>
            </div>
            {membresias.map((m) => {
              const dias = getDiasRestantes(m.fechaProximoPago);
              const estadoColor = dias <= 3 ? '#ef4444' : dias <= 7 ? '#f59e0b' : '#22c55e';
              
              return (
                <div key={m.id} className={styles.membresiaRow}>
                  <div className={styles.clienteInfo}>
                    <span className={styles.clienteNombre}>{m.cliente?.nombre} {m.cliente?.apellido}</span>
                    <span className={styles.clienteEmail}>{m.cliente?.email}</span>
                  </div>
                  <span className={styles.fechaPago}>{formatearFecha(m.fechaProximoPago)}</span>
                  <span 
                    className={styles.estadoBadge}
                    style={{ backgroundColor: `${estadoColor}20`, color: estadoColor }}
                  >
                    {dias > 0 ? `${dias} días` : 'Vencida'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.emptyText}>No hay membresías activas</p>
        )}
      </Card>
    </div>
  );
}
