// ============================================
// CHIACCHIO - Login
// ============================================

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Input } from '@/components/ui';
import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/panel',
      });

      // Si llega aquí con error
      if (result?.error) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Chiacchio"
              width={50}
              height={50}
              className={styles.logoImage}
            />
            <span>Chiacchio</span>
          </Link>
          <h1 className={styles.title}>Iniciar Sesión</h1>
          <p className={styles.description}>
            Accede a tu panel para gestionar tus servicios
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />

          <Input
            label="Contraseña"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <p className={styles.error}>{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Ingresar
          </Button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerText}>Usuarios de prueba</span>
        </div>

        <div className={styles.testAccounts}>
          <div className={styles.testAccount}>
            <span className={styles.testRole}>Super Usuario</span>
            <span className={styles.testCreds}>super@chiacchio.com / admin123</span>
          </div>
          <div className={styles.testAccount}>
            <span className={styles.testRole}>Administrador</span>
            <span className={styles.testCreds}>admin@chiacchio.com / admin123</span>
          </div>
          <div className={styles.testAccount}>
            <span className={styles.testRole}>Cliente</span>
            <span className={styles.testCreds}>juan.perez@email.com / cliente123</span>
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            ¿No tienes cuenta?{' '}
            <Link href="/auth/registro" className={styles.footerLink}>
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
