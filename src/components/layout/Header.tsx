/* ============================================
   CHIACCHIO - Componente Header
   ============================================ */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './Header.module.css';

interface NavLink {
  href: string;
  label: string;
}

const publicNavLinks: NavLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/quienes-somos', label: 'Quiénes Somos' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isPanel = pathname?.startsWith('/panel');

  if (isPanel && status === 'authenticated') {
    return <PanelHeader session={session} />;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Chiacchio"
              width={60}
              height={60}
              className={styles.logoImage}
            />
            <span className={styles.logoText}>Chiacchio</span>
          </Link>

          <nav className={styles.nav}>
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.right}>
          <Link
            href="/auth/login"
            className={styles.ctaButton}
          >
            Ingresar
          </Link>
        </div>
      </div>
    </header>
  );
}

function PanelHeader({ session }: { session: any }) {
  const rol = session?.user?.role;
  const rolNombre = rol === 'SUPER' ? 'Super Usuario' : rol === 'ADMIN' ? 'Administrador' : 'Cliente';
  const nombre = session?.user?.name?.split(' ')[0] || 'Usuario';

  return (
    <header className={`${styles.header} ${styles.panelHeader}`}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/panel" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Chiacchio"
              width={55}
              height={55}
              className={styles.logoImage}
            />
            <span className={styles.logoText}>Chiacchio</span>
          </Link>
        </div>

        <div className={styles.right}>
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <p className={styles.userName}>Hola, {nombre}</p>
              <p className={styles.userRole}>{rolNombre}</p>
            </div>
            <div className={styles.avatar}>
              {nombre.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <button 
            className={styles.logoutButton}
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Cerrar sesión"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
