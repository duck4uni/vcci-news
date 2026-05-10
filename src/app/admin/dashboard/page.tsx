'use client';

import React from 'react';
import Link from 'next/link';
import { useGetNewsAdmin } from '@/api/endpoints/news';
import { useGetOrganizations } from '@/api/endpoints/organizations';
import { useGetContact } from '@/api/endpoints/contact';
import { useGetNewsPageConfigGetHierarchical } from '@/api/endpoints/news-page-config';
import { GetNewsResponseType } from '@/api/types/news';
import { GetNewsPageConfigResponseType } from '@/api/types/news-page-config';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight,
  BarChart3,
  Building2,
  FileText,
  Layers,
  Mail,
  Newspaper,
  Users,
} from 'lucide-react';

function extractCount(
  value: unknown,
): number | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const source = value as {
    responseData?: { count?: number };
    data?: { count?: number; responseData?: { count?: number } };
  };

  return (
    source.responseData?.count ??
    source.data?.responseData?.count ??
    source.data?.count
  );
}

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  icon: React.ReactNode;
  href: string;
  color: string;
  isLoading?: boolean;
}

function StatCard({ title, value, icon, href, color, isLoading }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              {isLoading ? (
                <Skeleton className="mt-2 h-8 w-20" />
              ) : (
                <p className="mt-1 text-3xl font-bold text-gray-900">{value ?? '—'}</p>
              )}
            </div>
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm ${color}`}
            >
              {icon}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-[#063e8e] opacity-0 transition-opacity group-hover:opacity-100">
            <span>Xem chi tiết</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { data: newsData, isLoading: newsLoading } =
    useGetNewsAdmin<GetNewsResponseType>({ pageSize: '1' });
  const { data: configData, isLoading: configLoading } =
    useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>();
  const { data: orgData, isLoading: orgLoading } = useGetOrganizations({ pageSize: '1' });
  const { data: contactData, isLoading: contactLoading } = useGetContact();

  const stats = [
    {
      title: 'Tổng bài viết',
      value: newsData?.responseData?.count,
      icon: <Newspaper className="h-7 w-7" />,
      href: '/admin/news',
      color: 'bg-[#063e8e]',
      isLoading: newsLoading,
    },
    {
      title: 'Cấu hình Danh mục',
      value: configData?.responseData ? 'Đã cấu hình' : '—',
      icon: <Layers className="h-7 w-7" />,
      href: '/admin/header-config',
      color: 'bg-violet-500',
      isLoading: configLoading,
    },
    {
      title: 'Hội viên',
      value: extractCount(orgData),
      icon: <Users className="h-7 w-7" />,
      href: '/admin/members',
      color: 'bg-orange-500',
      isLoading: orgLoading,
    },
    {
      title: 'Liên hệ / Email',
      value: extractCount(contactData),
      icon: <Mail className="h-7 w-7" />,
      href: '/admin/emails',
      color: 'bg-pink-500',
      isLoading: contactLoading,
    },
  ];

  const quickLinks = [
    { label: 'Thêm bài viết mới', href: '/admin/news/new', icon: <FileText className="h-4 w-4" /> },
    { label: 'Cấu hình menu Header', href: '/admin/header-config', icon: <Layers className="h-4 w-4" /> },
    { label: 'Quản lý Hội viên', href: '/admin/members', icon: <Users className="h-4 w-4" /> },
    { label: 'Đối tác', href: '/admin/partners', icon: <Building2 className="h-4 w-4" /> },
    { label: 'Thông tin website', href: '/admin/website-config', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Tổng quan hệ thống</h2>
          <p className="mt-1 text-sm font-medium text-gray-600">
            Chào mừng trở lại! Đây là tóm tắt hoạt động của VCCI News.
          </p>
        </div>
        <Badge variant="outline" className="border-[#063e8e]/30 text-[#063e8e]">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.href} {...item} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Truy cập nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-[#063e8e]/15 p-4 text-center text-sm text-gray-700 transition-all hover:border-[#063e8e]/40 hover:bg-[#063e8e]/5 hover:text-[#063e8e]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#063e8e]/10 text-[#063e8e]">
                  {item.icon}
                </div>
                <span className="text-xs font-medium leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
