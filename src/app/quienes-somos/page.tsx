/* ============================================
   CHIACCHIO - Quienes Somos
   ============================================ */

import { Button } from '@/components/ui';
import styles from './page.module.css';

export default function QuienesSomosPage() {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Quienes Somos</h1>
        <p className={styles.heroDescription}>
          Mas de 10 años brindando soluciones de mantenimiento domiciliario
        </p>
      </section>

      {/* Story */}
      <section className={styles.section}>
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>Nuestra Historia</h2>
          <p className={styles.text}>
            Chiacchio nacio de la necesidad de brindar un servicio de mantenimiento domiciliario 
            confiable, transparente y accesible para todos los hogares. Fundada por profesionales 
            con amplia experiencia en el rubro, nuestra empresa se propuso cambiar la forma en que 
            las personas cuidan sus hogares.
          </p>
          <p className={styles.text}>
            Con el paso de los años, hemos construido una red de profesionales de confianza 
            que comparten nuestra vision de excelencia y compromiso con el cliente. Cada tecnico 
            que forma parte de Chiacchio pasa por un riguroso proceso de seleccion y capacitacion 
            continua.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className={styles.sectionAlt}>
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Confianza</h3>
              <p className={styles.valueText}>
                Todos nuestros profesionales estan verificados. 
                Tu hogar esta en buenas manos.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Puntualidad</h3>
              <p className={styles.valueText}>
                Respetamos tu tiempo. Si decimos que estaremos a las 9, 
                estaremos a las 9.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Transparencia</h3>
              <p className={styles.valueText}>
                Precios claros, sin sorpresas. Sabes exactamente lo que pagas 
                antes de comenzar cualquier trabajo.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Calidad</h3>
              <p className={styles.valueText}>
                Garantizamos nuestro trabajo. Si no estas satisfecho, 
                lo solucionamos sin costo adicional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className={styles.section}>
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>En Numeros</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>500+</span>
              <span className={styles.statLabel}>Hogares atendidos</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Profesionales</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>10+</span>
              <span className={styles.statLabel}>Años de experiencia</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>98%</span>
              <span className={styles.statLabel}>Clientes satisfechos</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Listo para unirte a Chiacchio?</h2>
        <p className={styles.ctaText}>
          Descubre la tranquilidad de tener tu hogar siempre en condiciones.
        </p>
        <Button variant="primary" size="large">Comenzar Ahora</Button>
      </section>
    </div>
  );
}
