'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useGetNewsAdmin,
  useDeleteNewsId,
  getGetNewsAdminQueryKey,
} from '@/api/endpoints/news';
import { GetNewsResponseType } from '@/api/types/news';
import { useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { Spinner } from '@/components/ui';

function DeleteConfirm({ item, onClose }: { item: { id: string; title: string }; onClose: () => void }) {
  const qc = useQueryClient();
  const { mutate: del, isPending } = useDeleteNewsId({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetNewsAdminQueryKey() });
        onClose();
      },
    },
  });

  return (
    <AlertDialog open onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá bài viết?</AlertDialogTitle>
          <AlertDialogDescription>
            Bài viết <strong>"{item.title}"</strong> sẽ bị xoá vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => del({ id: String(item.id) })}
            disabled={isPending}
          >
            {isPending ? 'Đang xoá...' : 'Xoá'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function NewsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteItem, setDeleteItem] = useState<{ id: string; title: string } | null>(null);
  const pageSize = 20;

  const { data, isLoading } = useGetNewsAdmin<GetNewsResponseType>({
    currentPage: String(page),
    pageSize: String(pageSize),
    filters: search ? `title@=${search}` : undefined,
  });

  const rows = data?.responseData?.rows ?? [];
  const totalPages = data?.responseData?.totalPages ?? 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Danh sách bài viết</h2>
          <p className="text-sm text-gray-500 mt-1">Tất cả bài viết trong hệ thống.</p>
        </div>
        <Button asChild>
          <Link href="/admin/news/new">
            <Plus size={16} className="mr-1" /> Thêm bài viết
          </Link>
        </Button>
      </div>

      <div className="relative w-72 mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-9"
          placeholder="Tìm kiếm tiêu đề..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Thể loại</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="w-16 text-center">Hiển thị</TableHead>
              <TableHead>Ngày đăng</TableHead>
              <TableHead className="w-24 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10"><Spinner /></TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-10 text-sm">Chưa có bài viết nào.</TableCell>
              </TableRow>
            ) : rows.map((news: Record<string, any>, idx: number) => (
              <TableRow key={news.id}>
                <TableCell className="text-gray-400 text-sm">{(page - 1) * pageSize + idx + 1}</TableCell>
                <TableCell className="max-w-xs">
                  <p className="font-medium text-sm truncate">{news.title}</p>
                  {news.external_link && (
                    <p className="text-xs text-blue-400 truncate">{news.external_link}</p>
                  )}
                </TableCell>
                <TableCell>
                  {news.category?.name ? (
                    <Badge variant="secondary" className="text-xs">{news.category.name}</Badge>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </TableCell>
                <TableCell className="text-sm text-gray-500 max-w-[120px] truncate">
                  {news.pageConfig?.name || '—'}
                </TableCell>
                <TableCell className="text-center">
                  {news.is_active ? (
                    <Eye size={16} className="inline text-green-500" />
                  ) : (
                    <EyeOff size={16} className="inline text-gray-300" />
                  )}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {news.release_at ? dayjs(news.release_at).format('DD/MM/YYYY') : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={`/admin/news/${news.id}`}><Pencil size={15} /></Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => setDeleteItem({ id: String(news.id), title: String(news.title) })}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
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

      {deleteItem && <DeleteConfirm item={deleteItem} onClose={() => setDeleteItem(null)} />}
    </div>
  );
}
