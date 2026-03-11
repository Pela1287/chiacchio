'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface FinanzasData {
  resumen: { totalPresupuestado: number; cantidadPresupuestos: number; totalCobrado: number; totalPendiente: number };
  presupuestosPorEstado: { estado: string; cantidad: number; total: number }[];
  pagosPorMetodo: { metodo: string; cantidad: number; total: number }[];
  evolucion: { mes: string; valor: number }[];
  solicitudesPorEstado: { estado: string; cantidad: number }[];
  pagosRecientes: { id: string; cliente: string; monto: number; metodo: string; estado: string; fecha: string }[];
}

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: '#f59e0b', APROBADO: '#10b981', RECHAZADO: '#ef4444', VENCIDO: '#6b7280',
  COMPLETADO: '#3b82f6',
};
const METODO_COLORS: Record<string, string> = {
  EFECTIVO: '#10b981', TRANSFERENCIA: '#3b82f6', TARJETA: '#8b5cf6', MERCADOPAGO: '#06b6d4',
};
const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente', APROBADO: 'Aprobado', RECHAZADO: 'Rechazado', VENCIDO: 'Vencido',
  COMPLETADO: 'Completado', CONFIRMADA: 'Confirmada', EN_PROGRESO: 'En Progreso', CANCELADA: 'Cancelada',
};

function fmt(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className={styles.noData}>Sin datos</div>;

  let offset = 25;
  const segments = data.map((d) => {
    const pct = (d.value / total) * 100;
    const seg = { ...d, pct, offset };
    offset += pct;
    return seg;
  });

  return (
    <div className={styles.pieWrap}>
      <svg viewBox="0 0 42 42" className={styles.pie}>
        <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#f3f4f6" strokeWidth="10" />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx="21" cy="21" r="15.9"
            fill="transparent"
            stroke={s.color}
            strokeWidth="10"
            strokeDasharray={`${s.pct} ${100 - s.pct}`}
            strokeDashoffset={100 - s.offset + 25}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        ))}
        <circle cx="21" cy="21" r="10" fill="white" />
      </svg>
      <div className={styles.pieLegend}>
        {data.map((d) => (
          <div key={d.label} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: d.color }} />
            <span className={styles.legendLabel}>{d.label}</span>
            <span className={styles.legendValue}>{((d.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={styles.barChart}>
      {data.map((d) => (
        <div key={d.label} className={styles.barRow}>
          <span className={styles.barLabel}>{d.label}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
            />
          </div>
          <span className={styles.barValue}>{fmt(d.value)}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data }: { data: { mes: string; valor: number }[] }) {
  const max = Math.max(...data.map((d) => d.valor), 1);
  const W = 400, H = 120, PAD = 30;
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - (d.valor / max) * (H - PAD * 2);
    return { x, y, ...d };
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${path} L${pts[pts.length - 1].x},${H - PAD} L${pts[0].x},${H - PAD} Z`;

  return (
    <div className={styles.lineWrap}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.lineChart}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)" />
        <path d={path} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2563eb" stroke="white" strokeWidth="2" />
        ))}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill="#9ca3af">{p.mes}</text>
        ))}
      </svg>
    </div>
  );
}

export default function FinanzasPage() {
  const [data, setData] = useState<FinanzasData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/super/finanzas').then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}><div className={styles.spinner} /></div>;
  if (!data) return null;

  const { resumen, presupuestosPorEstado, pagosPorMetodo, evolucion, pagosRecientes } = data;

  const piePres = presupuestosPorEstado.map((p) => ({
    label: ESTADO_LABEL[p.estado] || p.estado,
    value: p.cantidad,
    color: ESTADO_COLORS[p.estado] || '#9ca3af',
  }));

  const barMetodos = pagosPorMetodo.map((p) => ({
    label: p.metodo.charAt(0) + p.metodo.slice(1).toLowerCase(),
    value: p.total,
    color: METODO_COLORS[p.metodo] || '#6b7280',
  }));

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Estado Financiero</h1>
          <p className={styles.subtitle}>Control de ingresos y presupuestos del sistema</p>
        </div>
      </div>

      {/* Resumen */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ borderTopColor: '#2563eb' }}>
          <div className={styles.statLabel}>Total presupuestado</div>
          <div className={styles.statValue} style={{ color: '#2563eb' }}>{fmt(resumen.totalPresupuestado)}</div>
          <div className={styles.statSub}>{resumen.cantidadPresupuestos} presupuestos</div>
        </div>
        <div className={styles.statCard} style={{ borderTopColor: '#10b981' }}>
          <div className={styles.statLabel}>Total cobrado</div>
          <div className={styles.statValue} style={{ color: '#10b981' }}>{fmt(resumen.totalCobrado)}</div>
          <div className={styles.statSub}>Pagos completados</div>
        </div>
        <div className={styles.statCard} style={{ borderTopColor: '#f59e0b' }}>
          <div className={styles.statLabel}>Pendiente de cobro</div>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>{fmt(resumen.totalPendiente)}</div>
          <div className={styles.statSub}>Pagos pendientes</div>
        </div>
        <div className={styles.statCard} style={{ borderTopColor: '#8b5cf6' }}>
          <div className={styles.statLabel}>Tasa de cobro</div>
          <div className={styles.statValue} style={{ color: '#8b5cf6' }}>
            {resumen.totalPresupuestado > 0
              ? Math.round((resumen.totalCobrado / resumen.totalPresupuestado) * 100) + '%'
              : '0%'}
          </div>
          <div className={styles.statSub}>Cobrado vs presupuestado</div>
        </div>
      </div>

      {/* Gráficos fila 1 */}
      <div className={styles.chartGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Evolución de ingresos (últimos 6 meses)</h3>
          <LineChart data={evolucion} />
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Presupuestos por estado</h3>
          <PieChart data={piePres} />
        </div>
      </div>

      {/* Gráficos fila 2 */}
      <div className={styles.chartGrid2}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Ingresos por método de pago</h3>
          {barMetodos.length > 0 ? <BarChart data={barMetodos} /> : <div className={styles.noData}>Sin pagos registrados</div>}
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Últimos pagos</h3>
          <div className={styles.pagosList}>
            {pagosRecientes.length === 0 && <div className={styles.noData}>Sin pagos</div>}
            {pagosRecientes.map((p) => (
              <div key={p.id} className={styles.pagoRow}>
                <div>
                  <div className={styles.pagoCliente}>{p.cliente || 'Cliente'}</div>
                  <div className={styles.pagoMeta}>{p.metodo.toLowerCase()} · {new Date(p.fecha).toLocaleDateString('es-AR')}</div>
                </div>
                <div className={styles.pagoMonto} style={{ color: p.estado === 'COMPLETADO' ? '#10b981' : '#f59e0b' }}>
                  {fmt(p.monto)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
