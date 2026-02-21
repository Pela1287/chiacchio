/* ============================================
   CHIACCHIO - Política de Privacidad
   ============================================ */

import styles from './page.module.css';

export default function PrivacidadPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Política de Privacidad</h1>
        <p className={styles.updateDate}>Última actualización: Enero 2025</p>

        <section className={styles.section}>
          <h2>1. Información que Recopilamos</h2>
          <p>
            En Chiacchio recopilamos información necesaria para brindar nuestros servicios de mantenimiento eléctrico domiciliario. Esta información incluye:
          </p>
          <ul>
            <li><strong>Datos personales:</strong> Nombre, apellido, email, teléfono, dirección.</li>
            <li><strong>Datos de servicio:</strong> Historial de solicitudes, preferencias de horario, descripción de problemas eléctricos.</li>
            <li><strong>Datos de pago:</strong> Información de membresía, historial de pagos a través de Mercado Pago.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. Cómo Utilizamos tu Información</h2>
          <p>Utilizamos la información recopilada para:</p>
          <ul>
            <li>Gestionar y coordinar servicios de mantenimiento eléctrico.</li>
            <li>Comunicarnos con vos sobre el estado de tus solicitudes.</li>
            <li>Enviar notificaciones sobre tu membresía y servicios.</li>
            <li>Procesar pagos a través de Mercado Pago.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Contacto</h2>
          <p>
            Si tenés preguntas sobre esta Política de Privacidad, contactanos:
          </p>
          <ul>
            <li><strong>Email:</strong> privacidad@chiacchio.com</li>
            <li><strong>WhatsApp:</strong> +54 9 221 601-1455</li>
            <li><strong>Dirección:</strong> La Plata, Buenos Aires, Argentina</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
