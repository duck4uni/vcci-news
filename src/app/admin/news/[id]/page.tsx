'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useGetNewsId,
  usePostNews,
  usePutNewsId,
  getGetNewsAdminQueryKey,
} from '@/api/endpoints/news';
import { useGetCategory } from '@/api/endpoints/category';
import { useGetNewsPageConfigGetHierarchical } from '@/api/endpoints/news-page-config';
import { GetCategoryAdminResponseType } from '@/api/types/category';
import {
  GetNewsPageConfigResponseType,
  NewsPageConfigItem,
} from '@/api/types/news-page-config';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { Spinner } from '@/components/ui';

// Flatten news page config tree for select options
function flattenTree(
  node: NewsPageConfigItem,
  depth = 0,
): { id: string; label: string }[] {
  const prefix = '  '.repeat(depth);
  const self = { id: node.id, label: `${prefix}${node.name}` };
  const children = (node.children ?? []).flatMap((c) => flattenTree(c, depth + 1));
  return [self, ...children];
}

export default function NewsFormPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();

  const id = params?.id as string;
  const isNew = id === 'new';
  const [, startTransition] = useTransition();

  const [form, setForm] = useState({
    title: '',
    thumbnail: '',
    external_link: '',
    description: '',
    release_at: '',
    is_active: true,
    category: '',
    page_config_id: '',
  });

  // Fetch existing news when editing
  const { data: newsData, isLoading: newsLoading } = useGetNewsId(isNew ? '' : id, {
    query: { enabled: !isNew && !!id },
  });

  useEffect(() => {
    const d = (newsData as Record<string, unknown>)?.responseData as Record<string, unknown> | undefined
      ?? (newsData as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
    if (!d) return;
    // Intentional: populate form when data loads
    startTransition(() => setForm({
      title: (d.title as string) ?? '',
      thumbnail: (d.thumbnail as string) ?? '',
      external_link: (d.external_link as string) ?? '',
      description: (d.description as string) ?? '',
      release_at: d.release_at ? (d.release_at as string).slice(0, 10) : '',
      is_active: (d.is_active as boolean) ?? true,
      category: (d.category as string) ?? '',
      page_config_id: ((d.page_config as Record<string, string>)?.id) ?? (d.page_config_id as string) ?? '',
    }));
  }, [newsData]);

  // Categories
  const { data: catData } = useGetCategory<GetCategoryAdminResponseType>({ pageSize: '100' });
  const categories = catData?.responseData?.rows ?? [];

  // Page config tree
  const { data: configData } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>();
  const configRoot = configData?.responseData;
  const configOptions = configRoot ? flattenTree(configRoot) : [];

  // Mutations
  const { mutate: create, isPending: creating } = usePostNews({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetNewsAdminQueryKey() });
        router.push('/admin/news');
      },
    },
  });

  const { mutate: update, isPending: updating } = usePutNewsId({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetNewsAdminQueryKey() });
        router.push('/admin/news');
      },
    },
  });

  const isPending = creating || updating;

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      thumbnail: form.thumbnail || undefined,
      external_link: form.external_link || undefined,
      description: form.description,
      release_at: form.release_at || undefined,
      is_active: form.is_active,
      category: form.category || undefined,
      page_config_id: form.page_config_id || undefined,
    };

    if (isNew) {
      create({ data: [payload] });
    } else {
      update({ id, data: payload });
    }
  };

  if (!isNew && newsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/news">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {isNew ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isNew ? 'Điền thông tin để tạo bài viết mới.' : `Đang sửa bài viết #${id}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-sm p-6 space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Tiêu đề *</Label>
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Nhập tiêu đề bài viết..."
          />
        </div>

        {/* Thumbnail */}
        <div className="space-y-1.5">
          <Label htmlFor="thumbnail">URL ảnh thumbnail</Label>
          <Input
            id="thumbnail"
            value={form.thumbnail}
            onChange={(e) => setField('thumbnail', e.target.value)}
            placeholder="https://..."
          />
          {form.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.thumbnail}
              alt="preview"
              className="mt-2 h-32 w-auto rounded-md border object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>

        {/* External link */}
        <div className="space-y-1.5">
          <Label htmlFor="ext-link">Đường dẫn ngoài (nếu có)</Label>
          <Input
            id="ext-link"
            value={form.external_link}
            onChange={(e) => setField('external_link', e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label>Thể loại</Label>
          <Select value={form.category} onValueChange={(v) => setField('category', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn thể loại..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page config */}
        <div className="space-y-1.5">
          <Label>Danh mục menu (page config)</Label>
          <Select value={form.page_config_id} onValueChange={(v) => setField('page_config_id', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {configOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Release date */}
        <div className="space-y-1.5">
          <Label htmlFor="release-at">Ngày đăng</Label>
          <Input
            id="release-at"
            type="date"
            value={form.release_at}
            onChange={(e) => setField('release_at', e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="desc">Nội dung / Mô tả (HTML)</Label>
          <Textarea
            id="desc"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="<p>Nội dung bài viết...</p>"
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        {/* Is active */}
        <div className="flex items-center gap-3">
          <Switch
            id="is-active"
            checked={form.is_active}
            onCheckedChange={(v) => setField('is_active', v)}
          />
          <Label htmlFor="is-active" className="cursor-pointer">
            Hiển thị bài viết
          </Label>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/news">Huỷ</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            <Save size={15} className="mr-1" />
            {isPending ? 'Đang lưu...' : isNew ? 'Tạo bài viết' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </div>
  );
}
