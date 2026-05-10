'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import dayjs from 'dayjs';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  buildHeaderCategoryTree,
  getHeaderCategorySeed,
  HEADER_CONFIG_STORAGE_KEY,
  HeaderCategoryItem,
  HeaderCategoryType,
  normalizeHeaderCategories,
} from '@/mockdata/header-config';
import {
  createHeaderCategoryPostId,
  getHeaderCategoryPostSeed,
  HEADER_CATEGORY_POSTS_STORAGE_KEY,
  HeaderCategoryPostFormValues,
  HeaderCategoryPostItem,
  makeHeaderCategoryPostSlug,
  normalizeHeaderCategoryPosts,
} from '@/mockdata/header-category-posts';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

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

  const removePost = React.useCallback((postId: string) => {
    setItems((current) => current.filter((item) => item.id !== postId));
  }, []);

  return {
    isReady,
    getPostsByCategory,
    getPostById,
    createPost,
    updatePost,
    removePost,
  };
}

function getTypeLabel(type: HeaderCategoryType) {
  switch (type) {
    case 'page':
      return 'Bài viết trang';
    case 'news':
      return 'Tin tức';
    case 'image':
      return 'Ảnh';
    case 'category':
      return 'Danh mục';
    default:
      return type;
  }
}

export default function HeaderCategoryPostsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = String(params.categoryId ?? '');

  const { tree, isReady: categoryReady } = useHeaderConfigModule();
  const { isReady: postsReady, getPostsByCategory, removePost } = useHeaderCategoryPostsModule();

  const [search, setSearch] = React.useState('');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

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

  const posts = React.useMemo(() => getPostsByCategory(categoryId), [categoryId, getPostsByCategory]);

  const filteredPosts = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return posts;

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(keyword) ||
        post.slug.toLowerCase().includes(keyword) ||
        post.excerpt.toLowerCase().includes(keyword),
    );
  }, [posts, search]);

  const isSinglePostCategory = category?.type === 'page';
  const canCreatePost = Boolean(
    category && (category.type === 'page' || category.type === 'news' || category.type === 'image'),
  );
  const createLabel = category?.type === 'image' ? 'Thêm ảnh' : 'Thêm bài viết';

  React.useEffect(() => {
    if (!categoryReady || !postsReady) return;
    if (!category || !canCreatePost) {
      router.replace('/admin/header-config');
    }
  }, [canCreatePost, category, categoryReady, postsReady, router]);

  if (!categoryReady || !postsReady || !category || !canCreatePost) {
    return (
      <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-8 text-center text-sm text-gray-700 shadow-sm">
        Đang tải dữ liệu danh mục...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button
            variant="ghost"
            asChild
            className="h-9 w-fit px-3 text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
          >
            <Link href="/admin/header-config">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại cấu hình danh mục
            </Link>
          </Button>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-[#063e8e]">{category.name}</h2>
              <Badge variant="outline" className="border-[#063e8e]/20 text-[#063e8e]">
                {getTypeLabel(category.type)}
              </Badge>
            </div>
            <p className="max-w-3xl text-sm text-gray-700">
              {isSinglePostCategory
                ? 'Danh mục dạng bài viết trang chỉ cho phép gắn đúng 1 bài viết. Nếu cần thay nội dung, hãy chỉnh sửa bài hiện có hoặc xóa rồi tạo lại.'
                : category.type === 'image'
                  ? 'Danh mục dạng ảnh cho phép thêm nhiều nội dung và quản lý tập trung theo đúng cấu trúc header.'
                  : 'Danh mục dạng tin tức cho phép thêm nhiều bài viết và quản lý tập trung theo đúng cấu trúc header.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/5 px-4 py-3 text-sm text-gray-700">
            <span className="font-semibold text-[#063e8e]">{posts.length}</span> bài viết
          </div>
          {canCreatePost && (!isSinglePostCategory || posts.length < 1) ? (
            <Button asChild className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90">
              <Link href={`/admin/header-config/${category.id}/posts/new`}>
                <Plus className="mr-2 h-4 w-4" />
                {createLabel}
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              disabled
              className="bg-[#063e8e]/30 text-white hover:bg-[#063e8e]/30"
            >
              <Plus className="mr-2 h-4 w-4" />
              {createLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="border-[#063e8e]/15 bg-white pl-9 text-gray-700 placeholder:text-gray-700"
          />
        </div>

        {isSinglePostCategory ? (
          <p className="text-sm text-gray-700">Loại danh mục này chỉ giữ 1 bài viết hiển thị.</p>
        ) : (
          <p className="text-sm text-gray-700">
            {category.type === 'image'
              ? 'Bạn có thể thêm nhiều mục nội dung ảnh cho danh mục này.'
              : 'Bạn có thể thêm nhiều bài viết cho danh mục này.'}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#063e8e]/15 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
              <TableHead className="py-4 text-center text-white">Tiêu đề</TableHead>
              <TableHead className="w-[180px] py-4 text-center text-white">Slug</TableHead>
              <TableHead className="w-[160px] py-4 text-center text-white">Ngày đăng</TableHead>
              <TableHead className="w-[130px] py-4 text-center text-white">Hiển thị</TableHead>
              <TableHead className="w-[160px] py-4 text-center text-white">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-gray-700">
                  {posts.length === 0
                    ? 'Danh mục này chưa có bài viết nào.'
                    : 'Không tìm thấy bài viết phù hợp.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post, index) => (
                <TableRow
                  key={post.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#063e8e]/[0.03]'}
                >
                  <TableCell className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#063e8e]/10 bg-[#063e8e]/5">
                        {post.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-[#063e8e]" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="truncate font-medium text-black">{post.title}</p>
                        <p className="line-clamp-2 text-sm text-gray-700">{post.excerpt || '—'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-700">{post.slug}</TableCell>
                  <TableCell className="text-center text-sm text-gray-700">
                    {post.published_at ? dayjs(post.published_at).format('DD/MM/YYYY') : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    {post.is_active ? (
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-[#063e8e]">
                        <Eye className="h-4 w-4" />
                        Hiển thị
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                        <EyeOff className="h-4 w-4" />
                        Ẩn
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
                      >
                        <Link href={`/admin/header-config/${category.id}/posts/${post.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-700 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setDeleteId(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="border-[#063e8e]/15 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#063e8e]">Xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              Bài viết này sẽ bị xóa khỏi danh mục hiện tại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (!deleteId) return;
                removePost(deleteId);
                toast.success('Đã xóa bài viết');
                setDeleteId(null);
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
