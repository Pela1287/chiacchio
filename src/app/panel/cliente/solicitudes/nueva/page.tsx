/* ============================================
   CHIACCHIO - Nueva Solicitud de Servicio
   Sistema de Mantenimiento Eléctrico Domiciliario
   ============================================ */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, useToast, LoadingOverlay } from '@/components/ui';
import styles from './page.module.css';

// Solo trabajos eléctricos
const tiposTrabajoElectrico = [
  { value: 'corte_luz', label: '⚡ Corte de luz general', descripcion: 'Sin electricidad en toda la casa' },
  { value: 'termica', label: '🔌 Salta la térmica/diferencial', descripcion: 'La llave se baja constantemente' },
  { value: 'toma_corriente', label: '🔋 Toma corriente dañado', descripcion: 'Enchufe quemado o sin funcionamiento' },
  { value: 'interruptor', label: '💡 Interruptor dañado', descripcion: 'No prende/apaga la luz correctamente' },
  { value: 'lampara', label: '💡 Lámpara/Luminiaria', descripcion: 'Problemas con lamparitas o artefactos' },
  { value: 'tablero', label: '🏭 Tablero eléctrico', descripcion: 'Problemas en el tablero principal' },
  { value: 'aire_instalacion', label: '❄️ Instalación aire acondicionado', descripcion: 'Colocar nuevo equipo' },
  { value: 'aire_reparacion', label: '❄️ Reparación aire acondicionado', descripcion: 'Equipo con fallas' },
  { value: 'tiro_ingenia', label: '⬆️ Tiro/Ing. eléctrica', descripcion: 'Subir la potencia contratada' },
  { value: 'puesta_tierra', label: '🌱 Puesta a tierra', descripcion: 'Instalación de toma de tierra' },
  { value: 'cableado', label: '🔗 Cableado nuevo', descripcion: 'Tendido de cables eléctricos' },
  { value: 'electrodomestico', label: '🔌 Conexión electrodoméstico', descripcion: 'Instalación de estufa, horno, etc.' },
  { value: 'otro', label: '🔧 Otro trabajo eléctrico', descripcion: 'Otro tipo de trabajo eléctrico' },
];

const nivelesUrgencia = [
  { value: 'baja', label: 'Sin urgencia - Cuando puedan', color: '#22c55e' },
  { value: 'media', label: 'Normal - En los próximos días', color: '#3b82f6' },
  { value: 'alta', label: 'Alta - Lo antes posible', color: '#f59e0b' },
  { value: 'urgente', label: '⚡ URGENTE - Emergencia', color: '#ef4444' },
];

export default function NuevaSolicitudPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [membresia, setMembresia] = useState<any>(null);

  const [formData, setFormData] = useState({
    tipoTrabajo: '',
    urgencia: 'media',
    direccion: '',
    ciudad: '',
    descripcion: '',
    telefono: '',
  });
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoNombre, setFotoNombre] = useState('');
  const fotoInputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTipoChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tipoTrabajo: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!membresia || membresia.serviciosDisponibles <= 0) {
      showToast({
        type: 'error',
        title: 'Sin servicios disponibles',
        message: 'No tienes servicios disponibles en tu membresía'
      });
      return;
    }

    if (!formData.tipoTrabajo || !formData.direccion || !formData.descripcion) {
      showToast({
        type: 'error',
        title: 'Campos incompletos',
        message: 'Por favor completa todos los campos obligatorios'
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/cliente/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, foto }),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: '¡Solicitud creada!',
          message: 'Te contactaremos por WhatsApp para coordinar'
        });
        router.push('/panel/cliente');
      } else {
        const error = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Error al crear la solicitud'
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

  if (status === 'loading' || loading) {
    return <LoadingOverlay text="Cargando..." />;
  }

  if (!membresia) {
    return (
      <div className={styles.container}>
        <Card className={styles.noMembresia}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--space-4)', color: '#f59e0b' }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2 style={{ marginBottom: 'var(--space-2)' }}>Sin membresía activa</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            Para solicitar servicios necesitas una membresía activa.
          </p>
          <Link href="/panel/cliente/membresia">
            <Button variant="primary">Ver membresías</Button>
          </Link>
        </Card>
      </div>
    );
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
        <h1 className={styles.title}>⚡ Nueva Solicitud</h1>
        <p className={styles.subtitle}>Servicio de Mantenimiento Eléctrico</p>
      </div>

      {/* Servicios disponibles */}
      <Card className={styles.serviciosCard}>
        <div className={styles.serviciosInfo}>
          <div className={styles.serviciosIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <p className={styles.serviciosLabel}>Servicios disponibles</p>
            <p className={styles.serviciosValue}>{membresia.serviciosDisponibles} restantes</p>
          </div>
        </div>
        <div className={styles.serviciosBar}>
          <div 
            className={styles.serviciosBarFill}
            style={{ 
              width: `${(membresia.serviciosDisponibles / (membresia.serviciosDisponibles + membresia.serviciosUsados)) * 100}%` 
            }}
          />
        </div>
      </Card>

      {/* Formulario */}
      <Card className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {/* Tipo de trabajo */}
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>
              ⚡ ¿Qué trabajo eléctrico necesitás?
            </h3>
            
            <div className={styles.tiposGrid}>
              {tiposTrabajoElectrico.map((tipo) => (
                <button
                  key={tipo.value}
                  type="button"
                  className={`${styles.tipoCard} ${formData.tipoTrabajo === tipo.value ? styles.tipoCardSelected : ''}`}
                  onClick={() => handleTipoChange(tipo.value)}
                >
                  <span className={styles.tipoLabel}>{tipo.label}</span>
                  <span className={styles.tipoDesc}>{tipo.descripcion}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Urgencia */}
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>
              🕐 ¿Qué tan urgente es?
            </h3>
            
            <div className={styles.urgenciaGrid}>
              {nivelesUrgencia.map((nivel) => (
                <button
                  key={nivel.value}
                  type="button"
                  className={`${styles.urgenciaCard} ${formData.urgencia === nivel.value ? styles.urgenciaCardSelected : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, urgencia: nivel.value }))}
                  style={{ borderColor: formData.urgencia === nivel.value ? nivel.color : undefined }}
                >
                  <span className={styles.urgenciaLabel}>{nivel.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>
              📍 ¿Dónde es el servicio?
            </h3>

            <Input
              label="Dirección *"
              name="direccion"
              required
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Calle y número, piso, depto"
            />

            <Input
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              placeholder="La Plata, Buenos Aires..."
            />

            <Input
              label="Teléfono de contacto *"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+54 9 221 XXX XXXX"
            />
          </div>

          {/* Descripción */}
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>
              📝 Contanos más detalles
            </h3>

            <div className={styles.textareaGroup}>
              <label className={styles.textareaLabel}>
                Describí el problema *
              </label>
              <textarea
                name="descripcion"
                required
                value={formData.descripcion}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Ejemplo: Se corta la luz cada vez que prendo el aire acondicionado. Ya probé bajar todas las llaves pero sigue pasando..."
                rows={4}
              />
            </div>
          </div>

          {/* Foto opcional */}
          <div className={styles.formSection}>
            <h3 className={styles.formSectionTitle}>
              📷 Foto del problema (opcional)
            </h3>
            <div className={styles.fotoUploadArea}>
              <input
                ref={fotoInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    showToast({ type: 'error', title: 'Imagen muy grande', message: 'Máximo 5MB' });
                    return;
                  }
                  setFotoNombre(file.name);
                  const reader = new FileReader();
                  reader.onload = (ev) => setFoto(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }}
              />
              {foto ? (
                <div className={styles.fotoPreviewWrap}>
                  <img src={foto} alt="Foto del problema" className={styles.fotoPreview} />
                  <div className={styles.fotoInfo}>
                    <span className={styles.fotoNombre}>{fotoNombre}</span>
                    <button
                      type="button"
                      className={styles.fotoRemove}
                      onClick={() => { setFoto(null); setFotoNombre(''); }}
                    >
                      Eliminar foto
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.fotoBtn}
                  onClick={() => fotoInputRef.current?.click()}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className={styles.fotoBtnText}>Para mayor detalle, si querés cargá una foto</span>
                  <span className={styles.fotoBtnSub}>JPG, PNG o WEBP · Máximo 5MB</span>
                </button>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={membresia.serviciosDisponibles <= 0 || !formData.tipoTrabajo}
            >
              ⚡ Enviar Solicitud
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
