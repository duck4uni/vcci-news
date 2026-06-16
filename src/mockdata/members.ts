"use client";

export const MEMBER_STORAGE_KEY = "vcci-news.admin-members.data.v1";
export const MEMBER_FIELD_STORAGE_KEY = "vcci-news.admin-member-fields.data.v1";
export const MEMBER_REGION_STORAGE_KEY = "vcci-news.admin-member-regions.data.v1";

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

import type { AdminNewsContentSection } from "@/mockdata/admin-news";

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

// ---------------------------------------------------------------------------
// ID generators
// ---------------------------------------------------------------------------

export function createMemberId(): string {
  return `member-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createMemberFieldId(): string {
  return `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createMemberRegionId(): string {
  return `region-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const SEED_FIELDS: MemberField[] = [
  { id: "field-1", name: "Công nghiệp" },
  { id: "field-2", name: "Thương mại" },
  { id: "field-3", name: "Dịch vụ" },
  { id: "field-4", name: "Nông nghiệp" },
  { id: "field-5", name: "Công nghệ thông tin" },
];

const SEED_REGIONS: MemberRegion[] = [
  { id: "region-1", name: "TP. Hồ Chí Minh" },
  { id: "region-2", name: "Hà Nội" },
  { id: "region-3", name: "Đà Nẵng" },
  { id: "region-4", name: "Cần Thơ" },
  { id: "region-5", name: "Bình Dương" },
];

const SEED_MEMBERS: MemberItem[] = [
  {
    id: "member-1",
    name: "Công ty TNHH ABC",
    is_featured: true,
    image: null,
    region_id: "region-1",
    field_id: "field-2",
    address: "123 Nguyễn Văn Linh, Quận 7, TP. HCM",
    phone: "028 1234 5678",
    fax: "028 1234 5679",
    email: "contact@abc.vn",
    website: "https://abc.vn",
    introduction: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

export function getMemberFieldSeed(): MemberField[] {
  return SEED_FIELDS;
}

export function readMemberFields(): MemberField[] {
  if (typeof window === "undefined") return getMemberFieldSeed();
  const raw = window.localStorage.getItem(MEMBER_FIELD_STORAGE_KEY);
  if (!raw) return getMemberFieldSeed();
  try {
    const parsed = JSON.parse(raw) as MemberField[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getMemberFieldSeed();
  } catch {
    return getMemberFieldSeed();
  }
}

export function persistMemberFields(fields: MemberField[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEMBER_FIELD_STORAGE_KEY, JSON.stringify(fields));
}

// ---------------------------------------------------------------------------
// Region helpers
// ---------------------------------------------------------------------------

export function getMemberRegionSeed(): MemberRegion[] {
  return SEED_REGIONS;
}

export function readMemberRegions(): MemberRegion[] {
  if (typeof window === "undefined") return getMemberRegionSeed();
  const raw = window.localStorage.getItem(MEMBER_REGION_STORAGE_KEY);
  if (!raw) return getMemberRegionSeed();
  try {
    const parsed = JSON.parse(raw) as MemberRegion[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getMemberRegionSeed();
  } catch {
    return getMemberRegionSeed();
  }
}

export function persistMemberRegions(regions: MemberRegion[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEMBER_REGION_STORAGE_KEY, JSON.stringify(regions));
}

// ---------------------------------------------------------------------------
// Member helpers
// ---------------------------------------------------------------------------

export function getMemberSeed(): MemberItem[] {
  return SEED_MEMBERS;
}

export function readMembers(): MemberItem[] {
  if (typeof window === "undefined") return getMemberSeed();
  const raw = window.localStorage.getItem(MEMBER_STORAGE_KEY);
  if (!raw) return getMemberSeed();
  try {
    const parsed = JSON.parse(raw) as MemberItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getMemberSeed();
  } catch {
    return getMemberSeed();
  }
}

export function persistMembers(members: MemberItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(members));
}

export function cloneMemberFormValues(item: MemberItem): MemberFormValues {
  return {
    id: item.id,
    name: item.name,
    is_featured: Boolean(item.is_featured),
    image: item.image ? { ...item.image } : null,
    region_id: item.region_id,
    field_id: item.field_id,
    address: item.address,
    phone: item.phone,
    fax: item.fax,
    email: item.email,
    website: item.website,
    introduction: item.introduction.map((section) => ({
      ...section,
      images: section.images.map((img) => ({ ...img })),
    })),
  };
}

export const EMPTY_MEMBER_FORM: MemberFormValues = {
  name: "",
  is_featured: false,
  image: null,
  region_id: "",
  field_id: "",
  address: "",
  phone: "",
  fax: "",
  email: "",
  website: "",
  introduction: [],
};
