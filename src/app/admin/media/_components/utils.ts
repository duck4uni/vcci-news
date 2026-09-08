import { type CmsFileItem } from "@/lib/utils/file";

export function resolveApiError(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string } } };
    const status = axiosError.response?.status;
    const apiMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
    if (status && apiMessage) {
      return `[Lỗi ${status}] ${apiMessage}`;
    }
    if (status) {
      return `[Lỗi ${status}] ${fallback}`;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function formatFileSize(size?: number | null) {
  if (!size) return "Ảnh hệ thống";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getFileSize(item: CmsFileItem) {
  const importInfo = item as CmsFileItem & {
    size?: number | null;
    file_size?: number | null;
    import_info?: { size?: number; file_size?: number } | null;
  };

  return (
    importInfo.size ??
    importInfo.file_size ??
    importInfo.import_info?.size ??
    importInfo.import_info?.file_size ??
    0
  );
}
