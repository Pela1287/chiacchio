/* ============================================
   CHIACCHIO - Membresías
   ============================================ */

import Link from 'next/link';
import styles from './page.module.css';

export default function MembresiaPage() {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>✨ Plan Único</span>
          <h1 className={styles.title}>Membresía Chiacchio</h1>
          <p className={styles.subtitle}>
            Mantenimiento eléctrico domiciliario por una suscripción mensual.
            Atención ilimitada, técnicos matriculados y respuesta prioritaria.
          </p>
          <div className={styles.priceTag}>
            <span className={styles.currency}>$</span>
            <span className={styles.amount}>9.900</span>
            <span className={styles.period}>/mes</span>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>¿Qué incluye tu membresía?</h2>
        
        <div className={styles.benefitsGrid}>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>⚡</div>
            <div>
              <h3>Atención SIN Límite</h3>
              <p>Llamá las veces que necesites. No hay límite mensual de servicios de mantenimiento eléctrico.</p>
            </div>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🚀</div>
            <div>
              <h3>Respuesta Prioritaria</h3>
              <p>Los miembros tienen prioridad en la agenda. Respuesta más rápida ante urgencias eléctricas.</p>
            </div>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🔍</div>
            <div>
              <h3>Diagnóstico Sin Cargo</h3>
              <p>El diagnóstico de cada visita está incluido. Solo pagás si necesitás repuestos o materiales.</p>
            </div>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>👨‍🔧</div>
            <div>
              <h3>Técnicos Matriculados</h3>
              <p>Electricistas profesionales con matrícula habilitante. Trabajo seguro y garantizado.</p>
            </div>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📱</div>
            <div>
              <h3>Soporte por WhatsApp</h3>
              <p>Consultas y coordinación por WhatsApp los 7 días de la semana. Atención personalizada.</p>
            </div>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>📍</div>
            <div>
              <h3>Cobertura Amplia</h3>
              <p>La Plata, City Bell, Villa Elisa, Gonnet, Tolosa, Ringuelet, Los Hornos y alrededores.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Descuentos adicionales */}
      <section className={styles.sectionLight}>
        <h2 className={styles.sectionTitle}>Beneficios Adicionales</h2>
        <div className={styles.discountCards}>
          
          <div className={styles.discountCard}>
            <h3>🔧 Ampliaciones</h3>
            <p>Instalaciones nuevas: tomacorrientes, aires acondicionados, puntos de luz, etc.</p>
            <div className={styles.discountBadge}>
              <span className={styles.discountValue}>20%</span>
              <span>de descuento</span>
            </div>
            <p className={styles.discountExtra}>+ hasta 3 cuotas sin interés</p>
          </div>

          <div className={styles.discountCard + ' ' + styles.highlighted}>
            <h3>🏗️ Obras</h3>
            <p>Instalaciones eléctricas completas, tiro/ingeniería, puesta a tierra.</p>
            <div className={styles.discountBadge}>
              <span className={styles.discountValue}>30%</span>
              <span>de descuento</span>
            </div>
            <p className={styles.discountExtra}>+ cuotas a convenir</p>
          </div>

        </div>
      </section>

      {/* Servicios cubiertos */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Servicios de Mantenimiento Cubiertos</h2>
        <div className={styles.servicesList}>
          <div className={styles.serviceItem}>✅ Corte de luz general</div>
          <div className={styles.serviceItem}>✅ Térmica / disyuntor que se baja</div>
          <div className={styles.serviceItem}>✅ Tomacorrientes dañados</div>
          <div className={styles.serviceItem}>✅ Interruptores con fallas</div>
          <div className={styles.serviceItem}>✅ Lámparas y luminiarias</div>
          <div className={styles.serviceItem}>✅ Problemas en tablero</div>
          <div className={styles.serviceItem}>✅ Diagnóstico de fallas</div>
          <div className={styles.serviceItem}>✅ Reparaciones eléctricas generales</div>
        </div>
      </section>

      {/* Cómo contratar */}
      <section className={styles.sectionLight}>
        <h2 className={styles.sectionTitle}>¿Cómo contratar?</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Contactanos</h3>
            <p>Escribinos por WhatsApp o completa el formulario de registro en nuestra web.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Realizás el pago</h3>
            <p>Abonás la membresía por Mercado Pago. Acreditación instantánea.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>¡Listo!</h3>
            <p>Ya podés solicitar servicios cuando lo necesites. Sin límite mensual.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>¿Listo para tener tu electricidad cubierta?</h2>
        <p>Contratá tu membresía ahora y empezá a disfrutar de todos los beneficios</p>
        <div className={styles.ctaButtons}>
          <a href="https://wa.me/5492216011455?text=Hola!%20Quiero%20contratar%20la%20membresía%20de%20$9.900" className={styles.whatsappButton}>
            Contratar por WhatsApp
          </a>
          <Link href="/auth/registro" className={styles.registerButton}>
            Registrarme
          </Link>
        </div>
      </section>
    </div>
  );
}
