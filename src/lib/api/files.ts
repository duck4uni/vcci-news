"use client";

import { useCustomClient } from "@/api/mutator/custom-client";
import { resolveUploadUrl } from "@/links";
import type { AdminMediaItem } from "@/mockdata/admin-news";

export type CmsFileItem = {
  id: string;
  path: string;
  original: string;
  mime: string;
  created_at?: string | null;
  status?: string | null;
};

export type CmsFileListResult = {
  rows: CmsFileItem[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type FileEnvelope<T> = {
  responseData?: T;
  data?: {
    responseData?: T;
  };
};

type FilePageData = {
  rows?: CmsFileItem[];
  count?: number;
  page?: number;
  pageSize?: number;
};

const readFilePageData = (payload: unknown): FilePageData => {
  const root = payload as FileEnvelope<FilePageData>;
  return root.responseData ?? root.data?.responseData ?? {};
};

export const resolveCmsFileUrl = (path?: string | null) => {
  const value = path?.trim();

  if (!value) return "/img-error.png";
  return resolveUploadUrl(value);
};

export const toAdminMediaItem = (item: CmsFileItem): AdminMediaItem => ({
  id: item.id,
  name: item.original || item.path,
  alt: item.original || item.path,
  url: resolveCmsFileUrl(item.path),
  mime: item.mime,
  size: 0,
  created_at: item.created_at ?? "",
  updated_at: item.created_at ?? "",
  source: "upload",
});

export async function fetchCmsFiles(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const keyword = params?.search?.trim() ?? "";
  const filters = [
    "mime@=image",
    keyword ? `original@=${keyword}|path@=${keyword}` : "",
  ].filter(Boolean).join(",");

  const query = new URLSearchParams({
    page: String(params?.page ?? 1),
    pageSize: String(params?.pageSize ?? 10),
    sortField: "created_at",
    sortOrder: "desc",
    filters,
  });

  const response = await useCustomClient<FileEnvelope<FilePageData>>(`/file?${query.toString()}`);
  const pageData = readFilePageData(response);
  const pageSize = pageData.pageSize ?? params?.pageSize ?? 10;
  const count = pageData.count ?? 0;

  return {
    rows: pageData.rows ?? [],
    count,
    page: pageData.page ?? params?.page ?? 1,
    pageSize,
    totalPages: Math.max(1, Math.ceil(count / pageSize)),
  } satisfies CmsFileListResult;
}

export async function uploadCmsFile(input: { file: File; original?: string }) {
  const formData = new FormData();
  formData.append("file", input.file);

  if (input.original?.trim()) {
    formData.append("original", input.original.trim());
  }

  const response = await useCustomClient<FileEnvelope<CmsFileItem>>("/file/upload", {
    method: "POST",
    body: formData,
  });

  const root = response as FileEnvelope<CmsFileItem>;
  return root.responseData ?? root.data?.responseData ?? null;
}

export async function fetchCmsFileById(id: string) {
  const response = await useCustomClient<FileEnvelope<CmsFileItem>>(`/file/${id}`);
  const root = response as FileEnvelope<CmsFileItem>;
  return root.responseData ?? root.data?.responseData ?? null;
}

export async function deleteCmsFile(id: string) {
  await useCustomClient(`/file/${id}`, {
    method: "DELETE",
  });
}
