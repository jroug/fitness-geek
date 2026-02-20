'use client';

import { usePathname } from 'next/navigation';
import SideBar from '@/components/SideBar';
import { isPublicPath } from '@/lib/isPublicPath';

export default function SidebarGate() {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const showSidebar = currentPath.startsWith('/dashboard') && !isPublicPath(currentPath);

  if (!showSidebar) return null;
  return <SideBar />;
}
