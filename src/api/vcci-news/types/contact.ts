export type ContactPurpose =
  | "Hội viên VCCI"
  | "Xuất xứ hàng hóa C/O"
  | "Xúc tiến thương mại"
  | "Quảng cáo"
  | "Mục đích khác";

export interface NewsletterSubscriptionItem {
  id: string;
  email: string;
  submittedAt: string;
}

export interface ContactRequestItem {
  id: string;
  purpose: ContactPurpose;
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
}

export interface MembershipApplicationItem {
  id: string;
  organizationName: string;
  membershipType: string;
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessField: string;
  website: string;
  note: string;
  submittedAt: string;
}
