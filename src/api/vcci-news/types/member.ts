import type { AdminNewsContentSection } from "./post";

export interface MemberField {
  id: string;
  name: string;
}

export interface MemberRegion {
  id: string;
  name: string;
}

export interface MemberImageRef {
  id: string;
  name: string;
  alt: string;
  url: string;
}

export interface MemberItem {
  id: string;
  name: string;
  is_featured: boolean;
  image: MemberImageRef | null;
  region_id: string;
  field_id: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  introduction: AdminNewsContentSection[];
  created_at: string;
  updated_at: string;
}

export interface MemberFormValues {
  id?: string;
  name: string;
  is_featured: boolean;
  image: MemberImageRef | null;
  region_id: string;
  field_id: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  introduction: AdminNewsContentSection[];
}
