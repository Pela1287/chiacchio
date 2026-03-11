/* ============================================
   CHIACCHIO - Pagina de Inicio
   ============================================ */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { planesMembresia } from '@/data/mockData';
import styles from './page.module.css';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Profesionales de Confianza',
    description: 'Todos nuestros tecnicos estan certificados y pasan por un riguroso proceso de seleccion.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Respuesta Rapida',
    description: 'Atencion prioritaria para miembros. Respuesta garantizada en menos de 48 horas.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    title: 'Precios Transparentes',
    description: 'Sin sorpresas. Tarifas claras y presupuestos detallados antes de cada trabajo.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Ahorra con tu Membresia',
    description: 'Servicios incluidos mensualmente y descuentos exclusivos en trabajos de obra.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Garantia de Trabajo',
    description: 'Todos nuestros trabajos tienen garantia. Si no estas satisfecho, lo solucionamos.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: 'Soporte Dedicado',
    description: 'Un equipo disponible para resolver tus dudas y coordinar tus servicios.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>
              Servicios para tu hogar
            </span>
            <h1 className={styles.heroTitle}>
              Mantenimiento domiciliario <span className={styles.heroHighlight}>por membresia</span>
            </h1>
            <p className={styles.heroDescription}>
              Olvidate de buscar tecnicos cada vez que necesitas algo en tu hogar.
              Con Chiacchio tienes acceso a servicios de mantenimiento incluidos en tu plan mensual,
              con profesionales de confianza y respuesta prioritaria.
            </p>
            <div className={styles.heroActions}>
              <Link href="/auth/login">
                <Button size="large" variant="primary">
                  Comenzar Ahora
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="large" variant="outline" style={{
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white'
                }}>
                  Hablar con un Asesor
                </Button>
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImagePlaceholder}>
              <img src="/logo-chiacchio.png" alt="Chiacchio" className={styles.heroLogo} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Por que elegir Chiacchio?</h2>
            <p className={styles.sectionDescription}>
              Mas que un servicio de mantenimiento, somos tu aliado para mantener tu hogar en perfectas condiciones.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className={styles.plans}>
        <div className={styles.plansContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Nuestros Servicios</h2>
            <p className={styles.sectionDescription}>
              Elegi la opcion que mejor se adapte a las necesidades de tu hogar.
            </p>
          </div>
          <div className={styles.plansGrid}>
            {planesMembresia.map((plan, index) => (
              <div
                key={plan.id}
                className={`${styles.planCard} ${index === 0 ? styles.featured : ''}`}
              >
                {index === 0 && (
                  <span className={styles.planBadge}>Mas Popular</span>
                )}
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.nombre}</h3>
                  <div className={styles.planPrice}>
                    {plan.precio > 0 ? (
                      <>
                        <span className={styles.planCurrency}>$</span>
                        <span className={styles.planAmount}>
                          {plan.precio.toLocaleString('es-AR')}
                        </span>
                      </>
                    ) : (
                      <span className={styles.planPriceNote}>{plan.precioNota}</span>
                    )}
                  </div>
                  {plan.precio > 0 && <p className={styles.planPeriod}>por mes</p>}
                  <p className={styles.planDescription}>{plan.descripcion}</p>
                </div>
                <ul className={styles.planFeatures}>
                  {plan.beneficios.map((beneficio, i) => (
                    <li key={i} className={styles.planFeature}>
                      <svg className={styles.planFeatureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login">
                  <Button
                    variant={index === 0 ? 'primary' : 'secondary'}
                    fullWidth
                    className={styles.planButton}
                  >
                    {plan.precio > 0 ? 'Comenzar' : 'Consultar'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            Listo para tener tu hogar siempre en condiciones?
          </h2>
          <p className={styles.ctaDescription}>
            Unete a cientos de hogares que ya confian en Chiacchio para el mantenimiento de su hogar.
            Sin complicaciones, sin sorpresas.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/auth/login" className={`${styles.ctaButton} ${styles.primary}`}>
              Registrar mi Hogar
            </Link>
            <Link href="/contacto" className={`${styles.ctaButton} ${styles.secondary}`}>
              Contactar por WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
