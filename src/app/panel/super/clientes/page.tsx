'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  activo: boolean;
  sucursal: { codigo: string; nombre: string } | null;
  membresia: { plan: string; estado: string } | null;
  createdAt: string;
}

interface Sucursal {
  id: string;
  codigo: string;
  nombre: string;
}

const PLANES: Record<string, string> = {
  BASICO: 'Básico',
  ESTANDAR: 'Estándar',
  PREMIUM: 'Premium',
};

export default function ClientesSuperPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroSucursal, setFiltroSucursal] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  useEffect(() => {
    Promise.all([
      fetch('/api/super/clientes').then((r) => r.json()),
      fetch('/api/super/sucursales?all=1').then((r) => r.json()),
    ]).then(([cData, sData]) => {
      setClientes(cData.clientes || []);
      setSucursales(sData.sucursales || []);
      setLoading(false);
    });
  }, []);

  const filtered = clientes.filter((c) => {
    const texto = `${c.nombre} ${c.apellido} ${c.email} ${c.telefono}`.toLowerCase();
    const matchSearch = !search || texto.includes(search.toLowerCase());
    const matchSucursal = !filtroSucursal || c.sucursal?.codigo === filtroSucursal;
    const matchEstado =
      !filtroEstado ||
      (filtroEstado === 'activo' && c.activo) ||
      (filtroEstado === 'inactivo' && !c.activo);
    return matchSearch && matchSucursal && matchEstado;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSearchChange(v: string) {
    setSearch(v);
    setPage(1);
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Clientes</h1>
          <p className={styles.subtitle}>{filtered.length} de {clientes.length} clientes</p>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.search}
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <select
            className={styles.filterSelect}
            value={filtroSucursal}
            onChange={(e) => { setFiltroSucursal(e.target.value); setPage(1); }}
          >
            <option value="">Todas las sucursales</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.codigo}>{s.codigo} - {s.nombre}</option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); setPage(1); }}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}><div className={styles.spinner} /></div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Sucursal</th>
                  <th>Membresía</th>
                  <th>Estado</th>
                  <th>Desde</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} className={styles.empty}>No se encontraron clientes</td></tr>
                ) : paginated.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className={styles.clienteInfo}>
                        <div className={styles.avatar}>
                          {c.nombre[0]?.toUpperCase()}{c.apellido[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.clienteNombre}>{c.nombre} {c.apellido}</div>
                          <div className={styles.clienteEmail}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.telefono}>{c.telefono || '-'}</td>
                    <td>
                      {c.sucursal ? (
                        <span className={styles.sucursalTag}>{c.sucursal.codigo}</span>
                      ) : (
                        <span className={styles.noData}>—</span>
                      )}
                    </td>
                    <td>
                      {c.membresia ? (
                        <div>
                          <span className={styles.planTag}>{PLANES[c.membresia.plan] || c.membresia.plan}</span>
                          <span className={`${styles.estadoMembresia} ${c.membresia.estado === 'ACTIVA' ? styles.estadoActiva : styles.estadoInactiva}`}>
                            {c.membresia.estado.toLowerCase()}
                          </span>
                        </div>
                      ) : (
                        <span className={styles.noData}>Sin membresía</span>
                      )}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${c.activo ? styles.badgeActive : styles.badgeInactive}`}>
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className={styles.fecha}>{new Date(c.createdAt).toLocaleDateString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Anterior
              </button>
              <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
              <button
                className={styles.pageBtn}
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
