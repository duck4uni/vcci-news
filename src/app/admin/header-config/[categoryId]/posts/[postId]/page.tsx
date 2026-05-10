'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  buildHeaderCategoryTree,
  getHeaderCategorySeed,
  HEADER_CONFIG_STORAGE_KEY,
  HeaderCategoryItem,
  normalizeHeaderCategories,
} from '@/mockdata/header-config';
import {
  createHeaderCategoryPostId,
  EMPTY_HEADER_CATEGORY_POST_FORM,
  getHeaderCategoryPostSeed,
  HEADER_CATEGORY_POSTS_STORAGE_KEY,
  HeaderCategoryPostFormValues,
  HeaderCategoryPostItem,
  makeHeaderCategoryPostSlug,
  normalizeHeaderCategoryPosts,
} from '@/mockdata/header-category-posts';
import { ArrowLeft, Save } from 'lucide-react';

const fieldClassName =
  'border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30';

function getInitialHeaderConfig() {
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

function useHeaderConfigModule() {
  const [items, setItems] = React.useState<HeaderCategoryItem[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setItems(getInitialHeaderConfig());
    setIsReady(true);
  }, []);

  const tree = React.useMemo(() => buildHeaderCategoryTree(items), [items]);

  return {
    tree,
    isReady,
  };
}

function getInitialHeaderCategoryPosts() {
  if (typeof window === 'undefined') {
    return getHeaderCategoryPostSeed();
  }

  const raw = window.localStorage.getItem(HEADER_CATEGORY_POSTS_STORAGE_KEY);
  if (!raw) return getHeaderCategoryPostSeed();

  try {
    const parsed = JSON.parse(raw) as HeaderCategoryPostItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getHeaderCategoryPostSeed();
    }

    return normalizeHeaderCategoryPosts(parsed);
  } catch {
    return getHeaderCategoryPostSeed();
  }
}

function persistHeaderCategoryPosts(items: HeaderCategoryPostItem[]) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(
    HEADER_CATEGORY_POSTS_STORAGE_KEY,
    JSON.stringify(normalizeHeaderCategoryPosts(items)),
  );
}

function upsertPost(items: HeaderCategoryPostItem[], post: HeaderCategoryPostItem) {
  const exists = items.some((item) => item.id === post.id);

  return normalizeHeaderCategoryPosts(
    exists ? items.map((item) => (item.id === post.id ? post : item)) : [...items, post],
  );
}

function useHeaderCategoryPostsModule() {
  const [items, setItems] = React.useState<HeaderCategoryPostItem[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setItems(getInitialHeaderCategoryPosts());
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    persistHeaderCategoryPosts(items);
  }, [isReady, items]);

  const getPostsByCategory = React.useCallback(
    (categoryId: string) => items.filter((item) => item.category_id === categoryId),
    [items],
  );

  const getPostById = React.useCallback(
    (postId: string) => items.find((item) => item.id === postId) ?? null,
    [items],
  );

  const createPost = React.useCallback(
    (categoryId: string, values: HeaderCategoryPostFormValues) => {
      const now = new Date().toISOString();

      const nextPost: HeaderCategoryPostItem = {
        id: createHeaderCategoryPostId(),
        category_id: categoryId,
        title: values.title.trim(),
        slug: values.slug.trim() || makeHeaderCategoryPostSlug(values.title),
        excerpt: values.excerpt.trim(),
        content: values.content.trim(),
        thumbnail: values.thumbnail.trim(),
        published_at: values.published_at || now.slice(0, 10),
        is_active: values.is_active,
        created_at: now,
        updated_at: now,
      };

      setItems((current) => upsertPost(current, nextPost));
      return nextPost;
    },
    [],
  );

  const updatePost = React.useCallback((postId: string, values: HeaderCategoryPostFormValues) => {
    let updatedPost: HeaderCategoryPostItem | null = null;

    setItems((current) => {
      const existing = current.find((item) => item.id === postId);
      if (!existing) return current;

      updatedPost = {
        ...existing,
        title: values.title.trim(),
        slug: values.slug.trim() || makeHeaderCategoryPostSlug(values.title),
        excerpt: values.excerpt.trim(),
        content: values.content.trim(),
        thumbnail: values.thumbnail.trim(),
        published_at: values.published_at || existing.published_at,
        is_active: values.is_active,
        updated_at: new Date().toISOString(),
      };

      return upsertPost(current, updatedPost);
    });

    return updatedPost;
  }, []);

  const toFormValues = React.useCallback(
    (post?: HeaderCategoryPostItem | null): HeaderCategoryPostFormValues => {
      if (!post) return EMPTY_HEADER_CATEGORY_POST_FORM;

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        thumbnail: post.thumbnail,
        published_at: post.published_at,
        is_active: post.is_active,
      };
    },
    [],
  );

  return {
    isReady,
    getPostsByCategory,
    getPostById,
    createPost,
    updatePost,
    toFormValues,
  };
}

export default function HeaderCategoryPostFormPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = String(params.categoryId ?? '');
  const postId = String(params.postId ?? '');
  const isCreate = postId === 'new';

  const { tree, isReady: categoriesReady } = useHeaderConfigModule();
  const {
    isReady: postsReady,
    getPostsByCategory,
    getPostById,
    createPost,
    updatePost,
    toFormValues,
  } = useHeaderCategoryPostsModule();

  const [form, setForm] = React.useState<HeaderCategoryPostFormValues>(
    EMPTY_HEADER_CATEGORY_POST_FORM,
  );

  const flatCategories = React.useMemo(() => {
    const rows: typeof tree = [];

    const walk = (items: typeof tree) => {
      items.forEach((item) => {
        rows.push(item);
        if (item.children.length > 0) {
          walk(item.children);
        }
      });
    };

    walk(tree);
    return rows;
  }, [tree]);

  const category = React.useMemo(
    () => flatCategories.find((item) => item.id === categoryId) ?? null,
    [categoryId, flatCategories],
  );

  const post = React.useMemo(() => {
    if (isCreate) return null;
    return getPostById(postId);
  }, [getPostById, isCreate, postId]);

  const categoryPosts = React.useMemo(
    () => getPostsByCategory(categoryId),
    [categoryId, getPostsByCategory],
  );
  const isSinglePostCategory = category?.type === 'page';
  const canManagePosts = Boolean(
    category && (category.type === 'page' || category.type === 'news' || category.type === 'image'),
  );

  React.useEffect(() => {
    if (!postsReady) return;
    if (isCreate) {
      setForm(EMPTY_HEADER_CATEGORY_POST_FORM);
      return;
    }

    setForm(toFormValues(post));
  }, [isCreate, post, postsReady, toFormValues]);

  React.useEffect(() => {
    if (!categoriesReady || !postsReady) return;

    if (!category || !canManagePosts) {
      router.replace('/admin/header-config');
      return;
    }

    if (isCreate && isSinglePostCategory && categoryPosts.length >= 1) {
      toast.error('Danh mục bài viết trang chỉ được tạo 1 bài viết');
      router.replace(`/admin/header-config/${categoryId}/posts`);
      return;
    }

    if (!isCreate && !post) {
      router.replace(`/admin/header-config/${categoryId}/posts`);
    }
  }, [
    canManagePosts,
    categoriesReady,
    category,
    categoryId,
    categoryPosts.length,
    isCreate,
    isSinglePostCategory,
    post,
    postsReady,
    router,
  ]);

  const setField = <K extends keyof HeaderCategoryPostFormValues>(
    key: K,
    value: HeaderCategoryPostFormValues[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    setForm((previous) => ({
      ...previous,
      title: value,
      slug:
        value
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\\s-]/g, '')
          .replace(/\\s+/g, '-')
          .replace(/-+/g, '-') || previous.slug,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error('Tiêu đề bài viết là bắt buộc');
      return;
    }

    if (isCreate) {
      createPost(categoryId, form);
      toast.success('Đã tạo bài viết');
    } else {
      updatePost(postId, form);
      toast.success('Đã cập nhật bài viết');
    }

    router.push(`/admin/header-config/${categoryId}/posts`);
  };

  if (!categoriesReady || !postsReady || !category || !canManagePosts || (!isCreate && !post)) {
    return (
      <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-8 text-center text-sm text-gray-700 shadow-sm">
        Đang tải form bài viết...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm">
        <Button
          variant="ghost"
          asChild
          className="h-9 w-fit px-3 text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
        >
          <Link href={`/admin/header-config/${categoryId}/posts`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách bài viết
          </Link>
        </Button>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[#063e8e]">
            {isCreate ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết'}
          </h2>
          <p className="text-sm text-gray-700">
            Danh mục hiện tại: <span className="font-medium text-black">{category.name}</span>
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-gray-700">Tiêu đề bài viết *</Label>
            <Input
              required
              value={form.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Nhập tiêu đề bài viết"
              className={fieldClassName}
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-gray-700">Slug</Label>
            <Input
              value={form.slug}
              onChange={(event) => setField('slug', event.target.value)}
              placeholder="tieu-de-bai-viet"
              className={fieldClassName}
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-gray-700">Ngày đăng</Label>
            <Input
              type="date"
              value={form.published_at}
              onChange={(event) => setField('published_at', event.target.value)}
              className={fieldClassName}
            />
          </div>

          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-gray-700">Ảnh đại diện</Label>
            <Input
              value={form.thumbnail}
              onChange={(event) => setField('thumbnail', event.target.value)}
              placeholder="https://..."
              className={fieldClassName}
            />
            {form.thumbnail ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/5 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.thumbnail}
                  alt={form.title || 'thumbnail'}
                  className="h-48 w-full rounded-lg object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-gray-700">Tóm tắt</Label>
            <Textarea
              rows={4}
              value={form.excerpt}
              onChange={(event) => setField('excerpt', event.target.value)}
              placeholder="Nhập mô tả ngắn cho bài viết"
              className={fieldClassName}
            />
          </div>

          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-gray-700">Nội dung</Label>
            <Textarea
              rows={12}
              value={form.content}
              onChange={(event) => setField('content', event.target.value)}
              placeholder="<p>Nội dung bài viết...</p>"
              className={`${fieldClassName} font-mono text-sm`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/5 px-4 py-3">
          <Switch
            checked={form.is_active}
            onCheckedChange={(checked) => setField('is_active', checked)}
            className="data-[state=checked]:bg-[#063e8e] data-[state=unchecked]:bg-gray-300"
          />
          <Label className="cursor-pointer text-sm text-gray-700">Hiển thị bài viết</Label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            asChild
            className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
          >
            <Link href={`/admin/header-config/${categoryId}/posts`}>Hủy</Link>
          </Button>
          <Button type="submit" className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90">
            <Save className="mr-2 h-4 w-4" />
            {isCreate ? 'Lưu bài viết' : 'Cập nhật bài viết'}
          </Button>
        </div>
      </form>
    </div>
  );
}
