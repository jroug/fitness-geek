'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import { isPublicPath } from '@/lib/isPublicPath';

export default function HeaderGate() {
  const pathname = usePathname();
  const showHeader = !isPublicPath(pathname || '');

  if (!showHeader) return null;
  return <Header />;
}
