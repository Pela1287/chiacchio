/* ============================================
   CHIACCHIO - Panel Admin - Servicios
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingOverlay, useToast } from '@/components/ui';
import styles from './page.module.css';

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  tarifaBase: number;
  duracionEstimada: number;
  activo: boolean;
  createdAt: string;
}

const CATEGORIAS = [
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { value: 'OBRA', label: 'Obra' },
  { value: 'INSTALACION', label: 'Instalación' },
  { value: 'REPARACION', label: 'Reparación' },
];

const getCategoriaLabel = (cat: string) => {
  return CATEGORIAS.find(c => c.value === cat)?.label || cat;
};

const getCategoriaClass = (cat: string) => {
  return cat.toLowerCase();
};

export default function ServiciosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'MANTENIMIENTO',
    tarifaBase: '',
    duracionEstimada: '60',
    activo: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session && ['SUPER', 'ADMIN'].includes(session.user.rol)) {
      fetchServicios();
    }
  }, [session, status, router]);

  const fetchServicios = async () => {
    try {
      const res = await fetch('/api/admin/servicios');
      if (res.ok) {
        const data = await res.json();
        setServicios(data);
      }
    } catch (error) {
      console.error('Error fetching servicios:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron cargar los servicios',
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingServicio(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: 'MANTENIMIENTO',
      tarifaBase: '',
      duracionEstimada: '60',
      activo: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (servicio: Servicio) => {
    setEditingServicio(servicio);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      categoria: servicio.categoria,
      tarifaBase: servicio.tarifaBase.toString(),
      duracionEstimada: servicio.duracionEstimada.toString(),
      activo: servicio.activo,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = '/api/admin/servicios';
      const method = editingServicio ? 'PUT' : 'POST';
      const body = editingServicio
        ? { ...formData, id: editingServicio.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: editingServicio ? 'Servicio actualizado' : 'Servicio creado',
          message: editingServicio
            ? 'El servicio fue actualizado correctamente'
            : 'El servicio fue creado correctamente',
        });
        setModalOpen(false);
        fetchServicios();
      } else {
        const error = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: error.error || 'No se pudo guardar el servicio',
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (servicio: Servicio) => {
    if (!confirm(`¿Estás seguro de eliminar el servicio "${servicio.nombre}"?`)) {
      return;
    }

    setDeleting(servicio.id);

    try {
      const res = await fetch(`/api/admin/servicios?id=${servicio.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const data = await res.json();
        showToast({
          type: 'success',
          title: 'Servicio eliminado',
          message: data.message || 'El servicio fue eliminado correctamente',
        });
        fetchServicios();
      } else {
        const error = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: error.error || 'No se pudo eliminar el servicio',
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión',
      });
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <LoadingOverlay text="Cargando servicios..." />;
  }

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Servicios</h1>
        <button className={styles.btnPrimary} onClick={openCreateModal}>
          + Nuevo Servicio
        </button>
      </div>

      {/* Grid de servicios */}
      {servicios.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay servicios cargados</p>
          <button className={styles.btnPrimary} onClick={openCreateModal}>
            Crear primer servicio
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className={`${styles.card} ${!servicio.activo ? styles.inactiveCard : ''}`}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  {servicio.nombre}
                  {!servicio.activo && (
                    <span className={styles.inactiveBadge}>Inactivo</span>
                  )}
                </h3>
                <span className={`${styles.cardCategory} ${styles[getCategoriaClass(servicio.categoria)]}`}>
                  {getCategoriaLabel(servicio.categoria)}
                </span>
              </div>

              <p className={styles.cardDescription}>
                {servicio.descripcion || 'Sin descripción'}
              </p>

              <div className={styles.cardFooter}>
                <div>
                  <div className={styles.cardPrice}>
                    {formatPrice(servicio.tarifaBase)}
                  </div>
                  <div className={styles.cardDuration}>
                    Duración estimada: {servicio.duracionEstimada} min
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.btnIcon}
                    onClick={() => openEditModal(servicio)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className={`${styles.btnIcon} ${styles.delete}`}
                    onClick={() => handleDelete(servicio)}
                    disabled={deleting === servicio.id}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              <button
                className={styles.modalClose}
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nombre *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                    placeholder="Ej: Instalación de tomacorrientes"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Descripción</label>
                  <textarea
                    className={styles.formTextarea}
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Describe el servicio..."
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Categoría *</label>
                    <select
                      className={styles.formSelect}
                      value={formData.categoria}
                      onChange={(e) =>
                        setFormData({ ...formData, categoria: e.target.value })
                      }
                      required
                    >
                      {CATEGORIAS.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Precio Base *</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={formData.tarifaBase}
                      onChange={(e) =>
                        setFormData({ ...formData, tarifaBase: e.target.value })
                      }
                      required
                      min="0"
                      step="100"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Duración (min)</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={formData.duracionEstimada}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duracionEstimada: e.target.value,
                        })
                      }
                      min="15"
                      step="15"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Estado</label>
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        checked={formData.activo}
                        onChange={(e) =>
                          setFormData({ ...formData, activo: e.target.checked })
                        }
                      />
                      <span>Activo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : editingServicio ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
