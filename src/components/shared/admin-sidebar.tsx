"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Globe,
  ImagePlus,
  Layers,
  Mail,
  Megaphone,
  Newspaper,
  Settings,
  Sparkles,
  Tags,
  UserCog,
  Shield,
  KeyRound,
  Video,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useGetApiV10Logo } from "@/api/endpoints/logo";
import type { Logo } from "@/api/models/logo";
import logo from "@/assets/VCCI-HCM-logo-VN-2025.png";
import { resolveUploadUrl } from "@/links";
import { useSidebarStore } from "@/hooks/use-admin-sidebar";
import { usePermission } from "@/hooks/usePermission";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";

type LogoListEnvelope = {
  data?: {
    responseData?: {
      rows?: Logo[];
    };
  };
};

type NavChild = { name: string; href: string; permission?: string };
type NavItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavChild[];
  permission?: string;
};

// Navigation với permissions
const navigation: NavItem[] = [
  {
    name: "Cấu hình chung",
    href: "/admin/base-config",
    icon: Settings,
    permission: "settings:read",
  },
  {
    name: "Cấu hình danh mục",
    href: "/admin/header-config",
    icon: Layers,
    permission: "categories:read",
  },
  {
    name: "Quản lý bài viết",
    href: "/admin/news",
    icon: Newspaper,
    permission: "posts:read",
  },
  {
    name: "Quản lý tag tìm kiếm",
    href: "/admin/tags",
    icon: Tags,
    permission: "tags:read",
  },
  {
    name: "Quản lý video",
    href: "/admin/videos",
    icon: Video,
    permission: "videos:read",
  },
  {
    name: "Quản lý Email đăng ký",
    href: "/admin/contact-management/newsletter-emails",
    icon: Mail,
    permission: "newsletter:read",
  },
  { name: "Quản lý ảnh", href: "/admin/media", icon: ImagePlus, permission: "files:read" },
  {
    name: "Quản lý quảng cáo",
    href: "/admin/advertisements",
    icon: Megaphone,
    permission: "advertisements:read",
  },
];

// Admin system menu - chỉ system_admin thấy
const adminSystemMenu: NavItem[] = [
  {
    name: "Quản lý vai trò",
    href: "/admin/roles",
    icon: Shield,
    permission: "roles:read",
  },
  {
    name: "Quản lý người dùng",
    href: "/admin/users",
    icon: UserCog,
    permission: "users:read",
  },
  {
    name: "Yêu cầu reset MK",
    href: "/admin/password-reset-requests",
    icon: KeyRound,
    permission: "users:read",
  },
];

const membersReservedSegments = new Set(["fields", "regions"]);

export function AdminSidebar() {
  const pathname = usePathname();
  const { close, isOpen } = useSidebarStore();
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({});
  const userPermissions = useAuthStore((state) => state.appUser?.permissions) || [];
  const userRoles = useAuthStore((state) => state.appUser?.roles) || [];

  const { data: logoData } = useGetApiV10Logo(
    {
      page: 1,
      pageSize: 1,
      sortField: "updated_at",
      sortOrder: "desc",
    },
    {
      query: {
        select: (response: unknown) => {
          const responseData = (response as LogoListEnvelope)?.data?.responseData;
          return responseData?.rows?.[0] ?? null;
        },
      },
    }
  );

  // Helper function để kiểm tra permission
  const hasPermission = React.useCallback(
    (permission: string | undefined) => {
      if (!permission) return true;
      return userPermissions.includes(permission);
    },
    [userPermissions]
  );

  const isItemActive = React.useCallback(
    (href: string) => {
      if (href === "/admin/members") {
        if (pathname === href) return true;
        if (!pathname.startsWith(`${href}/`)) return false;

        const nextSegment = pathname.slice(`${href}/`.length).split("/")[0];
        return Boolean(nextSegment) && !membersReservedSegments.has(nextSegment);
      }

      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  const isGroupActive = (children: NavChild[]) =>
    children.some((child) => isItemActive(child.href));

  const toggleGroup = (name: string) =>
    setExpandedGroups((previous) => ({ ...previous, [name]: !previous[name] }));

  const handleMobileNavigate = () => {
    if (window.innerWidth < 1024) close();
  };

  // Filter navigation items based on permissions
  const filteredNavigation = navigation.filter((item) => hasPermission(item.permission));

  // Filter admin system menu based on permissions
  const filteredAdminMenu = adminSystemMenu.filter((item) => hasPermission(item.permission));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-dvh border-r border-[#063e8e]/10 bg-gradient-to-b from-[#f6f9ff] via-[#edf4ff] to-[#f8fbff] shadow-[0_18px_45px_rgba(6,62,142,0.08)] transition-all duration-300",
        isOpen ? "w-72 translate-x-0 lg:w-72" : "-translate-x-full lg:w-24 lg:translate-x-0"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo Header */}
        <div className={cn("px-4 pb-4 pt-5", !isOpen && "px-3")}>
          <Link
            href="/admin"
            onClick={handleMobileNavigate}
            className={cn(
              "flex items-center backdrop-blur-sm",
              isOpen
                ? "gap-4 rounded-[28px] border border-white/80 bg-white/95 px-4 py-4 shadow-[0_14px_32px_rgba(6,62,142,0.08)]"
                : "justify-center px-0 py-4"
            )}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#063e8e]/10 bg-[#f8fbff] shadow-sm">
              <Image
                src={logoData?.logo_url ? resolveUploadUrl(logoData.logo_url) : logo}
                alt={logoData?.logo_name || "VCCI HCM"}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                priority
              />
            </div>

            {isOpen ? (
              <div className="min-w-0">
                <div className="truncate text-[13px] font-bold uppercase tracking-[0.22em] text-[#063e8e]">
                  {logoData?.logo_name || "VCCI News"}
                </div>
                <div className="mt-1 text-sm leading-5 text-slate-600">
                  Trang quản trị website
                </div>
              </div>
            ) : null}
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="px-4 pb-2">
          {isOpen ? (
            <div className="flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-[#063e8e]" />
              Điều hướng quản trị
            </div>
          ) : null}
        </div>

        <nav
          className={cn(
            "scrollbar flex-1 space-y-3 overflow-y-auto px-4 pb-5 pt-2",
            !isOpen && "px-3"
          )}
        >
          {filteredNavigation.map((item) => {
            if (item.children) {
              const active = isGroupActive(item.children);
              const expanded = expandedGroups[item.name] ?? false;

              return (
                <div
                  key={item.name}
                  className={cn(
                    "rounded-[26px] border border-transparent transition-all duration-200",
                    isOpen && expanded && "border-[#063e8e]/10 bg-white/70 p-2 shadow-sm"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => isOpen && toggleGroup(item.name)}
                    title={!isOpen ? item.name : undefined}
                    className={cn(
                      "flex w-full items-center rounded-2xl text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-[#063e8e] text-white shadow-[0_12px_24px_rgba(6,62,142,0.18)]"
                        : "text-slate-700 hover:bg-white/85 hover:text-[#063e8e]",
                      isOpen ? "gap-3 px-4 py-3.5" : "mx-auto h-14 w-14 justify-center p-0"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {isOpen ? (
                      <>
                        <span className="min-w-0 flex-1 text-left">{item.name}</span>
                        <ChevronDown
                          className={cn("h-4 w-4 shrink-0 transition-transform", expanded && "rotate-180")}
                        />
                      </>
                    ) : null}
                  </button>

                  {isOpen && expanded ? (
                    <div className="mt-2 space-y-1.5 border-l border-[#d5e1f7] pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={handleMobileNavigate}
                          className={cn(
                            "group relative flex rounded-2xl px-4 py-3 text-sm leading-6 transition-all",
                            isItemActive(child.href)
                              ? "bg-[#dbe8ff] font-semibold text-[#063e8e]"
                              : "text-slate-600 hover:bg-[#eef4ff] hover:text-[#063e8e]"
                          )}
                        >
                          <span className="block">{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            const active = item.href ? isItemActive(item.href) : false;

            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                onClick={handleMobileNavigate}
                title={!isOpen ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-2xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[#063e8e] text-white shadow-[0_12px_24px_rgba(6,62,142,0.18)]"
                    : "text-slate-700 hover:bg-white/85 hover:text-[#063e8e]",
                  isOpen ? "gap-3 px-4 py-3.5" : "mx-auto h-14 w-14 justify-center p-0"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isOpen ? <span className="min-w-0 flex-1">{item.name}</span> : null}
              </Link>
            );
          })}

          {/* Admin System Menu - Chỉ system_admin thấy */}
          {filteredAdminMenu.length > 0 && (
            <>
              <div className="border-t border-[#063e8e]/10 pt-3" />
              {isOpen ? (
                <div className="flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#063e8e]">
                  <Shield className="h-3.5 w-3.5" />
                  Quản trị hệ thống
                </div>
              ) : null}

              {filteredAdminMenu.map((item) => {
                const active = item.href ? isItemActive(item.href) : false;

                return (
                  <Link
                    key={item.name}
                    href={item.href || "#"}
                    onClick={handleMobileNavigate}
                    title={!isOpen ? item.name : undefined}
                    className={cn(
                      "flex items-center rounded-2xl text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-[#063e8e] text-white shadow-[0_12px_24px_rgba(6,62,142,0.18)]"
                        : "text-slate-700 hover:bg-white/85 hover:text-[#063e8e]",
                      isOpen ? "gap-3 px-4 py-3.5" : "mx-auto h-14 w-14 justify-center p-0"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {isOpen ? <span className="min-w-0 flex-1">{item.name}</span> : null}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-5 pt-3">
          {isOpen ? (
            <div className="rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-[0_14px_32px_rgba(6,62,142,0.08)]">
              <Link
                href="/"
                onClick={handleMobileNavigate}
                className="flex items-center gap-3 text-sm font-semibold text-[#063e8e] transition hover:opacity-80"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#063e8e]">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <div>Về trang chủ</div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500">Website công khai</div>
                </div>
              </Link>
              <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                © 2026 VCCI HCM
              </div>
            </div>
          ) : (
            <Link
              href="/"
              onClick={handleMobileNavigate}
              title="Về trang chủ"
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-[22px] border border-white/80 bg-white/95 text-[#063e8e] shadow-sm transition hover:bg-white"
            >
              <Globe className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
