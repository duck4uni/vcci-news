'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  AdminAuthLoadingScreen,
  useAdminAuthStatus,
} from '@/components/shared/admin-auth-guard';
import { AdminSidebar } from '@/components/shared/admin-sidebar';
import { AdminHeader } from '@/components/shared/admin-header';
import { useSidebarStore } from '@/hooks/use-admin-sidebar';
import { cn } from '@/lib/utils';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar />
      <div
        className={cn(
          'transition-all duration-300',
          isOpen ? 'pl-72' : 'pl-24',
        )}
      >
        <AdminHeader />
        <main className="px-4 py-4 lg:px-6 lg:py-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const authStatus = useAdminAuthStatus();

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  if (authStatus === 'loading') {
    return <AdminAuthLoadingScreen />;
  }

  if (authStatus === 'blocked') {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}
