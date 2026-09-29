import type { Contact } from "@/api/vcci-news/models/contact";

export const CONTACT_PURPOSE_OPTIONS: string[] = [
  "Hội viên VCCI",
  "Xuất xứ hàng hóa C/O",
  "Xúc tiến thương mại",
  "Quảng cáo",
  "Mục đích khác",
];

export interface AdminContactRequestRow {
  id: string;
  purpose: string;
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  message: string;
  organizationName: string;
  businessField: string;
  email: string;
  website: string;
  submittedAt: string;
  status: string;
}

export function mapApiRowToAdminContactRequest(item: any): AdminContactRequestRow {
  const contact = (item as Partial<Contact>) ?? {};
  return {
    id: String(contact.id ?? ""),
    purpose: contact.title ?? "",
    contactName: contact.fullname ?? "",
    contactPosition: "",
    contactEmail: contact.email ?? "",
    contactPhone: contact.phone ?? "",
    message: contact.content ?? "",
    organizationName: contact.fullname ?? "",
    businessField: "",
    email: contact.email ?? "",
    website: "",
    submittedAt: contact.created_at ?? "",
    status: contact.status ?? "",
  };
}

export function extractRows(responseData: unknown): any[] {
  if (!responseData || typeof responseData !== "object") return [];
  const rows = (responseData as { rows?: unknown }).rows;
  return Array.isArray(rows) ? rows : [];
}
