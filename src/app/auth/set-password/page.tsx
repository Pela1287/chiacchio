'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/page.module.css';

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) { setTokenValid(false); return; }
    fetch(`/api/auth/set-password?token=${token}`)
      .then(r => r.json())
      .then(d => setTokenValid(d.valid === true))
      .catch(() => setTokenValid(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('La contrasena debe tener al menos 6 caracteres'); return; }
    if (password !== confirm) { setError('Las contrasenas no coinciden'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/auth/login?welcome=1'), 2500);
      } else {
        setError(data.error || 'Error al establecer la contrasena');
      }
    } catch {
      setError('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p style={{ textAlign: 'center', color: '#666' }}>Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title} style={{ color: '#ef4444' }}>Enlace invalido</h1>
          </div>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
            El enlace expiro o ya fue utilizado. Contacta a tu administrador.
          </p>
          <Link href="/auth/login" style={{ display: 'block', textAlign: 'center', color: '#16a34a' }}>
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title} style={{ color: '#16a34a' }}>Contrasena establecida!</h1>
          </div>
          <p style={{ textAlign: 'center', color: '#666' }}>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Establece tu contrasena</h1>
          <p className={styles.subtitle}>Elige una contrasena para acceder a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nueva contrasena</label>
            <input type="password" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimo 6 caracteres" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirma la contrasena</label>
            <input type="password" className={styles.input} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite la contrasena" required />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Guardando...' : 'Establecer contrasena'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh'}}>Cargando...</div>}>
      <SetPasswordContent />
    </Suspense>
  );
}
