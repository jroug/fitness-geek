'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import { isPublicPath } from '@/lib/isPublicPath';

export default function HeaderGate() {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const showHeader = currentPath.startsWith('/dashboard') && !isPublicPath(currentPath);

  useEffect(() => {
    if (!showHeader) {
      document.documentElement.classList.remove('dashboard-dark');
      document.body.classList.remove('dashboard-dark');
    }
  }, [showHeader]);

  if (!showHeader) return null;
  return <Header />;
}
