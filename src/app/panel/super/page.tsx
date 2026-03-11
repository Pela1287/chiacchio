'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/panel/super/dashboard');
  }, [router]);
  return null;
}
