/* ============================================
   CHIACCHIO - Vista de Impresión de Presupuesto
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';

interface PresupuestoItem {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Presupuesto {
  id: string;
  numero: number;
  clienteNombre?: string;
  clienteDireccion?: string;
  clienteTelefono?: string;
  clienteEmail?: string;
  lugar: string;
  fecha: string;
  subtotal: number;
  descuentoPorcentaje: number;
  descuentoMonto: number;
  total: number;
  financiacion: string;
  cuotas: number;
  notas?: string;
  items: PresupuestoItem[];
  cliente?: {
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    email: string;
  };
}

export default function ImprimirPresupuestoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session && params.id) {
      fetchPresupuesto();
    }
  }, [session, status, params.id]);

  const fetchPresupuesto = async () => {
    try {
      const res = await fetch('/api/admin/presupuestos');
      if (res.ok) {
        const data = await res.json();
        const found = data.find((p: Presupuesto) => p.id === params.id);
        setPresupuesto(found);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  if (!presupuesto) {
    return <div className={styles.error}>Presupuesto no encontrado</div>;
  }

  const clienteNombre = presupuesto.clienteNombre || 
    `${presupuesto.cliente?.nombre || ''} ${presupuesto.cliente?.apellido || ''}`.trim() || '-';
  const clienteDireccion = presupuesto.clienteDireccion || presupuesto.cliente?.direccion || '-';
  const clienteTelefono = presupuesto.clienteTelefono || presupuesto.cliente?.telefono || '-';

  return (
    <div className={styles.container}>
      {/* Botones de acción (no se imprimen) */}
      <div className={styles.actions}>
        <button onClick={() => router.back()} className={styles.btnSecondary}>
          ← Volver
        </button>
        <button onClick={handlePrint} className={styles.btnPrimary}>
          🖨️ Imprimir
        </button>
      </div>

      {/* Contenido imprimible */}
      <div className={styles.printArea}>
        {/* Membrete */}
        <header className={styles.header}>
          <h1 className={styles.empresa}>CHIACCHIO</h1>
          <p className={styles.subempresa}>Servicios de Mantenimiento Eléctrico</p>
          <p className={styles.contacto}>Tel: +54 9 221 601-1455 | La Plata, Buenos Aires</p>
          <div className={styles.linea}></div>
        </header>

        {/* Título */}
        <h2 className={styles.titulo}>PRESUPUESTO N° {presupuesto.numero}</h2>

        {/* Datos del cliente */}
        <section className={styles.datos}>
          <div className={styles.datoRow}>
            <span className={styles.datoLabel}>Cliente:</span>
            <span className={styles.datoValor}>{clienteNombre}</span>
          </div>
          <div className={styles.datoRow}>
            <span className={styles.datoLabel}>Dirección:</span>
            <span className={styles.datoValor}>{clienteDireccion}</span>
          </div>
          <div className={styles.datoRow}>
            <span className={styles.datoLabel}>Teléfono:</span>
            <span className={styles.datoValor}>{clienteTelefono}</span>
          </div>
          <div className={styles.datoRow}>
            <span className={styles.datoLabel}>Lugar y Fecha:</span>
            <span className={styles.datoValor}>{presupuesto.lugar}, {formatDate(presupuesto.fecha)}</span>
          </div>
        </section>

        {/* Tabla de items */}
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th className={styles.colItem}>Ítem</th>
              <th className={styles.colDesc}>Descripción</th>
              <th className={styles.colCant}>Cant.</th>
              <th className={styles.colPrecio}>Precio Unit.</th>
              <th className={styles.colSubtotal}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {presupuesto.items.map((item, idx) => (
              <tr key={item.id} className={idx % 2 === 1 ? styles.rowAlt : ''}>
                <td className={styles.colItem}>{idx + 1}</td>
                <td className={styles.colDesc}>{item.descripcion}</td>
                <td className={styles.colCant}>{item.cantidad}</td>
                <td className={styles.colPrecio}>{formatPrice(item.precioUnitario)}</td>
                <td className={styles.colSubtotal}>{formatPrice(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <section className={styles.totales}>
          <div className={styles.totalesInner}>
            <div className={styles.totalesRow}>
              <span>Subtotal:</span>
              <span>{formatPrice(presupuesto.subtotal)}</span>
            </div>
            {presupuesto.descuentoPorcentaje > 0 && (
              <div className={styles.totalesRowDesc}>
                <span>Descuento ({presupuesto.descuentoPorcentaje}%):</span>
                <span>- {formatPrice(presupuesto.descuentoMonto)}</span>
              </div>
            )}
            <div className={styles.totalesRowTotal}>
              <span>TOTAL:</span>
              <span>{formatPrice(presupuesto.total)}</span>
            </div>
            {presupuesto.financiacion === '3_cuotas' && (
              <div className={styles.totalesRow}>
                <span>3 cuotas de:</span>
                <span>{formatPrice(presupuesto.total / 3)}</span>
              </div>
            )}
            {presupuesto.financiacion === '6_cuotas' && (
              <div className={styles.totalesRow}>
                <span>6 cuotas de:</span>
                <span>{formatPrice(presupuesto.total / 6)}</span>
              </div>
            )}
            {presupuesto.financiacion === 'acuerdo' && (
              <div className={styles.totalesRow}>
                <span>Financiación:</span>
                <span>A convenir</span>
              </div>
            )}
          </div>
        </section>

        {/* Notas */}
        {presupuesto.notas && (
          <section className={styles.notas}>
            <strong>Notas:</strong> {presupuesto.notas}
          </section>
        )}

        {/* Firmas */}
        <section className={styles.firmas}>
          <div className={styles.firma}>
            <div className={styles.firmaLinea}></div>
            <p className={styles.firmaTitulo}>CHIACCHIO</p>
            <p className={styles.firmaFecha}>Fecha: _______________</p>
            <p className={styles.firmaFecha}>Aclaración: _______________</p>
          </div>
          <div className={styles.firma}>
            <div className={styles.firmaLinea}></div>
            <p className={styles.firmaTitulo}>CLIENTE</p>
            <p className={styles.firmaFecha}>Fecha: _______________</p>
            <p className={styles.firmaFecha}>Aclaración: _______________</p>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          Presupuesto válido por 30 días. Condiciones sujetas a verificación técnica in situ.
        </footer>
      </div>
    </div>
  );
}
