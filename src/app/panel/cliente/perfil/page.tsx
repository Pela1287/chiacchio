/* ============================================
   CHIACCHIO - Mi Perfil
   ============================================ */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Input, Card, useToast, LoadingOverlay } from '@/components/ui';
import styles from './page.module.css';

export default function PerfilPage() {
  const { data: session, status, update } = useSession();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
  });

  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchPerfil();
    }
  }, [session]);

  const fetchPerfil = async () => {
    try {
      const res = await fetch('/api/cliente/perfil');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          ciudad: data.ciudad || '',
        });
        if (data.avatar) {
          setAvatar(data.avatar);
        }
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast({
        type: 'error',
        title: 'Archivo muy grande',
        message: 'El archivo no puede superar los 2MB'
      });
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      
      try {
        const res = await fetch('/api/cliente/perfil', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: base64 }),
        });

        if (res.ok) {
          setAvatar(base64);
          showToast({
            type: 'success',
            title: 'Avatar actualizado',
            message: 'Tu foto de perfil se actualizó correctamente'
          });
        }
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'No se pudo actualizar el avatar'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/cliente/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Perfil actualizado',
          message: 'Tus datos se guardaron correctamente'
        });
        // Actualizar sesión
        if (update) {
          await update({ name: `${formData.nombre} ${formData.apellido}` });
        }
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'No se pudo actualizar el perfil'
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Error de conexión'
      });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingOverlay text="Cargando..." />;
  }

  const iniciales = `${formData.nombre?.charAt(0) || 'U'}${formData.apellido?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/panel/cliente" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver
        </Link>
        <h1 className={styles.title}>Mi Perfil</h1>
        <p className={styles.subtitle}>Editá tu información personal</p>
      </div>

      {/* Avatar */}
      <Card className={styles.avatarCard}>
        <div className={styles.avatarSection}>
          <div 
            className={styles.avatarWrapper}
            onClick={handleAvatarClick}
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>{iniciales}</div>
            )}
            <div className={styles.avatarOverlay}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>
          <div className={styles.avatarInfo}>
            <p className={styles.avatarTitle}>Foto de perfil</p>
            <p className={styles.avatarDesc}>JPG o PNG. Máximo 2MB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
      </Card>

      {/* Formulario */}
      <Card className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <h3 className={styles.sectionTitle}>Información Personal</h3>
          
          <div className={styles.formRow}>
            <Input
              label="Nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
            <Input
              label="Apellido"
              name="apellido"
              required
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Tu apellido"
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            disabled
            value={formData.email}
            onChange={handleChange}
            helperText="El email no puede modificarse"
          />

          <Input
            label="Teléfono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="+54 9 221 XXX XXXX"
          />

          <h3 className={styles.sectionTitle}>Ubicación</h3>

          <Input
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Calle, número, piso, depto"
          />

          <Input
            label="Ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            placeholder="La Plata, Buenos Aires..."
          />

          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Card>

      {/* Cambiar contraseña */}
      <Card className={styles.passwordCard}>
        <h3 className={styles.sectionTitle}>Seguridad</h3>
        <p className={styles.passwordDesc}>
          Para cambiar tu contraseña, contactanos por WhatsApp.
        </p>
        <a 
          href="https://wa.me/5492216011455?text=Hola!%20Quiero%20cambiar%20mi%20contraseña" 
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary">
            Contactar por WhatsApp
          </Button>
        </a>
      </Card>
    </div>
  );
}
