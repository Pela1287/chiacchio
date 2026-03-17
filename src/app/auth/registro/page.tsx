'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Input } from '@/components/ui';
import styles from '../login/page.module.css';
import regStyles from './registro.module.css';

type Step = 'form' | 'success';

export default function RegistroPage() {
  const [step, setStep] = useState<Step>('form');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '',
    telefono: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError('Nombre y apellido son obligatorios.');
      return;
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          email: form.email.trim().toLowerCase(),
          telefono: form.telefono.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrarse. Intentá nuevamente.');
        return;
      }

      setRegisteredEmail(form.email.trim().toLowerCase());
      setStep('success');
    } catch {
      setError('Error de conexión. Verificá tu internet e intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>
              <Image src="/logo-chiacchio.png" alt="Chiacchio" width={50} height={50} className={styles.logoImage} />
              <span>Chiacchio</span>
            </Link>
          </div>

          <div className={regStyles.successBox}>
            <div className={regStyles.successIcon}>✉️</div>
            <h2>¡Cuenta creada!</h2>
              <p>Tu usuario fue creado correctamente. Ya podés iniciar sesión.</p>
              <a href="/auth/login">Ir a iniciar sesión</a>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              ¿Ya verificaste tu email?{' '}
              <Link href="/auth/login" className={styles.footerLink}>Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo-chiacchio.png" alt="Chiacchio" width={50} height={50} className={styles.logoImage} />
            <span>Chiacchio</span>
          </Link>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.description}>Registrate para solicitar servicios eléctricos</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={regStyles.row}>
            <Input
              label="Nombre"
              type="text"
              required
              value={form.nombre}
              onChange={handleChange('nombre')}
              placeholder="Juan"
            />
            <Input
              label="Apellido"
              type="text"
              required
              value={form.apellido}
              onChange={handleChange('apellido')}
              placeholder="Pérez"
            />
          </div>

          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={handleChange('email')}
            placeholder="juan@email.com"
          />

          <Input
            label="Teléfono (opcional)"
            type="tel"
            value={form.telefono}
            onChange={handleChange('telefono')}
            placeholder="+54 221 123-4567"
          />

          <Input
            label="Contraseña"
            type="password"
            required
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Mínimo 8 caracteres"
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            required
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Repetí tu contraseña"
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" variant="primary" size="large" fullWidth loading={loading}>
            Crear cuenta
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            ¿Ya tenés cuenta?{' '}
            <Link href="/auth/login" className={styles.footerLink}>Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
