/* ============================================
   CHIACCHIO - Términos y Condiciones
   ============================================ */

import Link from 'next/link';
import styles from './page.module.css';

export default function TerminosPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Términos y Condiciones</h1>
        <p className={styles.updateDate}>Última actualización: Enero 2025</p>

        <section className={styles.section}>
          <h2>1. Descripción del Servicio</h2>
          <p>
            Chiacchio brinda servicios de <strong>mantenimiento eléctrico domiciliario y comercial</strong> a través de un sistema de membresía mensual.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Membresía Mensual</h2>
          <p>
            La membresía tiene un costo de <strong>$9.900 mensuales</strong> e incluye:
          </p>
          <ul>
            <li>Atención eléctrica SIN límite mensual</li>
            <li>Respuesta prioritaria ante urgencias</li>
            <li>Diagnóstico sin cargo</li>
            <li>Soporte por WhatsApp</li>
          </ul>
          <p>
            <strong>Beneficios adicionales:</strong>
          </p>
          <ul>
            <li><strong>Ampliaciones:</strong> 20% de descuento sobre el presupuesto + hasta 3 cuotas sin interés</li>
            <li><strong>Obras:</strong> 30% de descuento sobre el presupuesto + cuotas a convenir</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Servicios Incluidos</h2>
          <p>Solo se incluyen servicios eléctricos:</p>
          <ul>
            <li>Corte de luz general</li>
            <li>Problemas con térmicas y diferenciales</li>
            <li>Reparación de tomas e interruptores</li>
            <li>Instalación y reparación de luminarias</li>
            <li>Problemas en tableros eléctricos</li>
            <li>Cableado y conexiones</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Forma de Pago</h2>
          <p>
            El pago de la membresía se realiza a través de <strong>Mercado Pago</strong>. 
            Al completar el pago, recibirás confirmación por WhatsApp y tu membresía quedará activa.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Contacto</h2>
          <p>
            Ante cualquier consulta:
          </p>
          <ul>
            <li><strong>WhatsApp:</strong> +54 9 221 601-1455</li>
            <li><strong>Email:</strong> contacto@chiacchio.com</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
