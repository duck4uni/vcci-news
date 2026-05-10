'use client';

import React, { useState } from 'react';
import {
  useGetOrganizations,
  getGetOrganizationsQueryKey,
} from '@/api/endpoints/organizations';
import { useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useGetOrganizations({
    currentPage: String(page),
    pageSize: String(pageSize),
    filters: search ? `name@=${search}` : undefined,
  });

  const rows = (data as any)?.responseData?.rows ?? (data as any)?.data?.rows ?? [];
  const total = (data as any)?.responseData?.count ?? (data as any)?.data?.count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quản lý Hội viên</h2>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách tất cả tổ chức / doanh nghiệp hội viên.
          </p>
        </div>
        <Badge variant="outline" className="border-[#063e8e]/30 text-[#063e8e] text-sm px-3 py-1">
          {total} hội viên
        </Badge>
      </div>

      <div className="relative w-72 mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-9"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Tên tổ chức</TableHead>
              <TableHead>Mã số thuế</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead className="w-24">Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-10 text-sm">
                  Chưa có hội viên nào.
                </TableCell>
              </TableRow>
            ) : rows.map((org: any, idx: number) => (
              <TableRow key={org.id ?? idx}>
                <TableCell className="text-gray-400 text-sm">{(page - 1) * pageSize + idx + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={org.avatar} alt={org.name} />
                      <AvatarFallback className="bg-[#063e8e]/10 text-[#063e8e] text-xs font-bold">
                        {org.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate max-w-[200px]">{org.name}</p>
                      {org.website && (
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                        >
                          <ExternalLink size={10} />{org.website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{org.tax_code || '—'}</TableCell>
                <TableCell className="text-sm text-gray-600">{org.org_email || '—'}</TableCell>
                <TableCell className="text-sm text-gray-500 max-w-40 truncate">{org.address || '—'}</TableCell>
                <TableCell>
                  {org.is_premium ? (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-xs">Premium</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 text-xs">Thường</Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {org.created_at ? dayjs(org.created_at).format('DD/MM/YYYY') : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Trước</Button>
          <span className="text-sm text-gray-500 self-center">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Sau</Button>
        </div>
      )}
    </div>
  );
}
