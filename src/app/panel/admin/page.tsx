/* ============================================
   CHIACCHIO - Panel Admin - Dashboard
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Badge, Button, LoadingOverlay, useToast } from '@/components/ui';
import { tiempoTranscurrido } from '@/lib/helpers';
import styles from './page.module.css';
import { hasAccess } from "@/lib/roles";

interface Solicitud {
  id: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  estado: string;
  prioridad: string;
  fechaSolicitada: string;
  createdAt: string;
  cliente: {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
  };
  servicio: {
    nombre: string;
  };
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [membresias, setMembresias] = useState<any[]>([]);
  const [actualizando, setActualizando] = useState<string | null>(null);
 
 

  useEffect(() => {

    if (status === "loading") return;

    const role = (session?.user as any)?.role;

    if (!hasAccess(role, "ADMIN")) {
      router.replace("/panel/cliente");
    }

  }, [session, status, router]);


  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [solicitudesRes, clientesRes, membresiasRes] = await Promise.all([
        fetch('/api/admin/solicitudes'),
        fetch('/api/clientes'),
        fetch('/api/admin/membresias'),
      ]);

      if (solicitudesRes.ok) {
        const data = await solicitudesRes.json();
        setSolicitudes(Array.isArray(data) ? data : []);
      }

      if (clientesRes.ok) {
        const data = await clientesRes.json();
        const clientesArray = Array.isArray(data) ? data : (data.clientes || []);
        setClientes(clientesArray);
      }

      if (membresiasRes.ok) {
        const data = await membresiasRes.json();
        setMembresias(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    setActualizando(id);
    try {
      const res = await fetch('/api/admin/solicitudes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Estado actualizado',
          message: `La solicitud pasó a ${nuevoEstado}`
        });
        fetchData();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'No se pudo actualizar el estado'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión'
      });
    } finally {
      setActualizando(null);
    }
  };

  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'PENDIENTE').length;
  const solicitudesEnProceso = solicitudes.filter(s => s.estado === 'EN_PROGRESO').length;
  const membresiasActivas = membresias.length;

  const stats = [
    {
      label: 'Total Clientes',
      value: clientes.length,
      color: '#3b82f6',
      href: '/panel/admin/clientes',
    },
    {
      label: 'Membresías Activas',
      value: membresiasActivas,
      color: '#22c55e',
      href: '/panel/admin/membresias',
    },
    {
      label: 'Solicitudes Pendientes',
      value: solicitudesPendientes,
      color: solicitudesPendientes > 0 ? '#f59e0b' : '#6b7280',
      href: null,
    },
    {
      label: 'En Proceso',
      value: solicitudesEnProceso,
      color: '#8b5cf6',
      href: null,
    },
  ];

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return { variant: 'warning' as const, label: 'Pendiente', color: '#f59e0b' };
      case 'CONFIRMADA': return { variant: 'info' as const, label: 'Confirmada', color: '#3b82f6' };
      case 'EN_PROGRESO': return { variant: 'info' as const, label: 'En Progreso', color: '#8b5cf6' };
      case 'COMPLETADA': return { variant: 'success' as const, label: 'Completada', color: '#22c55e' };
      case 'CANCELADA': return { variant: 'error' as const, label: 'Cancelada', color: '#ef4444' };
      default: return { variant: 'default' as const, label: estado, color: '#6b7280' };
    }
  };

  const getPrioridadConfig = (prioridad: string) => {
    switch (prioridad) {
      case 'URGENTE': return { variant: 'error' as const, label: '🔥 URGENTE' };
      case 'ALTA': return { variant: 'warning' as const, label: '⚡ Alta' };
      case 'MEDIA': return { variant: 'info' as const, label: '📌 Media' };
      case 'BAJA': return { variant: 'default' as const, label: '💤 Baja' };
      default: return { variant: 'default' as const, label: prioridad };
    }
  };

  if (loading) {
    return <LoadingOverlay text="Cargando panel..." />;
  }

  return (
    <>
      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${styles.statCard} ${stat.href ? styles.statCardClickable : ''}`}
            onClick={() => stat.href && router.push(stat.href)}
            style={{ cursor: stat.href ? 'pointer' : 'default' }}
          >
            <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
            {stat.href && <span className={styles.statLink}>Ver →</span>}
          </div>
        ))}
      </div>

      {/* Accesos Rápidos */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🚀 Accesos Rápidos</h2>
        <div className={styles.accesosGrid}>
          <button 
            className={styles.accesoCard}
            onClick={() => router.push('/panel/admin/servicios')}
          >
            <span className={styles.accesoIcon}>🔧</span>
            <span className={styles.accesoLabel}>Servicios</span>
            <span className={styles.accesoDesc}>Gestionar servicios y precios</span>
          </button>
          <button 
            className={styles.accesoCard}
            onClick={() => router.push('/panel/admin/presupuestos')}
          >
            <span className={styles.accesoIcon}>📄</span>
            <span className={styles.accesoLabel}>Presupuestos</span>
            <span className={styles.accesoDesc}>Crear y gestionar presupuestos</span>
          </button>
          <button 
            className={styles.accesoCard}
            onClick={() => router.push('/panel/admin/clientes')}
          >
            <span className={styles.accesoIcon}>👥</span>
            <span className={styles.accesoLabel}>Clientes</span>
            <span className={styles.accesoDesc}>Ver y gestionar clientes</span>
          </button>
          <button 
            className={styles.accesoCard}
            onClick={() => router.push('/panel/admin/membresias')}
          >
            <span className={styles.accesoIcon}>💳</span>
            <span className={styles.accesoLabel}>Membresías</span>
            <span className={styles.accesoDesc}>Activar membresías</span>
          </button>
        </div>
      </div>

      {/* Solicitudes */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>⚡ Solicitudes de Servicio</h2>
        
        {solicitudes.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay solicitudes aún</p>
          </div>
        ) : (
          <div className={styles.solicitudesGrid}>
            {solicitudes.map((sol) => {
              const estadoConfig = getEstadoConfig(sol.estado);
              const prioridadConfig = getPrioridadConfig(sol.prioridad);
              const isUpdating = actualizando === sol.id;

              return (
                <div key={sol.id} className={styles.solicitudCard}>
                  {/* Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.badgesRow}>
                      <Badge variant={prioridadConfig.variant}>{prioridadConfig.label}</Badge>
                      <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>
                    </div>
                    <span className={styles.fechaSolicitud}>
                      {tiempoTranscurrido(sol.createdAt)}
                    </span>
                  </div>

                  {/* Cliente */}
                  <div className={styles.clienteSection}>
                    <div className={styles.clienteAvatar}>
                      {sol.cliente?.nombre?.charAt(0)}{sol.cliente?.apellido?.charAt(0)}
                    </div>
                    <div className={styles.clienteInfo}>
                      <span className={styles.clienteNombre}>
                        {sol.cliente?.nombre} {sol.cliente?.apellido}
                      </span>
                      <span className={styles.clienteContacto}>
                        {sol.cliente?.telefono || sol.cliente?.email}
                      </span>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className={styles.descripcionSection}>
                    <p className={styles.descripcion}>{sol.descripcion}</p>
                  </div>

                  {/* Ubicación */}
                  <div className={styles.ubicacionSection}>
                    <span className={styles.ubicacion}>📍 {sol.direccion}, {sol.ciudad}</span>
                  </div>

                  {/* Acciones */}
                  <div className={styles.accionesSection}>
                    {sol.estado === 'PENDIENTE' && (
                      <>
                        <Button
                          variant="primary"
                          size="small"
                          loading={isUpdating}
                          onClick={() => cambiarEstado(sol.id, 'CONFIRMADA')}
                        >
                          ✓ Confirmar
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          loading={isUpdating}
                          onClick={() => cambiarEstado(sol.id, 'EN_PROGRESO')}
                        >
                          🔄 En Proceso
                        </Button>
                      </>
                    )}
                    {sol.estado === 'CONFIRMADA' && (
                      <Button
                        variant="primary"
                        size="small"
                        loading={isUpdating}
                        onClick={() => cambiarEstado(sol.id, 'EN_PROGRESO')}
                      >
                        🔄 Iniciar Trabajo
                      </Button>
                    )}
                    {sol.estado === 'EN_PROGRESO' && (
                      <Button
                        variant="primary"
                        size="small"
                        loading={isUpdating}
                        onClick={() => cambiarEstado(sol.id, 'COMPLETADA')}
                      >
                        ✅ Completar
                      </Button>
                    )}
                    {(sol.estado === 'PENDIENTE' || sol.estado === 'CONFIRMADA') && (
                      <Button
                        variant="ghost"
                        size="small"
                        loading={isUpdating}
                        onClick={() => cambiarEstado(sol.id, 'CANCELADA')}
                        style={{ color: '#ef4444' }}
                      >
                        ✗ Cancelar
                      </Button>
                    )}
                    <a 
                      href={`https://wa.me/${sol.cliente?.telefono?.replace(/\D/g, '')}?text=Hola%20${sol.cliente?.nombre},%20te%20escribimos%20de%20Chiacchio%20sobre%20tu%20solicitud`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappBtn}
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
