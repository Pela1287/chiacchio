/* ============================================
   CHIACCHIO - Servicios de Instalaciones
   ============================================ */

import Link from 'next/link';
import styles from '../mantenimiento/page.module.css';

export default function InstalacionesPage() {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>🔧 Ampliaciones</span>
          <h1 className={styles.title}>Instalaciones Eléctricas</h1>
          <p className={styles.subtitle}>
            Ampliaciones y mejoras a tu instalación eléctrica existente.
            Desde un simple tomacorriente hasta la instalación de un aire acondicionado.
          </p>
        </div>
      </section>

      {/* Tipos de instalación */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tipos de Instalaciones</h2>
        
        <div className={styles.servicesGrid}>
          
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🔌</div>
            <h3>Nuevos Tomacorrientes</h3>
            <p>Instalación de tomas corrientes adicionales donde los necesites. 
            Ideal para cuando te quedás corto de enchufes en el living, dormitorio o cocina.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>💡</div>
            <h3>Puntos de Luz</h3>
            <p>Colocación de nuevos puntos de iluminación: plafones, apliques de pared, 
            reflectores exteriores, luces empotradas o lámparas colgantes.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>❄️</div>
            <h3>Aire Acondicionado</h3>
            <p>Instalación eléctrica completa para equipos split. Circuitos dedicados, 
            protecciones independientes y verificación de potencia disponible.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🔥</div>
            <h3>Estufas y Calefactores</h3>
            <p>Conexión eléctrica para estufas a leo, calefactores eléctricos y 
            termotanques eléctricos. Circuitos especiales de alta potencia.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🍳</div>
            <h3>Electrodomésticos</h3>
            <p>Instalación eléctrica para hornos eléctricos, anafes, lavarropas, 
            secarropas y dishwashers. Tomas especiales y circuitos dedicados.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>⚡</div>
            <h3>Disyuntores y Térmicas</h3>
            <p>Instalación de disyuntor diferencial para mayor seguridad. 
            Agregar térmicas para nuevos circuitos o reemplazar existentes.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🏭</div>
            <h3>Ampliación de Tablero</h3>
            <p>Ampliación del tablero eléctrico para incorporar nuevos circuitos. 
            Más boretes, mejores protecciones y organización completa.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🌱</div>
            <h3>Puesta a Tierra</h3>
            <p>Instalación del sistema de puesta a tierra si tu casa no tiene. 
            Mayor seguridad para vos y tu familia. Conexión a todos los tomacorrientes.</p>
          </div>

        </div>
      </section>

      {/* Proceso */}
      <section className={styles.sectionLight}>
        <h2 className={styles.sectionTitle}>¿Cómo trabajamos?</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Consulta</h3>
            <p>Nos contás qué instalación necesitás. Por WhatsApp o en una visita, evaluamos lo que hay que hacer.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Presupuesto</h3>
            <p>Te pasamos un presupuesto detallado con materiales y mano de obra. Sin sorpresas.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Instalación</h3>
            <p>Coordinamos el día y horario. Vamos con todo el material y realizamos la instalación en el día.</p>
          </div>
        </div>
      </section>

      {/* Beneficios miembrosía */}
      <section className={styles.section}>
        <div className={styles.benefitsCard}>
          <h2>🌟 Beneficio para Miembros</h2>
          <ul className={styles.benefitsList}>
            <li>✅ <strong>20% de descuento</strong> sobre el presupuesto</li>
            <li>✅ Hasta <strong>3 cuotas sin interés</strong></li>
            <li>✅ Prioridad en la agenda</li>
            <li>✅ Garantía de 1 año en instalaciones</li>
          </ul>
          <Link href="/membresia" className={styles.ctaButton}>
            Ver membresía
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>¿Necesitás una ampliación eléctrica?</h2>
        <p>Consultanos sin compromiso</p>
        <div className={styles.ctaButtons}>
          <a href="https://wa.me/5492216011455?text=Hola!%20Necesito%20hacer%20una%20instalación%20eléctrica" className={styles.whatsappButton}>
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
