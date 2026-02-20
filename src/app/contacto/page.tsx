/* ============================================
   CHIACCHIO - Contacto
   ============================================ */

'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Select } from '@/components/ui';
import styles from './page.module.css';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio (en FASE 3 esto enviaria WhatsApp)
    console.log('Formulario enviado:', formData);
    setEnviado(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (enviado) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Mensaje Enviado</h2>
          <p className={styles.successText}>
            Gracias por contactarnos. Te responderemos a la brevedad por WhatsApp o email.
          </p>
          <Button variant="primary" onClick={() => setEnviado(false)}>
            Enviar otro mensaje
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Contactanos</h1>
        <p className={styles.heroDescription}>
          Estamos aqui para ayudarte. Escribinos y te responderemos a la brevedad.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          {/* Info */}
          <div className={styles.info}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <h3 className={styles.infoTitle}>Telefono</h3>
                <p className={styles.infoText}>+5492216011455</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <h3 className={styles.infoTitle}>WhatsApp</h3>
                <p className={styles.infoText}>+5492216011455</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h3 className={styles.infoTitle}>Email</h3>
                <p className={styles.infoText}>contacto@chiacchio.com</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h3 className={styles.infoTitle}>Horario</h3>
                <p className={styles.infoText}>Lunes a Viernes: 8:00 - 18:00</p>
                <p className={styles.infoText}>Sabados: 9:00 - 13:00</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.form}>
            <h2 className={styles.formTitle}>Envianos un mensaje</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <Input
                  label="Nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Tu nombre"
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>
              <div className={styles.formGrid}>
                <Input
                  label="Telefono"
                  required
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  placeholder="+5492216011455"
                />
                <Select
                  label="Asunto"
                  required
                  value={formData.asunto}
                  onChange={(e) => handleChange('asunto', e.target.value)}
                  options={[
                    { value: 'consulta', label: 'Consulta general' },
                    { value: 'presupuesto', label: 'Solicitar presupuesto' },
                    { value: 'membresia', label: 'Informacion sobre membresia' },
                    { value: 'soporte', label: 'Soporte tecnico' },
                    { value: 'otro', label: 'Otro' }
                  ]}
                  placeholder="Selecciona un asunto"
                />
              </div>
              <Textarea
                label="Mensaje"
                required
                value={formData.mensaje}
                onChange={(e) => handleChange('mensaje', e.target.value)}
                placeholder="Cuentanos en que podemos ayudarte..."
                rows={5}
              />
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button type="submit" variant="primary" size="large" fullWidth>
                  Enviar Mensaje
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
