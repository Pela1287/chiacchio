/* ============================================
   CHIACCHIO - Servicios de Obra
   ============================================ */

import Link from 'next/link';
import styles from '../mantenimiento/page.module.css';

export default function ObraPage() {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>🏗️ Instalación Completa</span>
          <h1 className={styles.title}>Obras Eléctricas</h1>
          <p className={styles.subtitle}>
            Instalaciones eléctricas completas para obras nuevas o refacciones totales.
            Diseñamos y ejecutamos todo el sistema eléctrico de tu propiedad.
          </p>
        </div>
      </section>

      {/* Qué incluye */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Instalación Eléctrica Completa</h2>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--space-8)', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Una obra eléctrica incluye todo el proceso de diseño, instalación y puesta en marcha 
          del sistema eléctrico de una propiedad. Desde la conexión con la distribuidora hasta 
          el último punto de luz.
        </p>
        
        <div className={styles.servicesGrid}>
          
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📐</div>
            <h3>Diseño y Cálculo</h3>
            <p>Diseño completo del sistema eléctrico según las necesidades del cliente. 
            Cálculo de carga, distribución de circuitos y dimensionamiento de cables.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>⚡</div>
            <h3>Tiro / Ingeniería</h3>
            <p>Gestión ante EDENOR para aumento de potencia contratada. Acometida nueva 
            o ampliación de la existente según la demanda del proyecto.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🏭</div>
            <h3>Tablero Principal</h3>
            <p>Instalación del tablero general con llave termomagnética, disyuntor diferencial, 
            boretes y protecciones para cada circuito. Etiquetado y diagrama unifilar.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🔗</div>
            <h3>Cañerías y Cables</h3>
            <p>Tendido completo de cañerías y cableado según reglamentación AEA. 
            Circuitos separados para iluminación, tomas, equipos especiales y aire acondicionado.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>💡</div>
            <h3>Puntos de Luz</h3>
            <p>Instalación de todos los puntos de iluminación: plafones, apliques, 
            arañas, reflectores y spots. Centros de luz en todos los ambientes.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🔌</div>
            <h3>Tomas Corrientes</h3>
            <p>Colocación de tomacorrientes en todos los ambientes según normas. 
            Tomas especiales para cocina, lavadero y equipos de aire acondicionado.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🌱</div>
            <h3>Puesta a Tierra</h3>
            <p>Instalación del sistema de puesta a tierra: jabalina, conductor de 
            protección y conexión a todos los puntos de la instalación.</p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📋</div>
            <h3>Certificación</h3>
            <p>Certificado de instalación eléctrica firmado por electricista matriculado. 
            Documentación necesaria para habilitaciones y trámites.</p>
          </div>

        </div>
      </section>

      {/* Proceso */}
      <section className={styles.sectionLight}>
        <h2 className={styles.sectionTitle}>Proceso de Trabajo</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Visita y Presupuesto</h3>
            <p>Visita técnica sin cargo para evaluar el proyecto. Elaboramos un presupuesto detallado.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Diseño del Proyecto</h3>
            <p>Planos eléctricos, cálculo de carga y selección de materiales. Todo aprobado antes de empezar.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Ejecución de Obra</h3>
            <p>Instalación profesional con personal calificado. Coordinamos con otros gremios si es necesario.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Entrega y Certificado</h3>
            <p>Pruebas de funcionamiento, certificación final y documentación completa.</p>
          </div>
        </div>
      </section>

      {/* Beneficios miembrosía */}
      <section className={styles.section}>
        <div className={styles.benefitsCard}>
          <h2>🌟 Beneficio Exclusivo para Miembros</h2>
          <ul className={styles.benefitsList}>
            <li>✅ <strong>30% de descuento</strong> sobre el presupuesto</li>
            <li>✅ Hasta <strong>6 cuotas sin interés</strong></li>
            <li>✅ Prioridad en la programación de obra</li>
            <li>✅ Asesoramiento sin cargo durante el proyecto</li>
            <li>✅ Garantía extendida de 2 años</li>
          </ul>
          <Link href="/membresia" className={styles.ctaButton}>
            Ver membresía
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>¿Tenés un proyecto en mente?</h2>
        <p>Contactanos y te ayudamos a planificar tu obra eléctrica</p>
        <div className={styles.ctaButtons}>
          <a href="https://wa.me/5492216011455?text=Hola!%20Necesito%20un%20presupuesto%20para%20una%20obra%20eléctrica" className={styles.whatsappButton}>
            Solicitar Presupuesto
          </a>
        </div>
      </section>
    </div>
  );
}
