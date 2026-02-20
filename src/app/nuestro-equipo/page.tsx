/* ============================================
   CHIACCHIO - Nuestro Equipo (Página Pública)
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
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

export default function NuestroEquipoPage() {
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
        <h1 className={styles.heroTitle}>👷 Nuestro Equipo</h1>
        <p className={styles.heroSubtitle}>
          Profesionales electricistas con años de experiencia
        </p>
      </section>

      {/* Introducción */}
      <section className={styles.intro}>
        <div className={styles.introContent}>
          <h2>Electricistas de Confianza</h2>
          <p>
            En Chiacchio contamos con un equipo de electricistas matriculados y con amplia experiencia 
            en instalaciones domiciliarias. Cada técnico es cuidadosamente seleccionado y capacitado 
            para brindarte el mejor servicio.
          </p>
        </div>
      </section>

      {/* Grid de técnicos */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Conocé a Nuestros Técnicos</h2>
        
        {tecnicos.length > 0 ? (
          <div className={styles.teamGrid}>
            {tecnicos.map((tecnico) => (
              <Card key={tecnico.id} className={styles.teamCard}>
                <div className={styles.avatarContainer}>
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
                <div className={styles.info}>
                  <h3 className={styles.name}>
                    {tecnico.nombre} {tecnico.apellido}
                  </h3>
                  <p className={styles.specialty}>
                    ⚡ {tecnico.especialidad}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Próximamente conocerás a nuestro equipo de profesionales.</p>
          </div>
        )}
      </section>

      {/* Por qué confiar */}
      <section className={styles.trustSection}>
        <h2 className={styles.sectionTitle}>¿Por Qué Confían en Nosotros?</h2>
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>✓</div>
            <h3>Matriculados</h3>
            <p>Todos nuestros electricistas cuentan con matrícula habilitante vigente.</p>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>✓</div>
            <h3>Experiencia</h3>
            <p>Años de trabajo en instalaciones eléctricas domiciliarias.</p>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>✓</div>
            <h3>Capacitación</h3>
            <p>Formación continua en normativas y nuevas tecnologías.</p>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>✓</div>
            <h3>Garantía</h3>
            <p>Todos nuestros trabajos cuentan con garantía por escrito.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2>¿Necesitás un electricista?</h2>
        <p>Contratá tu membresía y solicitá servicio cuando lo necesites.</p>
        <a 
          href="https://wa.me/5492216011455?text=Hola!%20Quiero%20información%20sobre%20la%20membresía" 
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaButton}
        >
          Contactar por WhatsApp
        </a>
      </section>
    </div>
  );
}
