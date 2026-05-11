'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Globe,
  Layers,
  Newspaper,
  Users,
  Video,
} from 'lucide-react';
import logo from '@/assets/VCCI-HCM-logo-VN-2025.png';
import { useSidebarStore } from '@/hooks/use-admin-sidebar';
import { cn } from '@/lib/utils';

type NavChild = { name: string; href: string };
type NavItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavChild[];
};

const navigation: NavItem[] = [
  { name: 'Cấu hình danh mục', href: '/admin/header-config', icon: Layers },
  { name: 'Quản lý bài viết', href: '/admin/news', icon: Newspaper },
  { name: 'Quản lý video', href: '/admin/videos', icon: Video },
  {
    name: 'Quản lý hội viên',
    icon: Users,
    children: [
      { name: 'Danh sách hội viên', href: '/admin/members' },
      { name: 'Quản lý lĩnh vực', href: '/admin/members/fields' },
      { name: 'Quản lý khu vực', href: '/admin/members/regions' },
    ],
  },
];

const membersReservedSegments = new Set(['fields', 'regions']);

export function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({
    'Quản lý hội viên': true,
  });

  const isItemActive = React.useCallback(
    (href: string) => {
      if (href === '/admin/members') {
        if (pathname === href) return true;
        if (!pathname.startsWith(`${href}/`)) return false;

        const nextSegment = pathname.slice(`${href}/`.length).split('/')[0];
        return Boolean(nextSegment) && !membersReservedSegments.has(nextSegment);
      }

      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  const isGroupActive = (children: NavChild[]) => children.some((child) => isItemActive(child.href));

  const toggleGroup = (name: string) =>
    setExpandedGroups((previous) => ({ ...previous, [name]: !previous[name] }));

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-[#063e8e]/15 bg-[#063e8e]/20 shadow-[0_10px_30px_rgba(6,62,142,0.08)] transition-all duration-300',
        isOpen ? 'w-56' : 'w-20',
      )}
    >
      <div className="flex h-full flex-col">
        <div
          className={cn(
            'flex h-16 items-center border-b border-[#063e8e]/12 bg-white/80 px-4 backdrop-blur-sm',
            !isOpen && 'justify-center px-2.5',
          )}
        >
          <Link
            href="/admin/dashboard"
            className={cn('flex min-w-0 items-center gap-3', isOpen && 'justify-start')}
          >
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#063e8e]/12 bg-white p-1.5 shadow-sm',
                !isOpen && 'h-10 w-10',
              )}
            >
              <Image
                src={logo}
                alt="VCCI HCM"
                className="h-full w-full object-contain"
                priority
              />
            </div>
            {isOpen ? (
              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-[#063e8e]">
                  VCCI News
                </div>
                <div className="mt-1 truncate text-[11px] text-gray-700">
                  Trang quản trị website
                </div>
              </div>
            ) : null}
          </Link>
        </div>

        <nav className={cn('flex-1 space-y-2 overflow-y-auto px-3 py-4', !isOpen && 'px-2')}>
          {navigation.map((item) => {
            if (item.children) {
              const active = isGroupActive(item.children);
              const expanded = expandedGroups[item.name] ?? active;

              return (
                <div key={item.name} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => isOpen && toggleGroup(item.name)}
                    className={cn(
                      'group flex w-full items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-[#063e8e] text-white shadow-[0_12px_24px_rgba(6,62,142,0.16)]'
                        : 'text-gray-700 hover:bg-[#063e8e]/8 hover:text-[#063e8e]',
                      !isOpen && 'justify-center px-0',
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {isOpen ? (
                      <>
                        <span className="ml-3 truncate text-left">{item.name}</span>
                        <ChevronDown
                          className={cn('ml-auto h-4 w-4 transition-transform', expanded && 'rotate-180')}
                        />
                      </>
                    ) : null}
                  </button>

                  {isOpen && expanded ? (
                    <div className="ml-4 space-y-1.5 border-l border-[#063e8e]/12 pl-4">
                      {item.children.map((child) => {
                        const childActive = isItemActive(child.href);

                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'block rounded-xl px-3 py-2.5 text-sm transition-colors',
                              childActive
                                ? 'bg-[#063e8e]/10 font-semibold text-[#063e8e]'
                                : 'text-gray-700 hover:bg-[#063e8e]/6 hover:text-[#063e8e]',
                            )}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            }

            const active = item.href ? isItemActive(item.href) : false;

            return (
              <Link
                key={item.name}
                href={item.href || '#'}
                title={!isOpen ? item.name : undefined}
                className={cn(
                  'group flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-[#063e8e] text-white shadow-[0_12px_24px_rgba(6,62,142,0.16)]'
                    : 'text-gray-700 hover:bg-[#063e8e]/8 hover:text-[#063e8e]',
                  !isOpen && 'justify-center px-0',
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isOpen ? <span className="ml-3 truncate">{item.name}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#063e8e]/12 bg-white/40 px-4 py-4 backdrop-blur-sm">
          {isOpen ? (
            <div className="rounded-2xl border border-[#063e8e]/10 bg-white px-4 py-3 shadow-sm">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-[#063e8e] hover:underline"
              >
                <Globe className="h-4 w-4" />
                Về trang chủ
              </Link>
              <div className="mt-2 text-xs leading-5 text-gray-700">© 2026 VCCI HCM</div>
            </div>
          ) : (
            <Link
              href="/"
              title="Về trang chủ"
              className="flex justify-center rounded-2xl border border-[#063e8e]/10 bg-white py-3 text-[#063e8e] shadow-sm"
            >
              <Globe className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
