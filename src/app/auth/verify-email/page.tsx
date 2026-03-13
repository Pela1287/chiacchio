'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/page.module.css';

type Status = 'loading' | 'success' | 'error' | 'expired';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); setMessage('Token no encontrado.'); return; }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.redirected || res.ok) {
          setStatus('success');
        } else {
          const data = await res.json().catch(() => ({}));
          if (data.expired) { setStatus('expired'); }
          else { setStatus('error'); setMessage(data.error || 'Error al verificar.'); }
        }
      })
      .catch(() => { setStatus('error'); setMessage('Error de conexión.'); });
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Verificación de email</h1>
        </div>

        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#1e3a5f', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280' }}>Verificando tu email...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h2 style={{ color: '#111827', fontSize: '1.3rem', marginBottom: 12 }}>¡Email verificado!</h2>
            <p style={{ color: '#4b5563', marginBottom: 28 }}>Tu cuenta está activa. Ya podés iniciar sesión.</p>
            <Link href="/auth/login" style={{ display: 'inline-block', background: '#1e3a5f', color: 'white', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Iniciar sesión
            </Link>
          </div>
        )}

        {status === 'expired' && (
          <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏰</div>
            <h2 style={{ color: '#111827', fontSize: '1.3rem', marginBottom: 12 }}>Enlace expirado</h2>
            <p style={{ color: '#4b5563', marginBottom: 28 }}>El enlace de verificación expiró. Registrate nuevamente para recibir uno nuevo.</p>
            <Link href="/auth/registro" style={{ display: 'inline-block', background: '#1e3a5f', color: 'white', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Volver a registrarse
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>❌</div>
            <h2 style={{ color: '#111827', fontSize: '1.3rem', marginBottom: 12 }}>Error de verificación</h2>
            <p style={{ color: '#4b5563', marginBottom: 28 }}>{message || 'El enlace no es válido.'}</p>
            <Link href="/auth/login" style={{ display: 'inline-block', background: '#1e3a5f', color: 'white', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Ir al login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
