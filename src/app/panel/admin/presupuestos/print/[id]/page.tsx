'use client';

import { useEffect, useState } from 'react';

export default function PrintPresupuesto({ params }: any) {
  const [presupuesto, setPresupuesto] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/presupuestos/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setPresupuesto(data);
      })
      .catch(() => setError('Error al cargar el presupuesto'));
  }, [params.id]);

  useEffect(() => {
    if (presupuesto) {
      setTimeout(() => window.print(), 600);
    }
  }, [presupuesto]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;
  if (!presupuesto) return <div style={{ padding: 40, fontFamily: 'Arial', textAlign: 'center' }}>Cargando...</div>;

  const financiacionLabel: Record<string, string> = {
    contado: 'Contado',
    '3_cuotas': '3 cuotas sin interes',
    '6_cuotas': '6 cuotas',
    acuerdo: 'A convenir',
  };

  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          @page { margin: 15mm; }
        }
        body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; }
      `}</style>

      {/* Boton solo visible en pantalla */}
      <div className="no-print" style={{ padding: '12px 24px', background: '#1e3a5f', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => window.print()}
          style={{ background: '#f59e0b', color: '#1a1a1a', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
        >
          Imprimir / Guardar PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 6, padding: '10px 20px', cursor: 'pointer' }}
        >
          Cerrar
        </button>
      </div>

      {/* Documento imprimible */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 48px' }}>

        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, borderBottom: '3px solid #1e3a5f', paddingBottom: 24 }}>
          <div>
            <img src="/logo-chiacchio.png" alt="Chiacchio" style={{ height: 80, objectFit: 'contain' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1e3a5f' }}>PRESUPUESTO</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>#{String(presupuesto.numero).padStart(4, '0')}</div>
            <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
              Fecha: {fmtDate(presupuesto.fecha || presupuesto.createdAt)}
            </div>
            {presupuesto.fechaValidez && (
              <div style={{ fontSize: 13, color: '#555' }}>
                Valido hasta: {fmtDate(presupuesto.fechaValidez)}
              </div>
            )}
          </div>
        </div>

        {/* Datos del cliente */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
          <div style={{ flex: 1, background: '#f8fafc', borderRadius: 8, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Datos del Cliente
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{presupuesto.clienteNombre}</div>
            {presupuesto.clienteDireccion && <div style={{ fontSize: 13, color: '#555' }}>{presupuesto.clienteDireccion}</div>}
            {presupuesto.clienteTelefono && <div style={{ fontSize: 13, color: '#555' }}>Tel: {presupuesto.clienteTelefono}</div>}
            {presupuesto.clienteEmail && <div style={{ fontSize: 13, color: '#555' }}>{presupuesto.clienteEmail}</div>}
          </div>
          <div style={{ flex: 1, background: '#f8fafc', borderRadius: 8, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Lugar de trabajo
            </div>
            <div style={{ fontSize: 14 }}>{presupuesto.lugar || '-'}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginTop: 14, marginBottom: 6 }}>
              Financiacion
            </div>
            <div style={{ fontSize: 14 }}>{financiacionLabel[presupuesto.financiacion] || presupuesto.financiacion || 'Contado'}</div>
          </div>
        </div>

        {/* Tabla de items */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
          <thead>
            <tr style={{ background: '#1e3a5f', color: 'white' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 13, fontWeight: 600 }}>Descripcion</th>
              <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, fontWeight: 600, width: 70 }}>Cant.</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 130 }}>Precio Unit.</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontWeight: 600, width: 130 }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {presupuesto.items.map((item: any, i: number) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{item.descripcion}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center' }}>{item.cantidad}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'right' }}>{fmt(item.precioUnitario)}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>{fmt(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0', fontSize: 14 }}>
              <span style={{ color: '#555' }}>Subtotal:</span>
              <span>{fmt(presupuesto.subtotal)}</span>
            </div>
            {presupuesto.descuentoPorcentaje > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0', fontSize: 14, color: '#e53e3e' }}>
                <span>Descuento ({presupuesto.descuentoPorcentaje}%):</span>
                <span>- {fmt(presupuesto.descuentoMonto)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 18, fontWeight: 800, color: '#1e3a5f', borderTop: '2px solid #1e3a5f', marginTop: 4 }}>
              <span>TOTAL:</span>
              <span>{fmt(presupuesto.total)}</span>
            </div>
            {presupuesto.financiacion === '3_cuotas' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginTop: 2 }}>
                <span>3 cuotas de:</span>
                <span>{fmt(presupuesto.total / 3)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notas */}
        {presupuesto.notas && (
          <div style={{ marginTop: 28, padding: '14px 18px', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: 4, fontSize: 13 }}>
            <strong style={{ display: 'block', marginBottom: 4 }}>Notas:</strong>
            {presupuesto.notas}
          </div>
        )}

        {/* Pie */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: 12, color: '#888' }}>
          <p>Este presupuesto tiene una validez de 30 dias desde su emision.</p>
          <p>Chiacchio Servicios Electricos | La Plata, Buenos Aires</p>
        </div>

      </div>
    </>
  );
}