'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface Sucursal {
  id: string;
  codigo: string;
  nombre: string;
  activa: boolean;
  _count: { usuarios: number };
  admins: { nombre: string; apellido: string }[];
  createdAt: string;
}

const EMPTY_FORM = { codigo: '', nombre: '' };

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'crear' | 'editar' | null>(null);
  const [selected, setSelected] = useState<Sucursal | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/super/sucursales?all=1');
    const data = await res.json();
    setSucursales(data.sucursales || []);
    setLoading(false);
  }

  const filtered = sucursales.filter(
    (s) =>
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      s.codigo.toLowerCase().includes(search.toLowerCase())
  );

  function openCrear() {
    setForm(EMPTY_FORM);
    setError('');
    setModal('crear');
  }

  function openEditar(s: Sucursal) {
    setSelected(s);
    setForm({ codigo: s.codigo, nombre: s.nombre });
    setError('');
    setModal('editar');
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
    setError('');
  }

  async function handleSave() {
    if (!form.codigo.trim() || !form.nombre.trim()) {
      setError('Código y nombre son obligatorios');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const isEdit = modal === 'editar';
      const res = await fetch('/api/super/sucursales', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: selected!.id, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error al guardar'); return; }
      closeModal();
      load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActiva(s: Sucursal) {
    await fetch('/api/super/sucursales', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: s.id, activa: !s.activa }),
    });
    load();
  }

  const activas = sucursales.filter((s) => s.activa).length;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Sucursales</h1>
          <p className={styles.subtitle}>{sucursales.length} registradas · {activas} activas</p>
        </div>
        <button className={styles.btnPrimary} onClick={openCrear}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva sucursal
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.search}
            placeholder="Buscar por nombre o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}><div className={styles.spinner} /></div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Admins asignados</th>
                <th>Usuarios</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className={styles.empty}>No se encontraron sucursales</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id}>
                  <td><span className={styles.codigo}>{s.codigo}</span></td>
                  <td className={styles.nombre}>{s.nombre}</td>
                  <td>
                    {s.admins?.length > 0
                      ? s.admins.map((a) => `${a.nombre} ${a.apellido}`).join(', ')
                      : <span className={styles.noAdmin}>Sin admin</span>}
                  </td>
                  <td>{s._count?.usuarios ?? 0}</td>
                  <td>
                    <span className={`${styles.badge} ${s.activa ? styles.badgeActive : styles.badgeInactive}`}>
                      {s.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.btnEdit} onClick={() => openEditar(s)}>Editar</button>
                      <button
                        className={s.activa ? styles.btnDeactivate : styles.btnActivate}
                        onClick={() => toggleActiva(s)}
                      >
                        {s.activa ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className={styles.modalBg} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{modal === 'crear' ? 'Nueva sucursal' : 'Editar sucursal'}</h2>
              <button className={styles.modalClose} onClick={closeModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Código *</label>
              <input
                className={styles.input}
                placeholder="Ej: LP01"
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre *</label>
              <input
                className={styles.input}
                placeholder="Ej: La Plata Centro"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={closeModal}>Cancelar</button>
              <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
