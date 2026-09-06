'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutAdmin } from '@/lib/auth/admin-auth';
import { useSidebarStore } from '@/hooks/use-admin-sidebar';
import useAuthStore from '@/store/useAuthStore';

const routeLabels: Record<string, string> = {
  '/admin/base-config': 'Cấu hình chung',
  '/admin/header-config': 'Cấu hình danh mục',
  '/admin/news': 'Quản lý bài viết',
  '/admin/tags': 'Quản lý tag tìm kiếm',
  '/admin/media': 'Quản lý ảnh',
  '/admin/videos': 'Quản lý video',
  '/admin/contact-management': 'Quản lý liên hệ',
  '/admin/contact-management/newsletter-emails': 'Quản lý Email đăng ký nhận thông tin',
  '/admin/contact-management/contact-requests': 'Quản lý Đơn liên hệ',
  '/admin/contact-management/membership-applications': 'Quản lý Đơn đăng ký hội viên',
  '/admin/members': 'Danh sách hội viên',
  '/admin/members/fields': 'Quản lý lĩnh vực',
  '/admin/members/regions': 'Quản lý khu vực',
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

function formatPrimaryRole(role?: string) {
  if (!role) return currentUserRoleLabel;

  return role
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatRoles(roles?: string[]) {
  if (!roles || roles.length === 0) return currentUserRoleLabel;

  return roles.map((role) => formatPrimaryRole(role)).join(', ');
}

export function AdminHeader() {
  const { toggle } = useSidebarStore();
  const pathname = usePathname();
  const title = getTitle(pathname);
  const currentUser = useAuthStore((state) => state.appUser);

  const handleLogout = async () => {
    await logoutAdmin({ redirectToLogin: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#063e8e]/15 bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex min-h-16 items-center justify-between gap-3 px-3 py-2 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="text-[#063e8e]"
            title="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="truncate text-base font-bold text-[#063e8e] sm:text-xl">{title}</h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[#063e8e]/10 bg-[#f8fbff] px-3 py-1.5 text-sm font-medium text-[#163b73] sm:flex">
            <ShieldCheck className="h-4 w-4 text-[#063e8e]" />
            <span>{formatRoles(currentUser?.roles)}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-[#063e8e]/15 text-[#063e8e]"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
