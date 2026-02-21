/* ============================================
   CHIACCHIO - Trabaja con Nosotros
   ============================================ */

import Link from 'next/link';
import { Button } from '@/components/ui';
import styles from './page.module.css';

export default function TrabajaConNosotrosPage() {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>⚡ Trabaja con Nosotros</h1>
          <p className={styles.heroSubtitle}>
            Sumate a nuestro equipo de técnicos electricistas profesionales
          </p>
        </div>
      </section>

      {/* Por qué trabajar con nosotros */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>¿Por qué elegir Chiacchio?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>💰</div>
            <h3>Ingresos Estables</h3>
            <p>Trabajo garantizado todos los meses con nuestra base de clientes con membresía.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📅</div>
            <h3>Horarios Flexibles</h3>
            <p>Organizá tu agenda de trabajo según tu disponibilidad y zona de cobertura.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🛠️</div>
            <h3>Crecimiento Profesional</h3>
            <p>Capacitación continua y posibilidad de asumir trabajos de mayor envergadura.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🤝</div>
            <h3>Equipo de Apoyo</h3>
            <p>Soporte administrativo para gestión de citas, cobros y atención al cliente.</p>
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Requisitos para Postularse</h2>
        <div className={styles.requirementsList}>
          <div className={styles.requirement}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Matrícula de electricista habilitante vigente</span>
          </div>
          <div className={styles.requirement}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Mínimo 2 años de experiencia comprobable en instalaciones eléctricas</span>
          </div>
          <div className={styles.requirement}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Disponibilidad de vehículo propio y herramientas básicas</span>
          </div>
          <div className={styles.requirement}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Antecedentes penales y buena reputación</span>
          </div>
          <div className={styles.requirement}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Vivir en zona de cobertura (La Plata y alrededores)</span>
          </div>
        </div>
      </section>

      {/* Cómo postularse */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>¿Cómo Postularse?</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Envianos tu CV</h3>
            <p>Enviá tu currículum por WhatsApp con tu experiencia y datos de contacto.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Entrevista</h3>
            <p>Coordinamos una entrevista para conocerte y evaluar tu perfil.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Evaluación Técnica</h3>
            <p>Realizamos una prueba práctica para verificar tus conocimientos.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>¡Bienvenido!</h3>
            <p>Firmamos convenio y comenzás a recibir trabajos de inmediato.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>¿Listo para sumarte?</h2>
        <p className={styles.ctaText}>
          Envianos tu CV por WhatsApp y te contactamos a la brevedad.
        </p>
        <a 
          href="https://wa.me/5492216011455?text=Hola!%20Quiero%20postularme%20como%20técnico%20electricista.%20Adjunto%20mi%20CV."
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="large">
            📱 Enviar CV por WhatsApp
          </Button>
        </a>
      </section>
    </div>
  );
}
