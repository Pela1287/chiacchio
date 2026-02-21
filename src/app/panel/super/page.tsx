/* ============================================
   CHIACCHIO - Panel Super Usuario - Dashboard
   ============================================ */

'use client';

import Link from 'next/link';
import { useAuthStore, useDataStore } from '@/lib/store';
import { Card, Badge, Button } from '@/components/ui';
import { formatearFecha, formatearMoneda, tiempoTranscurrido } from '@/lib/helpers';
import styles from '../admin/page.module.css';

export default function SuperDashboard() {
  const { usuario } = useAuthStore();
  const { clientes, membresias, solicitudes, presupuestos, leads } = useDataStore();

  // Calcular estadisticas
  const membresiasActivas = membresias.filter(m => m.estado === 'activa').length;
  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
  const presupuestosPendientes = presupuestos.filter(p => p.estado === 'pendiente').length;
  const leadsNuevos = leads.filter(l => l.estado === 'nuevo').length;
  const ingresosMes = presupuestos
    .filter(p => p.estado === 'aprobado')
    .reduce((acc, p) => acc + p.total, 0);

  const stats = [
    {
      label: 'Total Clientes',
      value: clientes.length,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: 'Membresias Activas',
      value: membresiasActivas,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
        </svg>
      ),
      variant: 'success',
    },
    {
      label: 'Solicitudes Pendientes',
      value: solicitudesPendientes,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      variant: solicitudesPendientes > 0 ? 'warning' : undefined,
    },
    {
      label: 'Presupuestos',
      value: presupuestosPendientes,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      label: 'Leads Nuevos',
      value: leadsNuevos,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      variant: leadsNuevos > 0 ? 'success' : undefined,
    },
    {
      label: 'Ingresos del Mes',
      value: formatearMoneda(ingresosMes),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
  ];

  // Quick links para Super User
  const quickLinks = [
    { href: '/panel/super/usuarios', label: 'Gestionar Usuarios', icon: '👥' },
    { href: '/panel/super/configuracion', label: 'Configuracion', icon: '⚙️' },
    { href: '/panel/admin/clientes', label: 'Ver Clientes', icon: '👤' },
    { href: '/panel/admin/leads', label: 'Ver Leads', icon: '📋' },
  ];

  return (
    <>
      {/* Welcome */}
      <div className={styles.section} style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          Panel de Super Usuario
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Bienvenido, {usuario?.nombre}. Tienes acceso completo al sistema.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {stats.map((stat, index) => (
          <div key={index} className={`${styles.statCard} ${stat.variant ? styles[stat.variant] : ''}`}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Accesos Rapidos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
          {quickLinks.map((link, index) => (
            <Link 
              key={index} 
              href={link.href}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius)',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: 'var(--font-size-xl)' }}>{link.icon}</span>
              <span style={{ fontWeight: 500 }}>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Left Column - Leads */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Leads del Bot (Captados)</h2>
            <Link href="/panel/admin/leads">
              <Button variant="ghost" size="small">Ver todos</Button>
            </Link>
          </div>
          <div className={styles.list}>
            {leads.map((lead) => (
              <div key={lead.id} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <p className={styles.listItemTitle}>{lead.nombre}</p>
                  <p className={styles.listItemSubtitle}>{lead.zona} - {lead.telefono}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    {tiempoTranscurrido(lead.createdAt)}
                  </span>
                  <Badge variant={lead.estado === 'nuevo' ? 'error' : lead.estado === 'contactado' ? 'warning' : 'success'}>
                    {lead.estado}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Config Status */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Estado del Sistema</h2>
          <Card>
            <div style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Base de Datos</span>
                <Badge variant="warning">Mock (Sin conectar)</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>WhatsApp</span>
                <Badge variant="warning">No configurado</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Bot IA</span>
                <Badge variant="warning">Mock (Respuestas scriptadas)</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Autenticacion</span>
                <Badge variant="warning">Mock (localStorage)</Badge>
              </div>
            </div>
          </Card>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Link href="/panel/super/configuracion">
              <Button variant="outline" fullWidth>Ir a Configuracion</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
