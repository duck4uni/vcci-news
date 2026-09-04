"use client";

import * as React from "react";
import { Clock, ChevronDown, ChevronUp, User, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useGetApiV10PostIdHistory } from "@/api/vcci-news/endpoints/post";
import type { PostHistoryItem, PostHistoryAction } from "@/api/vcci-news/types/post-history";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ACTION_CONFIG: Record<
  PostHistoryAction,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  CREATE: {
    label: "Tạo bài viết",
    icon: Plus,
    className: "bg-green-100 text-green-700 border-green-200",
  },
  UPDATE: {
    label: "Cập nhật",
    icon: Pencil,
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  DELETE: {
    label: "Xóa bài viết",
    icon: Trash2,
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFieldName(field: string): string {
  const fieldMap: Record<string, string> = {
    title: "Tiêu đề",
    content: "Nội dung",
    summary: "Tóm tắt",
    status: "Trạng thái",
    is_hidden: "Ẩn/Hiện",
    is_featured: "Tin nổi bật",
    thumbnail_id: "Hình đại diện",
    slug: "Slug",
    published_at: "Ngày xuất bản",
    expired_at: "Ngày hết hạn",
    external_link: "Liên kết ngoài",
  };
  return fieldMap[field] || field;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "(trống)";
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function HistoryItem({ item }: { item: PostHistoryItem }) {
  const config = ACTION_CONFIG[item.action];
  const Icon = config.icon;
  const [isOpen, setIsOpen] = React.useState(item.action === "CREATE");

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div
        className="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", config.className)}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{config.label}</span>
              {item.actor && (
                <span className="text-sm text-gray-500">
                  bởi <span className="font-medium">{item.actor.full_name || item.actor.email}</span>
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 p-3">
          {item.action === "UPDATE" && item.changes && Object.keys(item.changes).length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Các thay đổi:</p>
              {Object.entries(item.changes).map(([field, { old: oldVal, new: newVal }]) => (
                <div key={field} className="grid grid-cols-[120px_1fr_1fr] items-center gap-2 text-sm">
                  <span className="font-medium text-gray-600">{formatFieldName(field)}:</span>
                  <div className="rounded bg-red-50 px-2 py-1 text-red-700 line-through">
                    {formatValue(oldVal)}
                  </div>
                  <div className="rounded bg-green-50 px-2 py-1 text-green-700">
                    {formatValue(newVal)}
                  </div>
                </div>
              ))}
            </div>
          ) : item.action === "DELETE" && item.snapshot ? (
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-700">Dữ liệu bài viết trước khi xóa:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span>Tiêu đề:</span>
                <span className="font-medium">{String(item.snapshot.title || "")}</span>
                <span>Trạng thái:</span>
                <span className="font-medium">{String(item.snapshot.status || "")}</span>
              </div>
            </div>
          ) : item.snapshot ? (
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-700">Trạng thái ban đầu:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span>Tiêu đề:</span>
                <span className="font-medium">{String(item.snapshot.title || item.snapshot.name || "")}</span>
                <span>Trạng thái:</span>
                <span className="font-medium">{String(item.snapshot.status || "")}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Không có chi tiết</p>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryLoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-[#063e8e]" />
      <span className="ml-2 text-gray-600">Đang tải lịch sử...</span>
    </div>
  );
}

function HistoryEmptyState() {
  return (
    <div className="py-8 text-center text-gray-500">
      <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
      <p>Chưa có lịch sử chỉnh sửa</p>
    </div>
  );
}

function HistoryErrorState({ error }: { error: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      <p>Không thể tải lịch sử: {error}</p>
    </div>
  );
}

interface PostHistoryViewerProps {
  postId: string;
}

export function PostHistoryViewer({ postId }: PostHistoryViewerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  // Always fetch history so the count is correct even before the user opens
  // the panel. Previously `enabled: isOpen` caused the count to show "0 thay
  // đổi" until the panel was opened.
  const { data, isLoading, isError, error } = useGetApiV10PostIdHistory(postId);

  const historyItems = React.useMemo(() => {
    // useQuery's `data` IS the API response body: { responseData: [...], ... }
    const raw = data as unknown as { responseData?: PostHistoryItem[]; data?: PostHistoryItem[] } | undefined;
    if (!raw) return [];
    return raw.responseData ?? raw.data ?? [];
  }, [data]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl border border-[#063e8e]/15 bg-white p-4 text-left transition hover:bg-[#063e8e]/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#063e8e]/10">
              <Clock className="h-5 w-5 text-[#063e8e]" />
            </div>
            <div>
              <p className="font-semibold text-[#063e8e]">Lịch sử chỉnh sửa</p>
              <p className="text-sm text-gray-500">
                {isLoading ? "Đang tải..." : `${historyItems.length} thay đổi`}
              </p>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-[#063e8e]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#063e8e]" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 space-y-2">
          {isLoading ? (
            <HistoryLoadingState />
          ) : isError ? (
            <HistoryErrorState error={error?.message || "Lỗi không xác định"} />
          ) : historyItems.length === 0 ? (
            <HistoryEmptyState />
          ) : (
            historyItems.map((item) => <HistoryItem key={item.id} item={item} />)
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
