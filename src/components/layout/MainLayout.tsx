/* ============================================
   CHIACCHIO - Layout Principal
   ============================================ */

'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore, useUIStore } from '@/lib/store';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { ChatWidget } from '@/components/chat/ChatWidget';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const { isAutenticado } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  
  const isPanel = pathname?.startsWith('/panel') && isAutenticado;

  if (isPanel) {
    return (
      <div className={styles.layout}>
        <Header />
        <div className={styles.panelLayout}>
          <Sidebar />
          <main className={`${styles.panelContent} ${!sidebarOpen ? styles.sidebarCollapsed : ''}`}>
            <div className={styles.pageContainer}>
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className={styles.pageTitle}>{title}</h1>
          {description && <p className={styles.pageDescription}>{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}

export default MainLayout;
