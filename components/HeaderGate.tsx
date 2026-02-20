'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import { isPublicPath } from '@/lib/isPublicPath';

export default function HeaderGate() {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const showHeader = currentPath.startsWith('/dashboard') && !isPublicPath(currentPath);

  if (!showHeader) return null;
  return <Header />;
}
