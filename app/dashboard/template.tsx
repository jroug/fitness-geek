import { ReactNode } from 'react';
import DashboardChatboxDummy from '@/components/DashboardChatboxDummy';

interface DashboardTemplateProps {
  children: ReactNode;
}

export default function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <>
      {children}
      <DashboardChatboxDummy />
    </>
  );
}
