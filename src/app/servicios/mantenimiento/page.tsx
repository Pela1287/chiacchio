/* ============================================
   CHIACCHIO - Servicios de Mantenimiento
   ============================================ */

import Link from 'next/link';
import styles from './page.module.css';

export default function MantenimientoPage() {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>⚡ Servicio Principal</span>
          <h1 className={styles.title}>Mantenimiento Eléctrico</h1>
          <p className={styles.subtitle}>
            Atención profesional para todos los problemas eléctricos de tu hogar o comercio.
            Técnicos matriculados disponibles para resolver cualquier inconveniente.
          </p>
        </div>
      </section>

      {/* Servicios incluidos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>¿Qué incluye el servicio?</h2>
        <div className={styles.servicesGrid}>
          
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🔌</div>
            <h3>Corte de Luz General</h3>
            <p>Diagnóstico y reparación cuando se corta la luz en toda la casa. Identificamos la causa y restauramos el servicio eléctrico de forma segura.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>⚡</div>
            <h3>Llave Térmica / Diferencial</h3>
            <p>Reparación cuando la térmica o el disyuntor se bajan constantemente. Detectamos cortocircuitos y fugas eléctricas.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🔋</div>
            <h3>Tomas Corrientes</h3>
            <p>Reparación y reemplazo de enchufes quemados, sueltos o que no funcionan. Instalación de tomas nuevos donde necesites.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>💡</div>
            <h3>Interruptores y Lámparas</h3>
            <p>Cambio de interruptores dañados, instalación de lámparas, plafones y luminiarias. Mejoramos la iluminación de tus ambientes.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🏭</div>
            <h3>Tablero Eléctrico</h3>
            <p>Revisión, reparación y ampliación del tablero principal. Ordenamos circuitos y mejoramos la seguridad de tu instalación.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>❄️</div>
            <h3>Aires Acondicionados</h3>
            <p>Instalación eléctrica completa para equipos split. Verificamos la potencia disponible y realizamos las conexiones necesarias.</p>
          </div>

        </div>
      </section>

      {/* Cómo funciona */}
      <section className={styles.sectionLight}>
        <h2 className={styles.sectionTitle}>¿Cómo funciona?</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Solicitás el servicio</h3>
            <p>Desde tu panel de cliente o por WhatsApp, nos contás cuál es el problema eléctrico que tenés.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Coordinamos la visita</h3>
            <p>Te contactamos para acordar el día y horario que mejor te convenga. Respontemos rápido.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>El técnico resuelve</h3>
            <p>Un electricista matriculado va a tu domicilio, diagnostica y repara el problema en el momento.</p>
          </div>
        </div>
      </section>

      {/* Beneficios membresía */}
      <section className={styles.section}>
        <div className={styles.benefitsCard}>
          <h2>🌟 Con tu Membresía</h2>
          <ul className={styles.benefitsList}>
            <li>✅ Atención <strong>SIN límite</strong> mensual</li>
            <li>✅ Respuesta prioritaria ante urgencias</li>
            <li>✅ Diagnóstico sin cargo</li>
            <li>✅ Técnicos matriculados y de confianza</li>
            <li>✅ Soporte por WhatsApp los 7 días</li>
            <li>✅ Cobertura en La Plata y alrededores</li>
          </ul>
          <Link href="/membresia" className={styles.ctaButton}>
            Ver planes y precios
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>¿Tenés un problema eléctrico?</h2>
        <p>Contactanos ahora y te ayudamos a resolverlo</p>
        <div className={styles.ctaButtons}>
          <a href="https://wa.me/5492216011455?text=Hola!%20Necesito%20un%20servicio%20de%20mantenimiento%20eléctrico" className={styles.whatsappButton}>
            WhatsApp: +54 9 221 601-1455
          </a>
        </div>
      </section>
    </div>
  );
}
