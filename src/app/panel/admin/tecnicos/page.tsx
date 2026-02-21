/* ============================================
   CHIACCHIO - Gestión de Técnicos (Admin)
   ============================================ */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Input, Card, useToast, LoadingOverlay } from '@/components/ui';
import styles from './page.module.css';

interface Tecnico {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  avatar?: string;
  activo: boolean;
}

export default function AdminTecnicosPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    telefono: '',
    avatar: '',
  });

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const fetchTecnicos = async () => {
    try {
      // Traer todos (incluye inactivos para admin)
      const res = await fetch('/api/tecnicos?all=true');
      if (res.ok) {
        const data = await res.json();
        setTecnicos(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast({
        type: 'error',
        title: 'Archivo muy grande',
        message: 'Máximo 2MB'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      setFormData(prev => ({ ...prev, avatar: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      especialidad: '',
      telefono: '',
      avatar: '',
    });
    setAvatarPreview(null);
    setEditingId(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/tecnicos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/tecnicos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        showToast({
          type: 'success',
          title: editingId ? 'Técnico actualizado' : 'Técnico agregado',
          message: 'Guardado correctamente'
        });
        resetForm();
        fetchTecnicos();
      } else {
        const error = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: error.error || 'Error al guardar'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión'
      });
    }
  };

  const handleEdit = (tecnico: Tecnico) => {
    setFormData({
      nombre: tecnico.nombre,
      apellido: tecnico.apellido,
      especialidad: tecnico.especialidad || '',
      telefono: tecnico.telefono || '',
      avatar: tecnico.avatar || '',
    });
    setAvatarPreview(tecnico.avatar || null);
    setEditingId(tecnico.id);
    setMostrarFormulario(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este técnico?')) return;

    try {
      const res = await fetch(`/api/tecnicos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Eliminado',
          message: 'Técnico eliminado'
        });
        fetchTecnicos();
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo eliminar'
      });
    }
  };

  const handleToggleActivo = async (id: string, activo: boolean) => {
    try {
      const res = await fetch(`/api/tecnicos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !activo }),
      });

      if (res.ok) {
        fetchTecnicos();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <LoadingOverlay text="Cargando..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/panel/admin" className={styles.backLink}>
          ← Volver
        </Link>
        <h1 className={styles.title}>👷 Gestión de Técnicos</h1>
        <p className={styles.subtitle}>Agregá y gestioná los electricistas del equipo</p>
      </div>

      {!mostrarFormulario && (
        <Button
          variant="primary"
          onClick={() => setMostrarFormulario(true)}
          style={{ marginBottom: 'var(--space-6)' }}
        >
          ➕ Agregar Técnico
        </Button>
      )}

      {mostrarFormulario && (
        <Card className={styles.formCard}>
          <h3 className={styles.formTitle}>
            {editingId ? 'Editar Técnico' : 'Nuevo Técnico'}
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Avatar */}
            <div className={styles.avatarSection}>
              <div 
                className={styles.avatarWrapper}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className={styles.avatarImage} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                <div className={styles.avatarOverlay}>
                  📷
                </div>
              </div>
              <div className={styles.avatarInfo}>
                <p className={styles.avatarLabel}>Foto del técnico</p>
                <p className={styles.avatarDesc}>JPG o PNG. Máx 2MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className={styles.formRow}>
              <Input
                label="Nombre *"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan"
              />
              <Input
                label="Apellido *"
                name="apellido"
                required
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Pérez"
              />
            </div>

            <Input
              label="Especialidad"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              placeholder="Ej: Instalaciones, Tableros, Aire Acondicionado..."
            />

            <Input
              label="Teléfono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+54 9 221 XXX XXXX"
            />

            <div className={styles.formActions}>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {editingId ? 'Guardar Cambios' : 'Agregar Técnico'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista */}
      <div className={styles.grid}>
        {tecnicos.map((tecnico) => (
          <Card key={tecnico.id} className={`${styles.tecnicoCard} ${!tecnico.activo ? styles.inactivo : ''}`}>
            <div className={styles.tecnicoAvatar}>
              {tecnico.avatar ? (
                <img src={tecnico.avatar} alt={tecnico.nombre} className={styles.tecnicoAvatarImg} />
              ) : (
                <div className={styles.tecnicoAvatarPlaceholder}>
                  {tecnico.nombre.charAt(0)}{tecnico.apellido.charAt(0)}
                </div>
              )}
              <span className={`${styles.estadoBadge} ${tecnico.activo ? styles.activo : styles.inactivoBadge}`}>
                {tecnico.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className={styles.tecnicoInfo}>
              <h4 className={styles.tecnicoNombre}>
                {tecnico.nombre} {tecnico.apellido}
              </h4>
              {tecnico.especialidad && (
                <p className={styles.tecnicoEspecialidad}>⚡ {tecnico.especialidad}</p>
              )}
              {tecnico.telefono && (
                <p className={styles.tecnicoTelefono}>📱 {tecnico.telefono}</p>
              )}
            </div>
            <div className={styles.tecnicoActions}>
              <Button variant="secondary" size="small" onClick={() => handleEdit(tecnico)}>
                Editar
              </Button>
              <Button 
                variant={tecnico.activo ? 'secondary' : 'primary'} 
                size="small"
                onClick={() => handleToggleActivo(tecnico.id, tecnico.activo)}
              >
                {tecnico.activo ? 'Desactivar' : 'Activar'}
              </Button>
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => handleDelete(tecnico.id)}
                style={{ color: '#ef4444' }}
              >
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {tecnicos.length === 0 && !mostrarFormulario && (
        <Card className={styles.emptyState}>
          <p>No hay técnicos cargados. Agregá el primero.</p>
        </Card>
      )}
    </div>
  );
}
