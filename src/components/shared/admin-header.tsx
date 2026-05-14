'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Menu, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { deleteAuthLogout } from '@/api/endpoints/auth';
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

export function AdminHeader() {
  const { toggle } = useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();
  const title = getTitle(pathname);
  const resetStore = useAuthStore((state) => state.resetStore);

  const handleLogout = async () => {
    try {
      await deleteAuthLogout();
    } catch {
      // Ignore API logout failure and continue clearing local state.
    } finally {
      resetStore();
      toast.success('Đã đăng xuất khỏi trang quản trị');
      router.replace('/admin/login');
    }
  };

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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#063e8e]/10 bg-[#f8fbff] px-3 py-1.5 text-sm font-medium text-[#163b73]">
            <ShieldCheck className="h-4 w-4 text-[#063e8e]" />
            <span>{currentUserRoleLabel}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-[#063e8e]/15 text-[#063e8e]"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
}
