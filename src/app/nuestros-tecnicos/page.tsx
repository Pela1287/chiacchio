/* ============================================
   CHIACCHIO - Nuestros Técnicos (Página Pública)
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, LoadingOverlay } from '@/components/ui';
import styles from './page.module.css';

interface Tecnico {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  avatar?: string;
}

export default function NuestrosTecnicosPage() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const fetchTecnicos = async () => {
    try {
      const res = await fetch('/api/tecnicos');
      if (res.ok) {
        const data = await res.json();
        setTecnicos(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay text="Cargando..." />;
  }

  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>👷 Nuestros Técnicos</h1>
          <p className={styles.heroSubtitle}>
            Profesionales matriculados y con años de experiencia en mantenimiento eléctrico domiciliario
          </p>
        </div>
      </section>

      {/* Grid de técnicos */}
      <section className={styles.section}>
        {tecnicos.length > 0 ? (
          <div className={styles.grid}>
            {tecnicos.map((tecnico) => (
              <Card key={tecnico.id} className={styles.tecnicoCard}>
                <div className={styles.avatarWrapper}>
                  {tecnico.avatar ? (
                    <img 
                      src={tecnico.avatar} 
                      alt={`${tecnico.nombre} ${tecnico.apellido}`}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {tecnico.nombre.charAt(0)}{tecnico.apellido.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className={styles.nombre}>
                  {tecnico.nombre} {tecnico.apellido}
                </h3>
                <p className={styles.especialidad}>
                  ⚡ {tecnico.especialidad}
                </p>
                <div className={styles.badges}>
                  <span className={styles.badge}>✓ Matriculado</span>
                  <span className={styles.badge}>✓ Verificado</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 'var(--space-4)', opacity: 0.3 }}>
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Próximamente mostraremos aquí a nuestro equipo de técnicos.
            </p>
            <Link href="/contacto">
              <span className={styles.contactLink}>Contactanos para más información</span>
            </Link>
          </div>
        )}
      </section>

      {/* Info adicional */}
      <section className={styles.infoSection}>
        <h2 className={styles.infoTitle}>¿Por qué confiar en nuestros técnicos?</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📜</span>
            <h3>Matrícula Habilitante</h3>
            <p>Todos nuestros técnicos cuentan con matrícula profesional vigente.</p>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>⏱️</span>
            <h3>Años de Experiencia</h3>
            <p>Equipo con amplia trayectoria en instalaciones eléctricas domiciliarias.</p>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>✅</span>
            <h3>Verificados</h3>
            <p>Realizamos verificación de antecedentes y referencias laborales.</p>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🛡️</span>
            <h3>Garantía</h3>
            <p>Todos los trabajos cuentan con garantía escrita.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>¿Necesitás un servicio eléctrico?</h2>
        <p className={styles.ctaText}>
          Nuestros técnicos están listos para ayudarte.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/auth/registro">
            <span className={styles.ctaButton}>Contratar Servicio</span>
          </Link>
          <a href="https://wa.me/5492216011455?text=Hola!%20Quiero%20información%20sobre%20sus%20servicios%20eléctricos" target="_blank" rel="noopener noreferrer">
            <span className={styles.ctaWhatsapp}>📱 WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
