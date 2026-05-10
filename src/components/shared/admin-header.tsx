'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/hooks/use-admin-sidebar';
import { Menu } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/header-config': 'Cấu hình Danh mục',
  '/admin/news': 'Quản lý bài viết',
  '/admin/members': 'Quản lý Hội viên',
  '/admin/partners': 'Quản lý Đối tác',
  '/admin/emails': 'Email nhận thông tin',
  '/admin/website-config': 'Thông tin website',
};

function getTitle(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname];

  for (const [prefix, label] of Object.entries(routeLabels)) {
    if (pathname.startsWith(prefix + '/')) return label;
  }

  return 'Quản trị';
}

export function AdminHeader() {
  const { toggle } = useSidebarStore();
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-[#063e8e]/15 bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="text-[#063e8e]"
            title="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-[#063e8e]">{title}</h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>
    </header>
  );
}
