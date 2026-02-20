/* ============================================
   CHIACCHIO - Deslinde de Responsabilidades
   ============================================ */

import styles from './page.module.css';

export default function DeslindePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Deslinde de Responsabilidades</h1>
        <p className={styles.subtitle}>Ultima actualizacion: Enero 2025</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Alcance de los Servicios</h2>
          <p className={styles.text}>
            Chiacchio proporciona servicios de mantenimiento domiciliario a traves de profesionales 
            independientes debidamente certificados. Nuestros servicios abarcan tareas de mantenimiento 
            preventivo y correctivo, instalaciones menores y trabajos de obra bajo presupuesto previamente 
            acordado. La empresa actua como intermediaria entre el cliente y los profesionales, 
            facilitando la contratacion y coordinacion de los servicios.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Limitaciones de Responsabilidad</h2>
          <p className={styles.text}>
            Chiacchio no se hace responsable por danos directos o indirectos que puedan derivarse del 
            uso de nuestros servicios, incluyendo pero no limitado a: danos a la propiedad, lesiones 
            personales, perdidas economicas, o cualquier otro tipo de perjuicio. Los profesionales 
            que prestan los servicios son responsables de su propio trabajo y cuentan con su propia 
            cobertura de seguro de responsabilidad civil.
          </p>
          <p className={styles.text}>
            La empresa se compromete a seleccionar cuidadosamente a los profesionales de su red, 
            verificando sus credenciales y antecedentes. Sin embargo, no puede garantizar el resultado 
            final de cada intervencion ni hacerse cargo de situaciones imprevistas que excedan el 
            alcance del trabajo acordado.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Garantia de los Trabajos</h2>
          <p className={styles.text}>
            Todos los trabajos realizados cuentan con una garantia de 90 dias sobre la mano de obra, 
            siempre que el cliente haya cumplido con las condiciones de pago y no haya modificado 
            las instalaciones intervenidas. Esta garantia no cubre: desgaste normal, uso indebido, 
            danos causados por terceros, eventos fortuitos o de fuerza mayor, ni problemas derivados 
            de defectos de fabricacion de materiales provistos por terceros.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Membresia y Servicios Incluidos</h2>
          <p className={styles.text}>
            La membresia mensual incluye un numero determinado de servicios de mantenimiento segun 
            el plan contratado. Los servicios no utilizados durante el periodo mensual no son 
            acumulables ni reembolsables. Los trabajos de obra y las instalaciones de mayor envergadura 
            se cotizan por separado y no estan incluidos en la membresia, aunque los miembros reciben 
            descuentos especiales segun su plan.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Cancelacion y Reembolso</h2>
          <p className={styles.text}>
            El cliente puede cancelar su membresia en cualquier momento. La cancelacion surtira 
            efecto al final del periodo de facturacion en curso. No se realizan reembolsos 
            proporcionales por dias no utilizados del periodo actual. Los servicios ya solicitados 
            y confirmados que sean cancelados con menos de 24 horas de anticipacion podran tener 
            un cargo administrativo del 20% del valor del servicio.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Privacidad y Proteccion de Datos</h2>
          <p className={styles.text}>
            Chiacchio se compromete a proteger la privacidad de sus clientes. Los datos personales 
            recopilados se utilizan exclusivamente para la prestacion del servicio y la comunicacion 
            con el cliente. No compartimos informacion personal con terceros sin consentimiento, 
            excepto cuando sea necesario para la ejecucion del servicio contratado o por requerimiento 
            legal.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Modificaciones</h2>
          <p className={styles.text}>
            Chiacchio se reserva el derecho de modificar estos terminos en cualquier momento. 
            Las modificaciones seran comunicadas a los clientes con al menos 30 dias de anticipacion 
            a su entrada en vigor. El uso continuado de los servicios despues de las modificaciones 
            constituye la aceptacion de los nuevos terminos.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Jurisdiccion y Ley Aplicable</h2>
          <p className={styles.text}>
            Estos terminos se rigen por las leyes de la Republica Argentina. Cualquier controversia 
            derivada de la interpretacion o ejecucion de estos terminos sera sometida a los 
            tribunales competentes de la Ciudad Autonoma de Buenos Aires.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Contacto</h2>
          <p className={styles.text}>
            Para consultas sobre estos terminos y condiciones, puede comunicarse con nosotros a 
            traves de:
          </p>
          <ul className={styles.list}>
            <li>Email: legal@chiacchio.com</li>
            <li>Telefono: +54 9 2216011455</li>
            <li>WhatsApp: +54 9 2216011455</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
