import { ReactNode } from 'react';
import DashboardChatbox from '@/components/DashboardChatbox';

interface DashboardTemplateProps {
  children: ReactNode;
}

export default function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <>
      {children}
      <DashboardChatbox />
    </>
  );
}
