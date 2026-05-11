"use client";

export const ADMIN_NEWS_STORAGE_KEY = "vcci-news.admin-news.data.v3";
export const ADMIN_MEDIA_STORAGE_KEY = "vcci-news.admin-media-library.data.v1";

export const ADMIN_NEWS_TYPE_OPTIONS = [
  { value: "tintuc", label: "Tin tức" },
  { value: "baiviettrang", label: "Bài viết trang" },
] as const;

export type AdminNewsType = (typeof ADMIN_NEWS_TYPE_OPTIONS)[number]["value"];

export const ADMIN_NEWS_TYPE_LABELS: Record<AdminNewsType, string> =
  ADMIN_NEWS_TYPE_OPTIONS.reduce(
    (result, option) => {
      result[option.value] = option.label;
      return result;
    },
    {} as Record<AdminNewsType, string>,
  );

export interface AdminMediaItem {
  id: string;
  name: string;
  alt: string;
  url: string;
  mime: string;
  size: number;
  created_at: string;
  updated_at: string;
  source: "seed" | "upload";
}

export interface AdminNewsImageRef {
  id: string;
  name: string;
  alt: string;
  url: string;
}

export interface AdminNewsContentImage {
  position: number;
  image: AdminNewsImageRef;
}

export interface AdminNewsContentSection {
  id: string;
  type: "text" | "image";
  position: number;
  content: string;
  image_columns: number;
  image_rows: number;
  images: AdminNewsContentImage[];
}

export interface AdminNewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: AdminNewsType;
  header_category_id: string;
  category_ids: string[];
  tagsearch_values: string[];
  is_featured: boolean;
  thumbnail: AdminNewsImageRef | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  expired_at: string;
  started_at: string;
  ended_at: string;
  registration_deadline: string;
  location: string;
  participation_fee: string;
  post_content: AdminNewsContentSection[];
}

export interface AdminNewsFormValues {
  title: string;
  slug: string;
  summary: string;
  type: AdminNewsType | "";
  header_category_id: string;
  category_ids: string[];
  tagsearch_values: string[];
  is_featured: boolean;
  thumbnail: AdminNewsImageRef | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  expired_at: string;
  started_at: string;
  ended_at: string;
  registration_deadline: string;
  location: string;
  participation_fee: string;
  post_content: AdminNewsContentSection[];
}

export const EMPTY_ADMIN_NEWS_FORM: AdminNewsFormValues = {
  title: "",
  slug: "",
  summary: "",
  type: "tintuc",
  header_category_id: "",
  category_ids: [],
  tagsearch_values: [],
  is_featured: false,
  thumbnail: null,
  is_hidden: false,
  created_at: "",
  updated_at: "",
  published_at: "",
  expired_at: "",
  started_at: "",
  ended_at: "",
  registration_deadline: "",
  location: "",
  participation_fee: "",
  post_content: [],
};

const mediaSeed: AdminMediaItem[] = [
  {
    id: "media-banner",
    name: "Banner VCCI News",
    alt: "Banner VCCI News",
    url: "/banner.webp",
    mime: "image/webp",
    size: 0,
    created_at: "2026-05-01T08:00:00.000Z",
    updated_at: "2026-05-01T08:00:00.000Z",
    source: "seed",
  },
  {
    id: "media-thumbnail",
    name: "Thumbnail mặc định",
    alt: "Thumbnail mặc định",
    url: "/thumbnail.png",
    mime: "image/png",
    size: 0,
    created_at: "2026-05-01T08:10:00.000Z",
    updated_at: "2026-05-01T08:10:00.000Z",
    source: "seed",
  },
  {
    id: "media-home-01",
    name: "Hoạt động hội viên",
    alt: "Hoạt động hội viên",
    url: "/home/20-2048x1365.webp",
    mime: "image/webp",
    size: 0,
    created_at: "2026-05-02T07:30:00.000Z",
    updated_at: "2026-05-02T07:30:00.000Z",
    source: "seed",
  },
  {
    id: "media-home-02",
    name: "Banner sự kiện",
    alt: "Banner sự kiện",
    url: "/home/eCarAid_web_banner_600x400.webp",
    mime: "image/webp",
    size: 0,
    created_at: "2026-05-03T09:15:00.000Z",
    updated_at: "2026-05-03T09:15:00.000Z",
    source: "seed",
  },
];

function toImageRef(item: AdminMediaItem): AdminNewsImageRef {
  return {
    id: item.id,
    name: item.name,
    alt: item.alt,
    url: item.url,
  };
}

const newsSeed: AdminNewsItem[] = [
  {
    id: "admin-news-01",
    title: "VCCI thúc đẩy kết nối doanh nghiệp hội viên khu vực phía Nam",
    slug: "vcci-thuc-day-ket-noi-doanh-nghiep-hoi-vien-khu-vuc-phia-nam",
    summary:
      "<p>Bản tin tổng hợp các hoạt động kết nối doanh nghiệp, mở rộng thị trường và nâng cao năng lực quản trị cho hội viên VCCI.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news", "cat-activity"],
    tagsearch_values: ["Doanh nghiệp hội viên", "Chuyển đổi số"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-08T09:00:00.000Z",
    updated_at: "2026-05-10T09:30:00.000Z",
    published_at: "2026-05-08T09:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. Hồ Chí Minh",
    participation_fee: "Miễn phí",
    post_content: [
      {
        id: "section-admin-news-01-a",
        type: "text",
        position: 1,
        content:
          "<p>Chương trình tập trung vào các giải pháp mở rộng mạng lưới doanh nghiệp hội viên, đồng thời hỗ trợ các đơn vị tiếp cận cơ hội hợp tác mới trong năm 2026.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
      {
        id: "section-admin-news-01-b",
        type: "image",
        position: 2,
        content: "",
        image_columns: 2,
        image_rows: 1,
        images: [
          { position: 1, image: toImageRef(mediaSeed[2]) },
          { position: 2, image: toImageRef(mediaSeed[3]) },
        ],
      },
    ],
  },
  {
    id: "admin-news-02",
    title: "Lịch hội thảo chuyển đổi số dành cho hội viên tháng 5",
    slug: "lich-hoi-thao-chuyen-doi-so-danh-cho-hoi-vien-thang-5",
    summary:
      "<p>Lịch hội thảo cập nhật những chương trình đào tạo, chia sẻ chuyên đề và kết nối nguồn lực hỗ trợ doanh nghiệp.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["Hội thảo", "Đăng ký"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-09T08:30:00.000Z",
    updated_at: "2026-05-11T11:00:00.000Z",
    published_at: "2026-05-09T08:30",
    expired_at: "2026-05-31T18:00",
    started_at: "2026-05-20T08:00",
    ended_at: "2026-05-20T17:00",
    registration_deadline: "2026-05-18T17:00",
    location: "Trung tâm Hội nghị VCCI",
    participation_fee: "500.000 VNĐ",
    post_content: [
      {
        id: "section-admin-news-02-a",
        type: "text",
        position: 1,
        content:
          "<p>Nội dung chuỗi hội thảo bao gồm chuyển đổi số, quản trị dữ liệu, truyền thông nội bộ và ứng dụng AI trong hoạt động doanh nghiệp.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-03",
    title: "Giới thiệu vai trò của VCCI News trong hệ sinh thái nội dung số",
    slug: "gioi-thieu-vai-tro-cua-vcci-news-trong-he-sinh-thai-noi-dung-so",
    summary:
      "<p>Bài viết trang giới thiệu định hướng phát triển nội dung, cấu trúc quản trị và trải nghiệm người dùng trên website.</p>",
    type: "baiviettrang",
    header_category_id: "intro-about",
    category_ids: [],
    tagsearch_values: [],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-05-06T10:00:00.000Z",
    updated_at: "2026-05-10T16:45:00.000Z",
    published_at: "2026-05-06T10:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-03-a",
        type: "text",
        position: 1,
        content:
          "<p>VCCI News được định hướng là trung tâm cập nhật thông tin, chuyên đề và hoạt động hội viên trên cùng một nền tảng nội dung thống nhất.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
      {
        id: "section-admin-news-03-b",
        type: "image",
        position: 2,
        content: "",
        image_columns: 1,
        image_rows: 1,
        images: [{ position: 1, image: toImageRef(mediaSeed[0]) }],
      },
    ],
  },
];

export function slugifyAdminNews(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function resolveAdminNewsType(value?: string | null): AdminNewsType | undefined {
  if (!value) return undefined;

  const normalized = value.trim().toLowerCase();
  const compact = normalized.replace(/[\s_-]+/g, "");

  const direct = ADMIN_NEWS_TYPE_OPTIONS.find(
    (option) => option.value === normalized || option.value === compact,
  );

  if (direct) return direct.value;

  const aliases: Record<string, AdminNewsType> = {
    news: "tintuc",
    "tin tuc": "tintuc",
    "tin tức": "tintuc",
    pagepost: "baiviettrang",
    "bai viet trang": "baiviettrang",
    "bài viết trang": "baiviettrang",
  };

  return aliases[normalized] || aliases[compact];
}

export function createAdminNewsId() {
  return `admin-news-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createAdminMediaId() {
  return `admin-media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createAdminNewsSectionId() {
  return `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function cloneAdminNewsFormValues(item?: AdminNewsItem | null): AdminNewsFormValues {
  if (!item) {
    return {
      ...EMPTY_ADMIN_NEWS_FORM,
      category_ids: [],
      tagsearch_values: [],
      post_content: [],
    };
  }

  return {
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    type: item.type,
    header_category_id: item.header_category_id,
    category_ids: [...item.category_ids],
    tagsearch_values: [...(item.tagsearch_values ?? [])],
    is_featured: item.is_featured ?? false,
    thumbnail: item.thumbnail ? { ...item.thumbnail } : null,
    is_hidden: item.is_hidden,
    created_at: item.created_at,
    updated_at: item.updated_at,
    published_at: item.published_at,
    expired_at: item.expired_at,
    started_at: item.started_at,
    ended_at: item.ended_at,
    registration_deadline: item.registration_deadline,
    location: item.location,
    participation_fee: item.participation_fee,
    post_content: item.post_content.map((section) => ({
      ...section,
      images: section.images.map((image) => ({
        ...image,
        image: { ...image.image },
      })),
    })),
  };
}

export function normalizeAdminMediaItems(items: AdminMediaItem[]) {
  return [...items].sort((left, right) => {
    return (
      new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime() ||
      right.name.localeCompare(left.name, "vi")
    );
  });
}

export function normalizeAdminNewsItems(items: AdminNewsItem[]) {
  return [...items]
    .map((item) => ({
      ...item,
      category_ids: Array.isArray(item.category_ids) ? item.category_ids : [],
      tagsearch_values: Array.isArray(item.tagsearch_values)
        ? item.tagsearch_values.filter(Boolean)
        : [],
      is_featured: item.type === "tintuc" ? Boolean(item.is_featured) : false,
    }))
    .sort((left, right) => {
      const leftTime = new Date(left.published_at || left.created_at).getTime();
      const rightTime = new Date(right.published_at || right.created_at).getTime();

      return rightTime - leftTime || right.updated_at.localeCompare(left.updated_at);
    });
}

export function getAdminMediaSeed() {
  return normalizeAdminMediaItems(mediaSeed);
}

export function getAdminNewsSeed() {
  return normalizeAdminNewsItems(newsSeed);
}

export function readAdminMediaItems() {
  if (typeof window === "undefined") return getAdminMediaSeed();

  const raw = window.localStorage.getItem(ADMIN_MEDIA_STORAGE_KEY);
  if (!raw) return getAdminMediaSeed();

  try {
    const parsed = JSON.parse(raw) as AdminMediaItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getAdminMediaSeed();
    }

    return normalizeAdminMediaItems(parsed);
  } catch {
    return getAdminMediaSeed();
  }
}

export function readAdminNewsItems() {
  if (typeof window === "undefined") return getAdminNewsSeed();

  const raw = window.localStorage.getItem(ADMIN_NEWS_STORAGE_KEY);
  if (!raw) return getAdminNewsSeed();

  try {
    const parsed = JSON.parse(raw) as AdminNewsItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getAdminNewsSeed();
    }

    return normalizeAdminNewsItems(parsed);
  } catch {
    return getAdminNewsSeed();
  }
}

export function persistAdminMediaItems(items: AdminMediaItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ADMIN_MEDIA_STORAGE_KEY,
    JSON.stringify(normalizeAdminMediaItems(items)),
  );
}

export function persistAdminNewsItems(items: AdminNewsItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    ADMIN_NEWS_STORAGE_KEY,
    JSON.stringify(normalizeAdminNewsItems(items)),
  );
}
