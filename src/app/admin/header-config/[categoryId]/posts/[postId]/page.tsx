'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminNewsForm } from '@/components/admin/news-form';
import {
  getHeaderCategorySeed,
  HEADER_CONFIG_STORAGE_KEY,
  type HeaderCategoryItem,
  normalizeHeaderCategories,
} from '@/mockdata/header-config';

function readHeaderConfig() {
  if (typeof window === 'undefined') {
    return getHeaderCategorySeed();
  }

  const raw = window.localStorage.getItem(HEADER_CONFIG_STORAGE_KEY);
  if (!raw) return getHeaderCategorySeed();

  try {
    const parsed = JSON.parse(raw) as HeaderCategoryItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getHeaderCategorySeed();
    }

    return normalizeHeaderCategories(parsed);
  } catch {
    return getHeaderCategorySeed();
  }
}

export default function HeaderCategoryPostFormPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = String(params.categoryId ?? '');
  const postId = String(params.postId ?? '');
  const [category, setCategory] = React.useState<HeaderCategoryItem | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const items = readHeaderConfig();
    setCategory(items.find((item) => item.id === categoryId) ?? null);
    setReady(true);
  }, [categoryId]);

  React.useEffect(() => {
    if (!ready) return;
    if (!category || (category.type !== 'page' && category.type !== 'news')) {
      router.replace('/admin/header-config');
    }
  }, [category, ready, router]);

  if (!ready || !category || (category.type !== 'page' && category.type !== 'news')) {
    return (
      <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-8 text-center text-sm text-gray-700 shadow-sm">
        Đang tải form bài viết...
      </div>
    );
  }

  return (
    <AdminNewsForm
      newsId={postId}
      presetHeaderCategoryId={category.id}
      lockedType={category.type === 'page' ? 'baiviettrang' : 'tintuc'}
      returnPath={`/admin/header-config/${category.id}/posts`}
    />
  );
}
