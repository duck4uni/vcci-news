"use client";

export const ADVERTISEMENTS_STORAGE_KEY = "vcci-news.admin-advertisements.data.v1";

/** Loại quảng cáo: vuông (sidebar) hoặc ngang (banner full-width) */
export type AdvertisementType = "square" | "horizontal";

/** Chế độ hiển thị */
export type AdvertisementStatus = "active" | "inactive";

export interface AdvertisementItem {
  id: string;
  /** Tên quảng cáo */
  name: string;
  /** Đường dẫn ảnh (có thể là .gif) */
  image: string;
  /** Alt text cho ảnh */
  alt: string;
  /** Đường link khi bấm vào */
  link: string;
  /** Loại quảng cáo: vuông | ngang */
  type: AdvertisementType;
  /** Chế độ hiển thị */
  status: AdvertisementStatus;
  /** Thứ tự hiển thị (số nhỏ hiện trước) */
  sortOrder: number;
  /** Ngày tạo (ISO string) */
  createdAt: string;
  /** Tạo bởi ai */
  createdBy: string;
  /** Ngày sửa (ISO string) */
  updatedAt: string;
  /** Sửa bởi ai */
  updatedBy: string;
}

export interface AdvertisementFormValues {
  id?: string;
  name: string;
  image: string;
  alt: string;
  link: string;
  type: AdvertisementType;
  status: AdvertisementStatus;
  sortOrder: number;
}

const ADVERTISEMENT_SEED: AdvertisementItem[] = [
  // === Loại ngang (banner full-width giữa các section) ===
  {
    id: "ad-h-001",
    name: "Quảng cáo ngang VCCI HCM 1",
    image: "/quang-cao/qc-1.jpg",
    alt: "Quảng cáo VCCI HCM",
    link: "https://vcci-hcm.org.vn1",
    type: "horizontal",
    status: "active",
    sortOrder: 1,
    createdAt: "2025-01-05T00:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2025-01-13T08:34:50.000Z",
    updatedBy: "admin",
  },
  {
    id: "ad-h-002",
    name: "Quảng cáo ngang VCCI HCM 2",
    image: "/quang-cao/qc-1.jpg",
    alt: "Quảng cáo VCCI HCM",
    link: "https://vcci-hcm.org.vn2",
    type: "horizontal",
    status: "active",
    sortOrder: 2,
    createdAt: "2025-01-06T00:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2025-01-13T08:34:50.000Z",
    updatedBy: "admin",
  },
  // === Loại vuông (sidebar cạnh News / Business) ===
  {
    id: "ad-s-001",
    name: "Quảng cáo sidebar 1",
    image: "/quang-cao/qc-2.gif",
    alt: "Quảng cáo 1",
    link: "https://hardwaretools.com.vn/1",
    type: "square",
    status: "active",
    sortOrder: 1,
    createdAt: "2025-01-05T00:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2025-01-13T08:34:50.000Z",
    updatedBy: "admin",
  },
  {
    id: "ad-s-002",
    name: "Quảng cáo sidebar 2",
    image: "/quang-cao/qc-2.gif",
    alt: "Quảng cáo 2",
    link: "https://hardwaretools.com.vn/2",
    type: "square",
    status: "active",
    sortOrder: 2,
    createdAt: "2025-01-05T00:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2025-01-13T08:34:50.000Z",
    updatedBy: "admin",
  },
  {
    id: "ad-s-003",
    name: "Quảng cáo sidebar 3",
    image: "/quang-cao/qc-2.gif",
    alt: "Quảng cáo 3",
    link: "https://hardwaretools.com.vn/3",
    type: "square",
    status: "active",
    sortOrder: 3,
    createdAt: "2025-01-05T00:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2025-01-13T08:34:50.000Z",
    updatedBy: "admin",
  },
  {
    id: "ad-s-004",
    name: "Quảng cáo sidebar 4",
    image: "/quang-cao/qc-2.gif",
    alt: "Quảng cáo 4",
    link: "https://hardwaretools.com.vn/4",
    type: "square",
    status: "active",
    sortOrder: 4,
    createdAt: "2025-01-05T00:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2025-01-13T08:34:50.000Z",
    updatedBy: "admin",
  },
  {
    id: "ad-s-005",
    name: "Quảng cáo sidebar 5",
    image: "/quang-cao/qc-2.gif",
    alt: "Quảng cáo 5",
    link: "https://hardwaretools.com.vn/5",
    type: "square",
    status: "active",
    sortOrder: 5,
    createdAt: "2025-01-05T00:00:00.000Z",
    createdBy: "admin",
    updatedAt: "2025-01-13T08:34:50.000Z",
    updatedBy: "admin",
  },
];

export function createAdvertisementId(): string {
  return `ad-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getAdvertisementSeed(): AdvertisementItem[] {
  return ADVERTISEMENT_SEED.map((item) => ({ ...item }));
}

/** Đọc tất cả quảng cáo từ localStorage, fallback seed */
export function readAdvertisements(): AdvertisementItem[] {
  if (typeof window === "undefined") return getAdvertisementSeed();

  const raw = window.localStorage.getItem(ADVERTISEMENTS_STORAGE_KEY);
  if (!raw) return getAdvertisementSeed();

  try {
    const parsed = JSON.parse(raw) as AdvertisementItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getAdvertisementSeed();
  } catch {
    return getAdvertisementSeed();
  }
}

/** Đọc quảng cáo theo loại (square | horizontal), chỉ lấy active, sắp xếp theo sortOrder */
export function readAdvertisementsByType(type: AdvertisementType): AdvertisementItem[] {
  return readAdvertisements()
    .filter((item) => item.type === type && item.status === "active")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function persistAdvertisements(items: AdvertisementItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADVERTISEMENTS_STORAGE_KEY, JSON.stringify(items));
}

export function sortAdvertisements(items: AdvertisementItem[]): AdvertisementItem[] {
  return [...items].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.name.localeCompare(b.name, "vi");
  });
}

export const EMPTY_ADVERTISEMENT_FORM: AdvertisementFormValues = {
  name: "",
  image: "",
  alt: "",
  link: "",
  type: "square",
  status: "active",
  sortOrder: 1,
};
