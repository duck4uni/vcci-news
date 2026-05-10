'use client';

import React, { useState } from 'react';
import { useGetContact } from '@/api/endpoints/contact';
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
import { Search, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';

export default function EmailsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useGetContact({} as any);

  const allRows = (data as any)?.responseData?.rows ?? (data as any)?.data?.rows ?? [];
  const filtered = search
    ? allRows.filter(
        (r: any) =>
          r.email?.includes(search) ||
          r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          r.organization_name?.toLowerCase().includes(search.toLowerCase()),
      )
    : allRows;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quản lý Email nhận thông tin</h2>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách các địa chỉ email / liên hệ nhận thông tin từ VCCI.
          </p>
        </div>
        <Badge variant="outline" className="border-pink-300 text-pink-600 text-sm px-3 py-1">
          <Mail className="h-3.5 w-3.5 mr-1" />
          {total} email
        </Badge>
      </div>

      <div className="relative w-72 mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-9"
          placeholder="Tìm email, tên, tổ chức..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Tổ chức</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Nhu cầu</TableHead>
              <TableHead>Ngày gửi</TableHead>
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
                  Chưa có thông tin email nào.
                </TableCell>
              </TableRow>
            ) : rows.map((item: any, idx: number) => (
              <TableRow key={item.id ?? idx}>
                <TableCell className="text-gray-400 text-sm">{(page - 1) * pageSize + idx + 1}</TableCell>
                <TableCell>
                  <a href={`mailto:${item.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                    {item.email}
                  </a>
                </TableCell>
                <TableCell className="text-sm">{item.full_name || '—'}</TableCell>
                <TableCell className="text-sm text-gray-600 max-w-40 truncate">
                  {item.organization_name || '—'}
                </TableCell>
                <TableCell className="text-sm text-gray-600">{item.phone || '—'}</TableCell>
                <TableCell className="text-sm text-gray-500 max-w-[140px] truncate">
                  {item.demand || '—'}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {item.created_at ? dayjs(item.created_at).format('DD/MM/YYYY') : '—'}
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
