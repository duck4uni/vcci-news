'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/hooks/use-admin-sidebar';

const routeLabels: Record<string, string> = {
  '/admin/base-config': 'Cấu hình chung',
  '/admin/header-config': 'Cấu hình danh mục',
  '/admin/news': 'Quản lý bài viết',
  '/admin/media': 'Quản lý ảnh',
  '/admin/videos': 'Quản lý video',
  '/admin/contact-management': 'Quản lý liên hệ',
  '/admin/contact-management/newsletter-emails': 'Quản lý Email đăng ký nhận thông tin',
  '/admin/contact-management/contact-requests': 'Quản lý Đơn liên hệ',
  '/admin/contact-management/membership-applications': 'Quản lý Đơn đăng ký hội viên',
  '/admin/members': 'Quản lý Hội viên',
  '/admin/partners': 'Quản lý Đối tác',
  '/admin/emails': 'Email nhận thông tin',
  '/admin/website-config': 'Thông tin website',
};

const currentUserRoleLabel = 'Quản trị viên';

function getTitle(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname];

  for (const [prefix, label] of Object.entries(routeLabels)) {
    if (pathname.startsWith(`${prefix}/`)) return label;
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

        <div className="flex items-center gap-2 rounded-full border border-[#063e8e]/10 bg-[#f8fbff] px-3 py-1.5 text-sm font-medium text-[#163b73]">
          <ShieldCheck className="h-4 w-4 text-[#063e8e]" />
          <span>{currentUserRoleLabel}</span>
        </div>
      </div>
    </header>
  );
}
