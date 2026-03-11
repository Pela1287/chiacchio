'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

interface Tecnico {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  especialidad: string;
  telefono: string;
  avatar?: string;
  antecedentes: string;
  observaciones: string;
  activo: boolean;
  trabajosActivos: number;
}

const ESPECIALIDADES = [
  'Instalaciones eléctricas', 'Mantenimiento industrial', 'Automatización',
  'Tableros eléctricos', 'Instalaciones domiciliarias', 'Iluminación LED',
  'Energías renovables', 'General',
];

const EMPTY: Omit<Tecnico, 'id' | 'activo' | 'trabajosActivos'> = {
  nombre: '', apellido: '', email: '', dni: '', especialidad: '',
  telefono: '', avatar: '', antecedentes: '', observaciones: '',
};

export default function TecnicosPage() {
  const { data: session } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'crear' | 'editar' | 'ver' | null>(null);
  const [selected, setSelected] = useState<Tecnico | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'activos' | 'inactivos'>('activos');
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/tecnicos?all=true');
    if (res.ok) setTecnicos(await res.json());
    setLoading(false);
  }

  const displayed = tecnicos.filter((t) => {
    const matchFiltro = filtro === 'todos' || (filtro === 'activos' ? t.activo : !t.activo);
    const texto = `${t.nombre} ${t.apellido} ${t.especialidad} ${t.dni}`.toLowerCase();
    return matchFiltro && (!search || texto.includes(search.toLowerCase()));
  });

  function openCrear() {
    setForm({ ...EMPTY });
    setError('');
    setModal('crear');
  }

  function openEditar(t: Tecnico) {
    setSelected(t);
    setForm({
      nombre: t.nombre, apellido: t.apellido, email: t.email || '',
      dni: t.dni || '', especialidad: t.especialidad || '',
      telefono: t.telefono || '', avatar: t.avatar || '',
      antecedentes: t.antecedentes || '', observaciones: t.observaciones || '',
    });
    setError('');
    setModal('editar');
  }

  function openVer(t: Tecnico) {
    setSelected(t);
    setModal('ver');
  }

  function closeModal() { setModal(null); setSelected(null); setError(''); }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setError('La imagen no puede superar 3MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, avatar: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError('Nombre y apellido son obligatorios');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const isEdit = modal === 'editar';
      const url = isEdit ? `/api/tecnicos/${selected!.id}` : '/api/tecnicos';
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error al guardar'); return; }
      closeModal();
      load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActivo(t: Tecnico) {
    await fetch(`/api/tecnicos/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !t.activo }),
    });
    load();
  }

  async function eliminar(t: Tecnico) {
    if (!confirm(`¿Eliminar a ${t.nombre} ${t.apellido}? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/tecnicos/${t.id}`, { method: 'DELETE' });
    load();
  }

  const activos = tecnicos.filter((t) => t.activo).length;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Electricistas</h1>
          <p className={styles.subtitle}>{tecnicos.length} registrados · {activos} activos</p>
        </div>
        <button className={styles.btnPrimary} onClick={openCrear}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo electricista
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.search}
            placeholder="Buscar por nombre, DNI o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filtros}>
          {(['activos', 'todos', 'inactivos'] as const).map((f) => (
            <button
              key={f}
              className={`${styles.filtroBtn} ${filtro === f ? styles.filtroActivo : ''}`}
              onClick={() => setFiltro(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}><div className={styles.spinner} /></div>
      ) : (
        <div className={styles.grid}>
          {displayed.length === 0 ? (
            <div className={styles.empty}>No se encontraron electricistas</div>
          ) : displayed.map((t) => (
            <div key={t.id} className={`${styles.card} ${!t.activo ? styles.cardInactivo : ''}`}>
              <div className={styles.cardTop}>
                <div className={styles.avatarWrap}>
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.nombre} className={styles.avatarImg} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {t.nombre[0]}{t.apellido[0]}
                    </div>
                  )}
                  <span className={`${styles.statusDot} ${t.activo ? styles.dotActivo : styles.dotInactivo}`} />
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardNombre}>{t.nombre} {t.apellido}</h3>
                  <p className={styles.cardEspecialidad}>{t.especialidad || 'Sin especialidad'}</p>
                  {t.trabajosActivos > 0 && (
                    <span className={styles.workBadge}>{t.trabajosActivos} trabajo{t.trabajosActivos !== 1 ? 's' : ''} activo{t.trabajosActivos !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
              <div className={styles.cardMeta}>
                {t.telefono && <span>📞 {t.telefono}</span>}
                {t.dni && <span>🪪 DNI {t.dni}</span>}
                {t.email && <span>✉️ {t.email}</span>}
              </div>
              <div className={styles.cardActions}>
                <button className={styles.btnVer} onClick={() => openVer(t)}>Ver ficha</button>
                <button className={styles.btnEdit} onClick={() => openEditar(t)}>Editar</button>
                <button
                  className={t.activo ? styles.btnDeactivate : styles.btnActivate}
                  onClick={() => toggleActivo(t)}
                >
                  {t.activo ? 'Desactivar' : 'Activar'}
                </button>
                <button className={styles.btnDelete} onClick={() => eliminar(t)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      {(modal === 'crear' || modal === 'editar') && (
        <div className={styles.modalBg} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{modal === 'crear' ? 'Nuevo electricista' : 'Editar electricista'}</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>

            <div className={styles.avatarSection}>
              <div className={styles.avatarEditWrap} onClick={() => fileRef.current?.click()}>
                {form.avatar ? (
                  <img src={form.avatar} alt="" className={styles.avatarEditImg} />
                ) : (
                  <div className={styles.avatarEditPlaceholder}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" />
                    </svg>
                  </div>
                )}
                <div className={styles.avatarOverlay}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              <div className={styles.avatarHint}>Clic para subir foto (máx. 3MB)</div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.fg}>
                <label className={styles.label}>Nombre *</label>
                <input className={styles.input} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Juan" />
              </div>
              <div className={styles.fg}>
                <label className={styles.label}>Apellido *</label>
                <input className={styles.input} value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} placeholder="Pérez" />
              </div>
              <div className={styles.fg}>
                <label className={styles.label}>DNI</label>
                <input className={styles.input} value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} placeholder="30.123.456" />
              </div>
              <div className={styles.fg}>
                <label className={styles.label}>Teléfono</label>
                <input className={styles.input} value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="+54 221 123-4567" />
              </div>
              <div className={styles.fg}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="juan@email.com" />
              </div>
              <div className={styles.fg}>
                <label className={styles.label}>Especialidad</label>
                <select className={styles.input} value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {ESPECIALIDADES.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className={styles.fgFull}>
                <label className={styles.label}>Antecedentes / Certificaciones</label>
                <textarea className={styles.textarea} rows={3} value={form.antecedentes} onChange={(e) => setForm({ ...form, antecedentes: e.target.value })} placeholder="Habilitaciones, cursos, matrículas, historial profesional..." />
              </div>
              <div className={styles.fgFull}>
                <label className={styles.label}>Observaciones internas</label>
                <textarea className={styles.textarea} rows={2} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} placeholder="Notas internas del equipo..." />
              </div>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={closeModal}>Cancelar</button>
              <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : modal === 'crear' ? 'Crear electricista' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ver ficha */}
      {modal === 'ver' && selected && (
        <div className={styles.modalBg} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Ficha del electricista</h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={styles.fichaTop}>
              {selected.avatar ? (
                <img src={selected.avatar} alt={selected.nombre} className={styles.fichaAvatar} />
              ) : (
                <div className={styles.fichaAvatarPlaceholder}>{selected.nombre[0]}{selected.apellido[0]}</div>
              )}
              <div>
                <h3 className={styles.fichaNombre}>{selected.nombre} {selected.apellido}</h3>
                <p className={styles.fichaEspecialidad}>{selected.especialidad || 'Sin especialidad'}</p>
                <span className={`${styles.badge} ${selected.activo ? styles.badgeActivo : styles.badgeInactivo}`}>
                  {selected.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <div className={styles.fichaGrid}>
              {selected.dni && <FichaItem label="DNI" value={selected.dni} />}
              {selected.telefono && <FichaItem label="Teléfono" value={selected.telefono} />}
              {selected.email && <FichaItem label="Email" value={selected.email} />}
              <FichaItem label="Trabajos activos" value={String(selected.trabajosActivos)} />
            </div>
            {selected.antecedentes && (
              <div className={styles.fichaSection}>
                <h4 className={styles.fichaSectionTitle}>Antecedentes / Certificaciones</h4>
                <p className={styles.fichaText}>{selected.antecedentes}</p>
              </div>
            )}
            {selected.observaciones && (
              <div className={styles.fichaSection}>
                <h4 className={styles.fichaSectionTitle}>Observaciones internas</h4>
                <p className={styles.fichaText}>{selected.observaciones}</p>
              </div>
            )}
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={closeModal}>Cerrar</button>
              <button className={styles.btnPrimary} onClick={() => { closeModal(); setTimeout(() => openEditar(selected), 50); }}>
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FichaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fichaItem}>
      <span className={styles.fichaLabel}>{label}</span>
      <span className={styles.fichaValue}>{value}</span>
    </div>
  );
}
