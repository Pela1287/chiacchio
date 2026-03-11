'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface DashboardMetrics {
  sucursales: number;
  sucursalesActivas: number;
  admins: number;
  adminsActivos: number;
  clientes: number;
  clientesActivos: number;
  usuarios: number;
  solicitudesPendientes: number;
  presupuestosPendientes: number;
  totalPresupuestado: number;
}

interface ActividadReciente {
  id: string;
  tipo: string;
  descripcion: string;
  fecha: string;
}

export default function SuperDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [actividad, setActividad] = useState<ActividadReciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/super/dashboard')
      .then((r) => r.json())
      .then((data) => {
        setMetrics(data.metrics);
        setActividad(data.actividad || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <span>Cargando métricas...</span>
      </div>
    );
  }

  const m = metrics!;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Vista general del sistema CHIACCHIO</p>
        </div>
      </div>

      {/* Stats principales */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Sucursales"
          value={m.sucursales}
          sub={`${m.sucursalesActivas} activas`}
          color="#2563eb"
          href="/panel/super/sucursales"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          }
        />
        <StatCard
          label="Administradores"
          value={m.admins}
          sub={`${m.adminsActivos} activos`}
          color="#7c3aed"
          href="/panel/super/admins"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Clientes"
          value={m.clientes}
          sub={`${m.clientesActivos} activos`}
          color="#059669"
          href="/panel/super/clientes"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
        <StatCard
          label="Usuarios totales"
          value={m.usuarios}
          sub="en el sistema"
          color="#ea580c"
          href="/panel/super/usuarios"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          }
        />
        <StatCard
          label="Solicitudes pendientes"
          value={m.solicitudesPendientes}
          sub="sin atender"
          color="#dc2626"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
        />
        <StatCard
          label="Presupuestos pendientes"
          value={m.presupuestosPendientes}
          sub="por aprobar"
          color="#d97706"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />
      </div>

      <div className={styles.bottom}>
        {/* Actividad reciente */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Actividad reciente</h2>
          <div className={styles.actividadList}>
            {actividad.length === 0 ? (
              <div className={styles.empty}>No hay actividad reciente</div>
            ) : (
              actividad.map((a) => (
                <div key={a.id} className={styles.actividadItem}>
                  <div className={`${styles.actividadDot} ${styles[`dot_${a.tipo}`]}`} />
                  <div className={styles.actividadInfo}>
                    <span className={styles.actividadDesc}>{a.descripcion}</span>
                    <span className={styles.actividadFecha}>{formatRelative(a.fecha)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Accesos rápidos</h2>
          <div className={styles.quickLinks}>
            <Link href="/panel/super/sucursales" className={styles.quickLink}>
              <span>+ Nueva sucursal</span>
            </Link>
            <Link href="/panel/super/admins" className={styles.quickLink}>
              <span>+ Nuevo administrador</span>
            </Link>
            <Link href="/panel/super/usuarios" className={styles.quickLink}>
              <span>Gestionar usuarios</span>
            </Link>
            <Link href="/panel/super/configuracion" className={styles.quickLink}>
              <span>Configuración</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, color, href, icon,
}: {
  label: string; value: number; sub: string; color: string; href?: string; icon: React.ReactNode;
}) {
  const inner = (
    <div className={styles.statCard} style={{ borderTopColor: color }}>
      <div className={styles.statIcon} style={{ color, background: `${color}18` }}>
        {icon}
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statSub}>{sub}</div>
    </div>
  );
  return href ? <Link href={href} className={styles.statLink}>{inner}</Link> : inner;
}

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hs = Math.floor(mins / 60);
  if (hs < 24) return `hace ${hs}h`;
  const days = Math.floor(hs / 24);
  return `hace ${days}d`;
}
