/* ============================================
   CHIACCHIO - Panel Principal
   ============================================ */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from '@/components/ui';

export default function PanelPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (mounted && status === 'authenticated' && session?.user) {
      // Redirigir según el rol
      const role = (session.user as any)?.role || (session.user as any)?.rol;
      if (role === 'SUPER') {
        router.push('/panel/super');
      } else if (role === 'ADMIN') {
        router.push('/panel/admin');
      } else {
        router.push('/panel/cliente');
      }
    }
  }, [mounted, status, session, router]);

  if (!mounted || status === 'loading') {
    return <LoadingOverlay text="Cargando..." />;
  }

  return <LoadingOverlay text="Redirigiendo..." />;
}
