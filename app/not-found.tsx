'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NotFoundPage from './NotFoundPage';
import PublicHeader from '@/components/PublicHeader';

export default function NotFound() {
  const pathname = usePathname() || '';
  const router = useRouter();

  const isDashboardPath = pathname.startsWith('/dashboard');

  useEffect(() => {
    if (isDashboardPath) {
      router.replace('/dashboard');
    }
  }, [isDashboardPath, router]);

  if (isDashboardPath) return null;

  return (
    <>
      <PublicHeader />
      <NotFoundPage />
    </>
  );
}
