import type {
  AdminNewsImageRef,
  AdminNewsContentSection,
} from "@/api/vcci-news/types/post";

export interface AdminMemberRow {
  id: string;
  full_name: string;
  avatar_url: string | null;
  birth_date: string | null;
  business_id: string | null;
  position_id: string | null;
  job_title: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminMemberFormValues {
  id?: string;
  full_name: string;
  avatar_url: string | null;
  birth_date: string;
  business_id: string;
  position_id: string;
  job_title: string;
}

export const EMPTY_MEMBER_FORM: AdminMemberFormValues = {
  full_name: "",
  avatar_url: null,
  birth_date: "",
  business_id: "",
  position_id: "",
  job_title: "",
};

export function mapApiRowToAdminMemberRow(item: any): AdminMemberRow {
  return {
    id: String(item?.id ?? ""),
    full_name: item?.full_name ?? "",
    avatar_url: item?.avatar_url ?? null,
    birth_date: item?.birth_date ?? null,
    business_id: item?.business_id ?? null,
    position_id: item?.position_id ?? null,
    job_title: item?.job_title ?? null,
    created_at: item?.created_at ?? null,
    updated_at: item?.updated_at ?? null,
  };
}

export function extractRows(responseData: unknown): any[] {
  if (!responseData || typeof responseData !== "object") return [];
  const rows = (responseData as { rows?: unknown }).rows;
  return Array.isArray(rows) ? rows : [];
}

// Re-export media types used by member form media picker
export type AdminMemberImageRef = AdminNewsImageRef;
export type AdminMemberContentSection = AdminNewsContentSection;
