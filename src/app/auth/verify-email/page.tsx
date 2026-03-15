'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/page.module.css';

type Status = 'loading' | 'success' | 'error' | 'expired';

function VerifyEmailContent() {
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
      .catch(() => { setStatus('error'); setMessage('Error de conexion.'); });
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Verificacion de email</h1>
        </div>

        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ color: '#6b7280' }}>Verificando tu email...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
            <h2 style={{ color: '#111827', fontSize: '1.3rem', marginBottom: 12 }}>Email verificado!</h2>
            <p style={{ color: '#4b5563', marginBottom: 28 }}>Tu cuenta esta activa. Ya podes iniciar sesion.</p>
            <Link href="/auth/login" style={{ display: 'inline-block', background: '#1e3a5f', color: 'white', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Iniciar sesion
            </Link>
          </div>
        )}

        {status === 'expired' && (
          <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
            <h2 style={{ color: '#111827', fontSize: '1.3rem', marginBottom: 12 }}>Enlace expirado</h2>
            <p style={{ color: '#4b5563', marginBottom: 28 }}>El enlace de verificacion expiro. Registrate nuevamente.</p>
            <Link href="/auth/registro" style={{ display: 'inline-block', background: '#1e3a5f', color: 'white', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Volver a registrarse
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
            <h2 style={{ color: '#111827', fontSize: '1.3rem', marginBottom: 12 }}>Error de verificacion</h2>
            <p style={{ color: '#4b5563', marginBottom: 28 }}>{message || 'El enlace no es valido.'}</p>
            <Link href="/auth/login" style={{ display: 'inline-block', background: '#1e3a5f', color: 'white', padding: '12px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
              Ir al login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh'}}>Cargando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
