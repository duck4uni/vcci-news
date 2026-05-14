"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminNewsForm } from "@/components/admin/news-form";
import { fetchHeaderConfigItems, type CmsHeaderCategoryItem } from "@/lib/api/cms-admin";

export default function HeaderCategoryPostFormPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = String(params.categoryId ?? "");
  const postId = String(params.postId ?? "");
  const [category, setCategory] = React.useState<CmsHeaderCategoryItem | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const headerConfig = await fetchHeaderConfigItems();
        if (cancelled) return;

        setCategory(headerConfig.items.find((item) => item.id === categoryId) ?? null);
      } catch (error) {
        if (cancelled) return;
        toast.error(error instanceof Error ? error.message : "Không thể tải danh mục");
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  React.useEffect(() => {
    if (!ready) return;
    if (!category || (category.type !== "page" && category.type !== "news")) {
      router.replace("/admin/header-config");
    }
  }, [category, ready, router]);

  if (!ready || !category || (category.type !== "page" && category.type !== "news")) {
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
      lockedType={category.type === "page" ? "baiviettrang" : "tintuc"}
      returnPath={`/admin/header-config/${category.id}/posts`}
    />
  );
}
