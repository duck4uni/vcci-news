'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthGuard } from '@/components/shared/admin-auth-guard';
import { AdminSidebar } from '@/components/shared/admin-sidebar';
import { AdminHeader } from '@/components/shared/admin-header';
import { useSidebarStore } from '@/hooks/use-admin-sidebar';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AdminAuthGuard>
      {isLoginPage ? (
        <div className="min-h-screen bg-slate-50">{children}</div>
      ) : (
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
      )}
    </AdminAuthGuard>
  );
}
