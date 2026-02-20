/* ============================================
   CHIACCHIO - Panel Cliente - Dashboard
   ============================================ */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, Badge, Button, LoadingOverlay } from '@/components/ui';
import { formatearFecha, formatearMoneda } from '@/lib/helpers';
import styles from './page.module.css';

interface Membresia {
  id: string;
  plan: string;
  precio: number;
  estado: string;
  serviciosDisponibles: string;
  serviciosUsados: number;
  fechaProximoPago: string;
  diasRestantes: number;
}

interface Solicitud {
  id: string;
  descripcion: string;
  estado: string;
  fechaSolicitada: string;
}

const quickActions = [
  {
    href: '/panel/cliente/solicitudes/nueva',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    label: 'Nueva Solicitud',
    color: '#10b981',
  },
  {
    href: '/panel/cliente/membresia',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    label: 'Ver Membresía',
    color: '#3b82f6',
  },
  {
    href: '/panel/cliente/presupuestos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    label: 'Presupuestos',
    color: '#f59e0b',
  },
  {
    href: '/panel/cliente/perfil',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    label: 'Mi Perfil',
    color: '#8b5cf6',
  },
];

export default function ClienteDashboard() {
  const { data: session, status } = useSession();
  const [membresia, setMembresia] = useState<Membresia | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const membRes = await fetch('/api/cliente/membresia');
      if (membRes.ok) {
        const membData = await membRes.json();
        setMembresia(membData);
      }

      const solRes = await fetch('/api/cliente/solicitudes');
      if (solRes.ok) {
        const solData = await solRes.json();
        setSolicitudes(solData.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingOverlay text="Cargando..." />;
  }

  const solicitudesPendientes = solicitudes.filter(s => 
    s.estado === 'pendiente' || s.estado === 'confirmada' || s.estado === 'en_progreso'
  );

  return (
    <>
      {/* Welcome Section */}
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>
          Bienvenido, {session?.user?.name?.split(' ')[0]}!
        </h1>
        <p className={styles.welcomeSubtitle}>
          Sistema de Mantenimiento Eléctrico
        </p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <p className={styles.statValue}>∞</p>
          <p className={styles.statLabel}>Atención ILIMITADA</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className={styles.statValue}>{solicitudesPendientes.length}</p>
          <p className={styles.statLabel}>Solicitudes activas</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <p className={styles.statValue}>{formatearMoneda(9900)}</p>
          <p className={styles.statLabel}>Plan mensual</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className={styles.statValue}>{membresia?.diasRestantes || 0} días</p>
          <p className={styles.statLabel}>Cobertura restante</p>
        </div>
      </div>

      {/* Membresía Card */}
      {membresia && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Mi Membresía</h2>
            <Link href="/panel/cliente/membresia">
              <Button variant="ghost" size="small">Ver detalles</Button>
            </Link>
          </div>
          <div className={styles.membresiaCard}>
            <div className={styles.membresiaHeader}>
              <span className={styles.membresiaName}>Plan Eléctrico</span>
              <Badge variant={membresia.estado === 'ACTIVA' ? 'success' : 'warning'}>{membresia.estado}</Badge>
            </div>
            <div className={styles.membresiaInfo}>
              <div className={styles.membresiaItem}>
                <p className={styles.membresiaItemValue}>∞</p>
                <p className={styles.membresiaItemLabel}>Atención ILIMITADA</p>
              </div>
              <div className={styles.membresiaItem}>
                <p className={styles.membresiaItemValue}>{membresia.serviciosUsados}</p>
                <p className={styles.membresiaItemLabel}>Servicios este mes</p>
              </div>
              <div className={styles.membresiaItem}>
                <p className={styles.membresiaItemValue}>{formatearMoneda(9900)}</p>
                <p className={styles.membresiaItemLabel}>Costo mensual</p>
              </div>
              <div className={styles.membresiaItem}>
                <p className={styles.membresiaItemValue}>{formatearFecha(membresia.fechaProximoPago)}</p>
                <p className={styles.membresiaItemLabel}>Próximo pago</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
        <div className={styles.quickActions}>
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href} className={styles.quickActionCard}>
              <div className={styles.quickActionIcon} style={{ backgroundColor: `${action.color}20`, color: action.color }}>
                {action.icon}
              </div>
              <span className={styles.quickActionLabel}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Solicitudes */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Solicitudes Recientes</h2>
        </div>
        {solicitudes.length > 0 ? (
          <Card>
            <div style={{ padding: 0 }}>
              {solicitudes.map((sol, index) => (
                <div
                  key={sol.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-4)',
                    borderBottom: index < solicitudes.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 500, marginBottom: 'var(--space-1)' }}>
                      {sol.descripcion.substring(0, 50)}...
                    </p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {formatearFecha(sol.fechaSolicitada)}
                    </p>
                  </div>
                  <Badge variant={
                    sol.estado === 'completada' ? 'success' : 
                    sol.estado === 'pendiente' ? 'warning' : 
                    sol.estado === 'en_progreso' ? 'info' : 'default'
                  }>
                    {sol.estado.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className={styles.emptyState}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.3, marginBottom: 'var(--space-4)' }}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              No tienes solicitudes aún.
            </p>
            <Link href="/panel/cliente/solicitudes/nueva">
              <Button variant="primary">Crear primera solicitud</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
