/* ============================================
   CHIACCHIO - Panel Super Usuario - Usuarios
   ============================================ */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Badge, LoadingOverlay, useToast } from '@/components/ui';
import { formatearFecha } from '@/lib/helpers';
import styles from '../../admin/page.module.css';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: string;
  activo: boolean;
  createdAt: string;
  cliente?: {
    id: string;
    nombre: string;
    apellido: string;
  };
}

export default function UsuariosPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol: 'CLIENTE',
    password: '',
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const userRole = (session.user as any).role || (session.user as any).rol;
      if (userRole !== 'SUPER') {
        router.push('/panel');
        return;
      }
      fetchUsuarios();
    }
  }, [session, router]);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/super/usuarios');
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data.usuarios || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const url = editando 
        ? `/api/super/usuarios?id=${editando.id}`
        : '/api/super/usuarios';
      
      const body = editando 
        ? { id: editando.id, ...formData, password: formData.password || undefined }
        : formData;

      const res = await fetch(url, {
        method: editando ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: editando ? 'Usuario actualizado' : 'Usuario creado',
          message: 'Los cambios se guardaron correctamente'
        });
        setShowModal(false);
        setEditando(null);
        setFormData({ nombre: '', apellido: '', email: '', telefono: '', rol: 'CLIENTE', password: '' });
        fetchUsuarios();
      } else {
        const data = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: data.error || 'No se pudo guardar'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión'
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditando(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono || '',
      rol: usuario.rol,
      password: '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const res = await fetch(`/api/super/usuarios?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Usuario eliminado',
          message: 'El usuario fue eliminado correctamente'
        });
        fetchUsuarios();
      } else {
        const data = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: data.error || 'No se pudo eliminar'
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

  const getRolBadge = (rol: string) => {
    switch (rol) {
      case 'SUPER': return { variant: 'error' as const, label: 'Super User' };
      case 'ADMIN': return { variant: 'warning' as const, label: 'Admin' };
      default: return { variant: 'info' as const, label: 'Cliente' };
    }
  };

  if (loading) {
    return <LoadingOverlay text="Cargando usuarios..." />;
  }

  return (
    <>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
          Gestion de Usuarios
        </h1>
        <Button 
          variant="primary"
          onClick={() => {
            setEditando(null);
            setFormData({ nombre: '', apellido: '', email: '', telefono: '', rol: 'CLIENTE', password: '' });
            setShowModal(true);
          }}
        >
          + Nuevo Usuario
        </Button>
      </div>

      {/* Lista de usuarios */}
      <div className={styles.list}>
        {usuarios.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay usuarios registrados</p>
          </div>
        ) : (
          usuarios.map((usuario) => {
            const rolConfig = getRolBadge(usuario.rol);
            return (
              <div key={usuario.id} className={styles.listItem}>
                <div className={styles.clienteSection}>
                  <div className={styles.clienteAvatar}>
                    {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                  </div>
                  <div className={styles.clienteInfo}>
                    <span className={styles.clienteNombre}>
                      {usuario.nombre} {usuario.apellido}
                    </span>
                    <span className={styles.clienteContacto}>
                      {usuario.email} {usuario.telefono && `• ${usuario.telefono}`}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Badge variant={rolConfig.variant}>{rolConfig.label}</Badge>
                  <Badge variant={usuario.activo ? 'success' : 'default'}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button 
                      variant="ghost" 
                      size="small"
                      onClick={() => handleEdit(usuario)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="small"
                      onClick={() => handleDelete(usuario.id)}
                      style={{ color: '#ef4444' }}
                      disabled={usuario.id === (session?.user as any)?.id}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--space-6)',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-lg)' }}>
              {editando ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                  Telefono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                  Rol *
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER">Super Usuario</option>
                </select>
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--font-size-sm)' }}>
                  Password {editando ? '(dejar vacio para mantener)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editando}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowModal(false);
                    setEditando(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={guardando}
                >
                  {editando ? 'Guardar Cambios' : 'Crear Usuario'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
