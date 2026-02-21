/* ============================================
   CHIACCHIO - Presupuestos para Ampliaciones/Obras
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Input, Card, useToast, LoadingOverlay, Badge } from '@/components/ui';
import { formatearFecha, formatearMoneda } from '@/lib/helpers';
import styles from './page.module.css';

// Tipos de trabajos de ampliación/obra eléctrica
const tiposTrabajo = [
  { value: 'ampliacion_tablero', label: 'Ampliación de tablero eléctrico' },
  { value: 'nueva_instalacion', label: 'Nueva instalación eléctrica completa' },
  { value: 'tendido_cables', label: 'Tendido de cables nuevos' },
  { value: 'aire_instalacion', label: 'Instalación de aire acondicionado' },
  { value: 'tiro_ingenia', label: 'Aumento de potencia (tiro/ing. eléctrica)' },
  { value: 'puesta_tierra', label: 'Instalación de puesta a tierra' },
  { value: 'iluminacion', label: 'Proyecto de iluminación' },
  { value: 'automatizacion', label: 'Automatización eléctrica' },
  { value: 'otro', label: 'Otro trabajo eléctrico' },
];

export default function PresupuestosPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formData, setFormData] = useState({
    tipoTrabajo: '',
    titulo: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    presupuestoEstimado: '',
  });

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/cliente/presupuestos');
      if (res.ok) {
        const data = await res.json();
        setPresupuestos(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/cliente/presupuestos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: '¡Solicitud enviada!',
          message: 'Te contactaremos para coordinar una visita técnica'
        });
        setMostrarFormulario(false);
        setFormData({
          tipoTrabajo: '',
          titulo: '',
          descripcion: '',
          direccion: '',
          telefono: '',
          presupuestoEstimado: '',
        });
        fetchData();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'No se pudo enviar la solicitud'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="warning">Pendiente</Badge>;
      case 'aprobado':
        return <Badge variant="success">Aprobado</Badge>;
      case 'rechazado':
        return <Badge variant="error">Rechazado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
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
        <h1 className={styles.title}>📋 Presupuestos</h1>
        <p className={styles.subtitle}>
          Solicitá presupuesto para ampliaciones y obras eléctricas
        </p>
      </div>

      {/* Beneficios */}
      <Card className={styles.beneficiosCard}>
        <h3 className={styles.beneficiosTitle}>🎯 Beneficios con tu membresía</h3>
        <div className={styles.beneficiosGrid}>
          <div className={styles.beneficio}>
            <span className={styles.beneficioPorcentaje}>20%</span>
            <span className={styles.beneficioTexto}>descuento en ampliaciones</span>
          </div>
          <div className={styles.beneficio}>
            <span className={styles.beneficioPorcentaje}>30%</span>
            <span className={styles.beneficioTexto}>descuento en obras + financiación</span>
          </div>
        </div>
      </Card>

      {/* Botón nuevo presupuesto */}
      {!mostrarFormulario && (
        <Button
          variant="primary"
          fullWidth
          onClick={() => setMostrarFormulario(true)}
          style={{ marginBottom: 'var(--space-6)' }}
        >
          ➕ Solicitar Nuevo Presupuesto
        </Button>
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <Card className={styles.formCard}>
          <h3 className={styles.formTitle}>Solicitar Presupuesto</h3>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tipo de trabajo *</label>
              <select
                name="tipoTrabajo"
                required
                value={formData.tipoTrabajo}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Seleccioná el tipo de trabajo</option>
                {tiposTrabajo.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <Input
              label="Título del proyecto *"
              name="titulo"
              required
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Instalación de aire en dormitorio"
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción detallada *</label>
              <textarea
                name="descripcion"
                required
                value={formData.descripcion}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Describí el trabajo que necesitás: dimensiones, materiales preferidos, horarios disponibles, etc."
                rows={4}
              />
            </div>

            <Input
              label="Dirección del trabajo *"
              name="direccion"
              required
              value={formData.direccion}
              onChange={handleChange}
              placeholder="¿Dónde se realizará el trabajo?"
            />

            <Input
              label="Teléfono de contacto *"
              name="telefono"
              type="tel"
              required
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+54 9 221 XXX XXXX"
            />

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
              >
                Enviar Solicitud
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de presupuestos */}
      {presupuestos.length > 0 && (
        <div className={styles.lista}>
          <h3 className={styles.listaTitle}>Mis Solicitudes</h3>
          {presupuestos.map((pres) => (
            <Card key={pres.id} className={styles.presupuestoCard}>
              <div className={styles.presupuestoHeader}>
                <div>
                  <h4 className={styles.presupuestoTitulo}>{pres.titulo}</h4>
                  <p className={styles.presupuestoFecha}>{formatearFecha(pres.createdAt)}</p>
                </div>
                {getEstadoBadge(pres.estado)}
              </div>
              <p className={styles.presupuestoDesc}>{pres.descripcion}</p>
              {pres.total && (
                <div className={styles.presupuestoTotal}>
                  <span>Total:</span>
                  <span className={styles.totalValor}>{formatearMoneda(pres.total)}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {presupuestos.length === 0 && !mostrarFormulario && (
        <Card className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--space-3)', opacity: 0.3 }}>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p style={{ color: 'var(--text-secondary)' }}>
            No tenés solicitudes de presupuesto aún
          </p>
        </Card>
      )}
    </div>
  );
}
