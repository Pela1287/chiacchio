'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Badge, Button, LoadingOverlay, useToast } from '@/components/ui';
import { getRolNombre, getRolColor } from '@/lib/rbac';
import styles from './page.module.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireRole } from '@/lib/rbac';


interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  rol: string;
  activo: boolean;
  createdAt: string;
}



export default async function ServiciosPage() {
  const session = await getServerSession(authOptions);
  requireRole(session, 'admin');  // permite admin Y super
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroRol, setFiltroRol] = useState<string>('TODOS');
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState<Usuario | null>(null);
  const [guardando, setGuardando] = useState(false);
  

  useEffect(() => {
    fetchUsuarios();
  }, [filtroRol]);

  const fetchUsuarios = async () => {
    try {
      const url = filtroRol === 'TODOS' 
        ? '/api/super/usuarios' 
        : `/api/super/usuarios?rol=${filtroRol}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuardando(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      nombre: formData.get('nombre'),
      apellido: formData.get('apellido'),
      telefono: formData.get('telefono'),
      rol: formData.get('rol'),
    };

    try {
      const res = await fetch('/api/super/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Usuario creado',
          message: `${data.nombre} ${data.apellido} fue creado correctamente`
        });
        setModalCrear(false);
        fetchUsuarios();
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: result.error || 'No se pudo crear el usuario'
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

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      const res = await fetch(`/api/super/usuarios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !activo }),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: activo ? 'Usuario desactivado' : 'Usuario activado',
          message: 'El cambio se realizó correctamente'
        });
        fetchUsuarios();
      } else {
        const result = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: result.error || 'No se pudo actualizar'
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

  const eliminarUsuario = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${nombre}?`)) return;

    try {
      const res = await fetch(`/api/super/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Usuario eliminado',
          message: `${nombre} fue eliminado correctamente`
        });
        fetchUsuarios();
      } else {
        const result = await res.json();
        showToast({
          type: 'error',
          title: 'Error',
          message: result.error || 'No se pudo eliminar'
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

  const usuariosFiltrados = usuarios;

  const stats = [
    {
      label: 'Total Usuarios',
      value: usuarios.length,
      color: '#3b82f6',
    },
    {
      label: 'Admins',
      value: usuarios.filter(u => u.rol === 'ADMIN').length,
      color: '#f59e0b',
    },
    {
      label: 'Clientes',
      value: usuarios.filter(u => u.rol === 'CLIENTE').length,
      color: '#22c55e',
    },
    {
      label: 'Inactivos',
      value: usuarios.filter(u => !u.activo).length,
      color: '#ef4444',
    },
  ];

  if (loading) {
    return <LoadingOverlay text="Cargando usuarios..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Usuarios</h1>
        <Button variant="primary" onClick={() => setModalCrear(true)}>
          + Nuevo Usuario
        </Button>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statValue} style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.filtros}>
        {['TODOS', 'SUPER', 'ADMIN', 'CLIENTE'].map(rol => (
          <button
            key={rol}
            className={`${styles.filtroBtn} ${filtroRol === rol ? styles.filtroActivo : ''}`}
            onClick={() => setFiltroRol(rol)}
          >
            {rol}
          </button>
        ))}
      </div>

      <div className={styles.tabla}>
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(usuario => (
              <tr key={usuario.id}>
                <td>
                  <div className={styles.usuarioInfo}>
                    <div className={styles.avatar}>
                      {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                    </div>
                    <div>
                      <div className={styles.nombreCompleto}>
                        {usuario.nombre} {usuario.apellido}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono || '-'}</td>
                <td>
                  <Badge 
                    variant={
                      usuario.rol === 'SUPER' ? 'error' : 
                      usuario.rol === 'ADMIN' ? 'warning' : 
                      'default'
                    }
                  >
                    {getRolNombre(usuario.rol)}
                  </Badge>
                </td>
                <td>
                  <Badge variant={usuario.activo ? 'success' : 'default'}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td>
                  <div className={styles.acciones}>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => toggleActivo(usuario.id, usuario.activo)}
                    >
                      {usuario.activo ? '❌' : '✅'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => eliminarUsuario(usuario.id, `${usuario.nombre} ${usuario.apellido}`)}
                    >
                      🗑️
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuariosFiltrados.length === 0 && (
          <div className={styles.empty}>
            <p>No hay usuarios con este filtro</p>
          </div>
        )}
      </div>

      {modalCrear && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Crear Usuario</h2>
            <form onSubmit={crearUsuario}>
              <div className={styles.formGroup}>
                <label>Email *</label>
                <input name="email" type="email" required />
              </div>
              <div className={styles.formGroup}>
                <label>Contraseña *</label>
                <input name="password" type="password" required minLength={6} />
              </div>
              <div className={styles.formGroup}>
                <label>Nombre *</label>
                <input name="nombre" type="text" required />
              </div>
              <div className={styles.formGroup}>
                <label>Apellido *</label>
                <input name="apellido" type="text" required />
              </div>
              <div className={styles.formGroup}>
                <label>Teléfono</label>
                <input name="telefono" type="text" />
              </div>
              <div className={styles.formGroup}>
                <label>Rol *</label>
                <select name="rol" required>
                  <option value="CLIENTE">Cliente</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER">Super</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setModalCrear(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" loading={guardando}>
                  Crear Usuario
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
