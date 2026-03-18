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

interface Tecnico {
  id: string;
  nombre: string;
  apellido: string;
  especialidad?: string;
  telefono?: string;
  avatar?: string;
  _count?: { solicitudes: number };
}

interface Solicitud {
  id: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  estado: string;
  prioridad: string;
  fechaSolicitada: string;
  fechaProgramada?: string;
  notas?: string;
  createdAt: string;
  foto?: string | null;
  cliente: { id: string; nombre: string; apellido: string; telefono: string; email: string };
  servicio: { nombre: string };
  tecnico?: Tecnico | null;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [membresias, setMembresias] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [actualizando, setActualizando] = useState<string | null>(null);

  // Modal detalle
  const [modalSol, setModalSol] = useState<Solicitud | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [asignando, setAsignando] = useState(false);
  const [tecnicoSel, setTecnicoSel] = useState<string>('');

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role;
    if (!hasAccess(role, "ADMIN")) router.replace("/panel/cliente");
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user) fetchData();
  }, [session]);

  const fetchData = async () => {
    try {
      const [solRes, cliRes, memRes, tecRes] = await Promise.all([
        fetch('/api/admin/solicitudes'),
        fetch('/api/clientes'),
        fetch('/api/admin/membresias'),
        fetch('/api/admin/tecnicos'),
      ]);
      if (solRes.ok) setSolicitudes(await solRes.json());
      if (cliRes.ok) { const d = await cliRes.json(); setClientes(Array.isArray(d) ? d : d.clientes || []); }
      if (memRes.ok) { const d = await memRes.json(); setMembresias(Array.isArray(d) ? d : []); }
      if (tecRes.ok) setTecnicos(await tecRes.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    setActualizando(id);
    try {
      const res = await fetch(`/api/admin/solicitudes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) {
        showToast({ type: 'success', title: 'Estado actualizado', message: `Solicitud: ${nuevoEstado}` });
        await fetchData();
        if (modalSol?.id === id) {
          const updated = await fetch('/api/admin/solicitudes').then(r => r.json());
          const sol = updated.find((s: Solicitud) => s.id === id);
          if (sol) setModalSol(sol);
        }
      } else {
        showToast({ type: 'error', title: 'Error', message: 'No se pudo actualizar' });
      }
    } catch { showToast({ type: 'error', title: 'Error', message: 'Error de conexion' }); }
    finally { setActualizando(null); }
  };

  const asignarTecnico = async () => {
    if (!modalSol) return;
    setAsignando(true);
    try {
      const res = await fetch(`/api/admin/solicitudes/${modalSol.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tecnicoId: tecnicoSel || null }),
      });
      if (res.ok) {
        const data = await res.json();
        const tecnico = tecnicoSel ? tecnicos.find(t => t.id === tecnicoSel) || null : null;
        setModalSol({ ...modalSol, tecnico });
        await fetchData();
        showToast({ type: 'success', title: 'Tecnico asignado', message: tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : 'Desasignado' });
      }
    } catch { showToast({ type: 'error', title: 'Error', message: 'No se pudo asignar' }); }
    finally { setAsignando(false); }
  };

  const abrirModal = (sol: Solicitud, filtro?: string) => {
    setModalSol(sol);
    setTecnicoSel(sol.tecnico?.id || '');
    if (filtro) setFiltroEstado(filtro);
  };

  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'PENDIENTE');
  const solicitudesEnProceso = solicitudes.filter(s => s.estado === 'EN_PROGRESO');

  const getEstadoConfig = (estado: string) => {
    const map: Record<string, any> = {
      PENDIENTE: { variant: 'warning', label: 'Pendiente' },
      CONFIRMADA: { variant: 'info', label: 'Confirmada' },
      EN_PROGRESO: { variant: 'info', label: 'En Progreso' },
      COMPLETADA: { variant: 'success', label: 'Completada' },
      CANCELADA: { variant: 'error', label: 'Cancelada' },
    };
    return map[estado] || { variant: 'default', label: estado };
  };

  const getPrioridadConfig = (prioridad: string) => {
    const map: Record<string, any> = {
      URGENTE: { variant: 'error', label: 'URGENTE' },
      ALTA: { variant: 'warning', label: 'Alta' },
      MEDIA: { variant: 'info', label: 'Media' },
      BAJA: { variant: 'default', label: 'Baja' },
    };
    return map[prioridad] || { variant: 'default', label: prioridad };
  };

  if (loading) return <LoadingOverlay text="Cargando panel..." />;

  const stats = [
    { label: 'Total Clientes', value: clientes.length, color: '#3b82f6', href: '/panel/admin/clientes', filtro: null },
    { label: 'Membresias Activas', value: membresias.length, color: '#22c55e', href: '/panel/admin/membresias', filtro: null },
    { label: 'Solicitudes Pendientes', value: solicitudesPendientes.length, color: solicitudesPendientes.length > 0 ? '#f59e0b' : '#6b7280', href: null, filtro: 'PENDIENTE' },
    { label: 'En Proceso', value: solicitudesEnProceso.length, color: '#8b5cf6', href: null, filtro: 'EN_PROGRESO' },
  ];

  const solicitudesVisibles = filtroEstado
    ? solicitudes.filter(s => s.estado === filtroEstado)
    : solicitudes;

  return (
    <>
      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${styles.statCard} ${(stat.href || stat.filtro) ? styles.statCardClickable : ''}`}
            onClick={() => {
              if (stat.href) { router.push(stat.href); return; }
              if (stat.filtro) {
                setFiltroEstado(prev => prev === stat.filtro ? null : stat.filtro);
                setTimeout(() => document.getElementById('solicitudes-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }
            }}
            style={{ cursor: (stat.href || stat.filtro) ? 'pointer' : 'default' }}
          >
            <div className={styles.statValue} style={{ color: stat.color }}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
            {stat.href && <span className={styles.statLink}>Ver</span>}
            {stat.filtro && <span className={styles.statLink}>{filtroEstado === stat.filtro ? 'Mostrando' : 'Ver detalle'}</span>}
          </div>
        ))}
      </div>

      {/* Accesos Rapidos */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Accesos Rapidos</h2>
        <div className={styles.accesosGrid}>
          {[
            { icon: '⚙', label: 'Servicios', desc: 'Gestionar servicios', href: '/panel/admin/servicios' },
            { icon: '📄', label: 'Presupuestos', desc: 'Crear y gestionar', href: '/panel/admin/presupuestos' },
            { icon: '👥', label: 'Clientes', desc: 'Ver y gestionar', href: '/panel/admin/clientes' },
            { icon: '💳', label: 'Membresias', desc: 'Activar membresias', href: '/panel/admin/membresias' },
            { icon: '⚡', label: 'Electricistas', desc: 'Tecnicos y asignaciones', href: '/panel/admin/tecnicos' },
          ].map((a, i) => (
            <button key={i} className={styles.accesoCard} onClick={() => router.push(a.href)}>
              <span className={styles.accesoIcon}>{a.icon}</span>
              <span className={styles.accesoLabel}>{a.label}</span>
              <span className={styles.accesoDesc}>{a.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Solicitudes */}
      <div className={styles.section} id="solicitudes-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Solicitudes de Servicio</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {['PENDIENTE', 'EN_PROGRESO', 'CONFIRMADA', 'COMPLETADA'].map(e => (
              <button
                key={e}
                onClick={() => setFiltroEstado(prev => prev === e ? null : e)}
                style={{
                  padding: '4px 12px', borderRadius: 20, border: '1px solid #e2e8f0', fontSize: 12, cursor: 'pointer',
                  background: filtroEstado === e ? '#1e3a5f' : 'white',
                  color: filtroEstado === e ? 'white' : '#555',
                  fontWeight: filtroEstado === e ? 600 : 400,
                }}
              >
                {e === 'PENDIENTE' ? 'Pendientes' : e === 'EN_PROGRESO' ? 'En Proceso' : e === 'CONFIRMADA' ? 'Confirmadas' : 'Completadas'}
                {e === 'PENDIENTE' && solicitudesPendientes.length > 0 && (
                  <span style={{ marginLeft: 4, background: '#f59e0b', color: 'white', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
                    {solicitudesPendientes.length}
                  </span>
                )}
              </button>
            ))}
            {filtroEstado && (
              <button onClick={() => setFiltroEstado(null)} style={{ padding: '4px 10px', borderRadius: 20, border: '1px solid #e2e8f0', fontSize: 12, cursor: 'pointer', background: 'white', color: '#ef4444' }}>
                Limpiar
              </button>
            )}
          </div>
        </div>

        {solicitudesVisibles.length === 0 ? (
          <div className={styles.emptyState}><p>No hay solicitudes{filtroEstado ? ' con ese filtro' : ' aun'}</p></div>
        ) : (
          <div className={styles.solicitudesGrid}>
            {solicitudesVisibles.map((sol) => {
              const estadoConfig = getEstadoConfig(sol.estado);
              const prioridadConfig = getPrioridadConfig(sol.prioridad);
              const isUpdating = actualizando === sol.id;

              return (
                <div key={sol.id} className={styles.solicitudCard} style={{ cursor: 'pointer' }} onClick={() => abrirModal(sol)}>
                  <div className={styles.cardHeader}>
                    <div className={styles.badgesRow}>
                      <Badge variant={prioridadConfig.variant}>{prioridadConfig.label}</Badge>
                      <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>
                    </div>
                    <span className={styles.fechaSolicitud}>{tiempoTranscurrido(sol.createdAt)}</span>
                  </div>

                  <div className={styles.clienteSection}>
                    <div className={styles.clienteAvatar}>{sol.cliente?.nombre?.charAt(0)}{sol.cliente?.apellido?.charAt(0)}</div>
                    <div className={styles.clienteInfo}>
                      <span className={styles.clienteNombre}>{sol.cliente?.nombre} {sol.cliente?.apellido}</span>
                      <span className={styles.clienteContacto}>{sol.cliente?.telefono || sol.cliente?.email}</span>
                    </div>
                  </div>

                  <div className={styles.descripcionSection}>
                    <p className={styles.descripcion}>{sol.descripcion}</p>
                  </div>

                  {sol.foto && (
                    <div className={styles.fotoSection} onClick={e => e.stopPropagation()}>
                      <a href={sol.foto!} target="_blank" rel="noopener noreferrer">
                        <img src={sol.foto!} alt="Foto" className={styles.fotoThumb} />
                      </a>
                    </div>
                  )}

                  {sol.tecnico && (
                    <div style={{ padding: '6px 0', fontSize: 13, color: '#16a34a', borderTop: '1px solid #e2e8f0', marginTop: 8 }}>
                      Tecnico: {sol.tecnico.nombre} {sol.tecnico.apellido}
                    </div>
                  )}

                  <div className={styles.ubicacionSection}>
                    <span className={styles.ubicacion}>{sol.direccion}, {sol.ciudad}</span>
                  </div>

                  <div className={styles.accionesSection} onClick={e => e.stopPropagation()}>
                    {sol.estado === 'PENDIENTE' && (
                      <>
                        <Button variant="primary" size="small" loading={isUpdating} onClick={() => cambiarEstado(sol.id, 'CONFIRMADA')}>Confirmar</Button>
                        <Button variant="secondary" size="small" loading={isUpdating} onClick={() => cambiarEstado(sol.id, 'EN_PROGRESO')}>En Proceso</Button>
                      </>
                    )}
                    {sol.estado === 'CONFIRMADA' && (
                      <Button variant="primary" size="small" loading={isUpdating} onClick={() => cambiarEstado(sol.id, 'EN_PROGRESO')}>Iniciar Trabajo</Button>
                    )}
                    {sol.estado === 'EN_PROGRESO' && (
                      <Button variant="primary" size="small" loading={isUpdating} onClick={() => cambiarEstado(sol.id, 'COMPLETADA')}>Completar</Button>
                    )}
                    {(sol.estado === 'PENDIENTE' || sol.estado === 'CONFIRMADA') && (
                      <Button variant="ghost" size="small" loading={isUpdating} onClick={() => cambiarEstado(sol.id, 'CANCELADA')} style={{ color: '#ef4444' }}>Cancelar</Button>
                    )}
                    <a
                      href={`https://wa.me/${sol.cliente?.telefono?.replace(/\D/g, '')}?text=Hola%20${sol.cliente?.nombre}`}
                      target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Detalle Solicitud */}
      {modalSol && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setModalSol(null)}
        >
          <div
            style={{ background: 'white', borderRadius: 12, width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header modal */}
            <div style={{ background: '#1e3a5f', color: 'white', padding: '20px 24px', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Detalle de Solicitud</div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{tiempoTranscurrido(modalSol.createdAt)}</div>
              </div>
              <button onClick={() => setModalSol(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <Badge variant={getPrioridadConfig(modalSol.prioridad).variant}>{getPrioridadConfig(modalSol.prioridad).label}</Badge>
                <Badge variant={getEstadoConfig(modalSol.estado).variant}>{getEstadoConfig(modalSol.estado).label}</Badge>
              </div>

              {/* Cliente */}
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Cliente</div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{modalSol.cliente?.nombre} {modalSol.cliente?.apellido}</div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{modalSol.cliente?.telefono} · {modalSol.cliente?.email}</div>
              </div>

              {/* Descripcion */}
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Descripcion del Trabajo</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{modalSol.descripcion}</p>
              </div>

              {/* Ubicacion */}
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Ubicacion</div>
                <p style={{ margin: 0, fontSize: 14 }}>{modalSol.direccion}, {modalSol.ciudad}</p>
              </div>

              {/* Foto */}
              {modalSol.foto && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Foto adjunta</div>
                  <a href={modalSol.foto} target="_blank" rel="noopener noreferrer">
                    <img src={modalSol.foto} alt="Foto" style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 8, objectFit: 'contain', border: '1px solid #e2e8f0', cursor: 'zoom-in' }} />
                  </a>
                </div>
              )}

              {/* Asignar Tecnico */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  Asignar Electricista
                </div>
                {modalSol.tecnico && (
                  <div style={{ marginBottom: 10, fontSize: 13, color: '#166534', fontWeight: 600 }}>
                    Asignado: {modalSol.tecnico.nombre} {modalSol.tecnico.apellido}
                    {modalSol.tecnico.especialidad && <span style={{ fontWeight: 400, color: '#555' }}> · {modalSol.tecnico.especialidad}</span>}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    value={tecnicoSel}
                    onChange={e => setTecnicoSel(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #d1fae5', fontSize: 14, background: 'white' }}
                  >
                    <option value="">-- Sin asignar --</option>
                    {tecnicos.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.nombre} {t.apellido}{t.especialidad ? ` (${t.especialidad})` : ''} · {t._count?.solicitudes ?? 0} trabajos
                      </option>
                    ))}
                  </select>
                  <Button variant="primary" size="small" loading={asignando} onClick={asignarTecnico}>
                    {tecnicoSel ? 'Asignar' : 'Desasignar'}
                  </Button>
                </div>
              </div>

              {/* Notas */}
              {modalSol.notas && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13 }}>
                  <strong>Notas:</strong> {modalSol.notas}
                </div>
              )}

              {/* Acciones de estado */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                {modalSol.estado === 'PENDIENTE' && (
                  <>
                    <Button variant="primary" size="small" loading={actualizando === modalSol.id} onClick={() => cambiarEstado(modalSol.id, 'CONFIRMADA')}>Confirmar</Button>
                    <Button variant="secondary" size="small" loading={actualizando === modalSol.id} onClick={() => cambiarEstado(modalSol.id, 'EN_PROGRESO')}>En Proceso</Button>
                  </>
                )}
                {modalSol.estado === 'CONFIRMADA' && (
                  <Button variant="primary" size="small" loading={actualizando === modalSol.id} onClick={() => cambiarEstado(modalSol.id, 'EN_PROGRESO')}>Iniciar Trabajo</Button>
                )}
                {modalSol.estado === 'EN_PROGRESO' && (
                  <Button variant="primary" size="small" loading={actualizando === modalSol.id} onClick={() => cambiarEstado(modalSol.id, 'COMPLETADA')}>Completar</Button>
                )}
                {(modalSol.estado === 'PENDIENTE' || modalSol.estado === 'CONFIRMADA') && (
                  <Button variant="ghost" size="small" loading={actualizando === modalSol.id} onClick={() => cambiarEstado(modalSol.id, 'CANCELADA')} style={{ color: '#ef4444' }}>Cancelar</Button>
                )}
                <a
                  href={`https://wa.me/${modalSol.cliente?.telefono?.replace(/\D/g, '')}?text=Hola%20${modalSol.cliente?.nombre},%20te%20escribimos%20de%20Chiacchio%20sobre%20tu%20solicitud`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, background: '#25d366', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}