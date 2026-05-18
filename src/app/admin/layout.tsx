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
  const { close, isOpen } = useSidebarStore();

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const syncSidebar = () => {
      if (mediaQuery.matches) close();
    };

    syncSidebar();
    mediaQuery.addEventListener('change', syncSidebar);

    return () => mediaQuery.removeEventListener('change', syncSidebar);
  }, [close]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <AdminSidebar />
      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[1px] lg:hidden"
          onClick={close}
        />
      ) : null}
      <div
        className={cn(
          'min-w-0 transition-all duration-300',
          isOpen ? 'lg:pl-72' : 'lg:pl-24',
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
