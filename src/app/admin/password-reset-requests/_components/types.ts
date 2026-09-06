export interface PasswordResetRequest {
  id: string;
  email: string;
  note?: string | null;
  status: "PENDING" | "RESOLVED" | "REJECTED";
  resolved_by?: string | null;
  resolved_at?: string | null;
  resolve_note?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  resolved_by_user?: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export interface ListResponse {
  rows: PasswordResetRequest[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const PAGE_SIZE = 10;
export const DEFAULT_NEW_PASSWORD = "vcci@2026";

export function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}
