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

const mediaSeedLabelMap = {
  "media-banner": {
    name: "Banner VCCI News",
    alt: "Banner VCCI News",
  },
  "media-thumbnail": {
    name: "Thumbnail mặc định",
    alt: "Thumbnail mặc định",
  },
  "media-home-01": {
    name: "Hoạt động hội viên",
    alt: "Hoạt động hội viên",
  },
  "media-home-02": {
    name: "Banner sự kiện",
    alt: "Banner sự kiện",
  },
} as const;

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

function normalizeSeedMediaLabels(item: AdminMediaItem): AdminMediaItem {
  const seedLabel = mediaSeedLabelMap[item.id as keyof typeof mediaSeedLabelMap];

  if (!seedLabel) {
    return item;
  }

  return {
    ...item,
    name: seedLabel.name,
    alt: seedLabel.alt,
  };
}

const newsSeed: AdminNewsItem[] = [
  {
    id: "admin-news-01",
    title: "VCCI th�c d?y k?t n?i doanh nghi?p h?i vi�n khu v?c ph�a Nam",
    slug: "vcci-thuc-day-ket-noi-doanh-nghiep-hoi-vien-khu-vuc-phia-nam",
    summary:
      "<p>B?n tin t?ng h?p c�c ho?t d?ng k?t n?i doanh nghi?p, m? r?ng th? tru?ng v� n�ng cao nang l?c qu?n tr? cho h?i vi�n VCCI.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news", "cat-activity"],
    tagsearch_values: ["Tin VCCI", "Doanh nghi?p h?i vi�n", "Chuy?n d?i s?"],
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
    location: "TP. H? Ch� Minh",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-01-a",
        type: "text",
        position: 1,
        content:
          "<p>Chuong tr�nh t?p trung v�o c�c gi?i ph�p m? r?ng m?ng lu?i doanh nghi?p h?i vi�n, d?ng th?i h? tr? c�c don v? ti?p c?n co h?i h?p t�c m?i trong nam 2026.</p>",
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
    title: "L?ch h?i th?o chuy?n d?i s? d�nh cho h?i vi�n th�ng 5",
    slug: "lich-hoi-thao-chuyen-doi-so-danh-cho-hoi-vien-thang-5",
    summary:
      "<p>L?ch h?i th?o c?p nh?t nh?ng chuong tr�nh d�o t?o, chia s? chuy�n d? v� k?t n?i ngu?n l?c h? tr? doanh nghi?p.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["S? ki?n", "�ang k�"],
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
    location: "Trung t�m H?i ngh? VCCI",
    participation_fee: "500.000 VN�",
    post_content: [
      {
        id: "section-admin-news-02-a",
        type: "text",
        position: 1,
        content:
          "<p>N?i dung chu?i h?i th?o bao g?m chuy?n d?i s?, qu?n tr? d? li?u, truy?n th�ng n?i b? v� ?ng d?ng AI trong ho?t d?ng doanh nghi?p.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-03",
    title: "Gi?i thi?u vai tr� c?a VCCI News trong h? sinh th�i n?i dung s?",
    slug: "gioi-thieu-vai-tro-cua-vcci-news-trong-he-sinh-thai-noi-dung-so",
    summary:
      "<p>B�i vi?t trang gi?i thi?u d?nh hu?ng ph�t tri?n n?i dung, c?u tr�c qu?n tr? v� tr?i nghi?m ngu?i d�ng tr�n website.</p>",
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
          "<p>VCCI News du?c d?nh hu?ng l� trung t�m c?p nh?t th�ng tin, chuy�n d? v� ho?t d?ng h?i vi�n tr�n c�ng m?t n?n t?ng n?i dung th?ng nh?t.</p>",
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
  {
    id: "admin-news-04",
    title: "Di?n d�n x�c ti?n thuong m?i khu v?c ph�a Nam thu h�t hon 300 doanh nghi?p tham d?",
    slug: "dien-dan-xuc-tien-thuong-mai-khu-vuc-phia-nam-thu-hut-hon-300-doanh-nghiep-tham-du",
    summary:
      "<p>Chuong tr�nh quy t? doanh nghi?p s?n xu?t, logistics v� c�c don v? h? tr? xu?t kh?u nh?m t?o m?ng lu?i k?t n?i giao thuong th?c ch?t.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news", "cat-activity"],
    tagsearch_values: ["Tin Kinh T?", "X�c ti?n thuong m?i", "K?t n?i giao thuong"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-12T08:20:00.000Z",
    updated_at: "2026-05-12T10:00:00.000Z",
    published_at: "2026-05-12T08:20",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Trung t�m H?i ch? v� Tri?n l�m S�i G�n",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-04-a",
        type: "text",
        position: 1,
        content:
          "<p>S? ki?n nh?n m?nh nhu c?u t?o chu?i k?t n?i ng?n, nhanh v� c� kh? nang chuy?n h�a th�nh co h?i kinh doanh ngay sau chuong tr�nh.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-05",
    title: "B?n tin nhanh: doanh nghi?p h?i vi�n tang t?c chuy?n d?i s? trong kh�u b�n h�ng v� cham s�c kh�ch h�ng",
    slug: "ban-tin-nhanh-doanh-nghiep-hoi-vien-tang-toc-chuyen-doi-so-trong-khau-ban-hang-va-cham-soc-khach-hang",
    summary:
      "<p>Nhi?u m� h�nh ?ng d?ng CRM, dashboard v� t? d?ng h�a quy tr�nh dang du?c chia s? t?i chu?i chuy�n d? c?a VCCI News.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Chuy�n �?", "Chuy?n d?i s?"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-11T07:45:00.000Z",
    updated_at: "2026-05-11T13:15:00.000Z",
    published_at: "2026-05-11T07:45",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "H? th?ng tr?c tuy?n",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-05-a",
        type: "text",
        position: 1,
        content:
          "<p>Xu hu?ng t?p trung v�o tr?i nghi?m kh�ch h�ng, do lu?ng hi?u qu? v?n h�nh v� chu?n h�a d? li?u dang tr? th�nh uu ti�n h�ng d?u.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-06",
    title: "Kh?i d?ng chu?i d?i tho?i ch�nh s�ch v?i doanh nghi?p v� hi?p h?i ng�nh h�ng nam 2026",
    slug: "khoi-dong-chuoi-doi-thoai-chinh-sach-voi-doanh-nghiep-va-hiep-hoi-nganh-hang-nam-2026",
    summary:
      "<p>Chu?i d?i tho?i s? t?p trung v�o vu?ng m?c th? t?c, chi ph� tu�n th? v� c�c d? xu?t c?i thi?n m�i tru?ng kinh doanh.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event", "cat-policy"],
    tagsearch_values: ["S? ki?n", "Ch�nh s�ch"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-05-10T09:10:00.000Z",
    updated_at: "2026-05-10T14:40:00.000Z",
    published_at: "2026-05-10T09:10",
    expired_at: "",
    started_at: "2026-05-28T08:30",
    ended_at: "2026-05-28T12:00",
    registration_deadline: "2026-05-25T17:00",
    location: "H� N?i",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-06-a",
        type: "text",
        position: 1,
        content:
          "<p>Chuong tr�nh du?c thi?t k? nhu m?t kh�ng gian l?ng nghe ph?n h?i th?c ti?n v� t?o d?u m?i di?u ph?i cho c�c ki?n ngh? c� tr?ng t�m.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-07",
    title: "C?m nang thi?t k? gian h�ng tri?n l�m hi?u qu? cho doanh nghi?p tham gia h?i ch? qu?c t?",
    slug: "cam-nang-thiet-ke-gian-hang-trien-lam-hieu-qua-cho-doanh-nghiep-tham-gia-hoi-cho-quoc-te",
    summary:
      "<p>N?i dung t?ng h?p nh?ng luu � v? nh?n di?n thuong hi?u, lu?ng trung b�y v� c�ch t?o tr?i nghi?m ghi nh? cho kh�ch tham quan.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news", "cat-activity"],
    tagsearch_values: ["Chuy�n �?", "C?m nang"],
    is_featured: true,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-07T14:00:00.000Z",
    updated_at: "2026-05-09T09:00:00.000Z",
    published_at: "2026-05-07T14:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. H? Ch� Minh",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-07-a",
        type: "text",
        position: 1,
        content:
          "<p>T�i li?u hu?ng d?n du?c bi�n t?p d? doanh nghi?p c� th? ?ng d?ng ngay khi chu?n b? tham gia c�c s? ki?n giao thuong trong nu?c v� qu?c t?.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-08",
    title: "Hoa K? mu?n d?y m?nh h?p t�c kinh t?, thuong m?i b?n v?ng v?i Vi?t Nam",
    slug: "hoa-ky-muon-day-manh-hop-tac-kinh-te-thuong-mai-ben-vung-voi-viet-nam",
    summary:
      "<p>Chuong tr�nh l�m vi?c t?p trung v�o h?p t�c chu?i cung ?ng, ti�u chu?n xanh v� k?t n?i doanh nghi?p gi?a c�c d?a phuong.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Tin VCCI", "H?p t�c qu?c t?"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-03-27T09:00:00.000Z",
    updated_at: "2026-03-27T11:00:00.000Z",
    published_at: "2026-03-27T09:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. H? Ch� Minh",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-08-a",
        type: "text",
        position: 1,
        content:
          "<p>�?i di?n hai b�n nh?n m?nh nhu c?u ph�t tri?n b?n v?ng v� h? tr? c?ng d?ng doanh nghi?p th�ch ?ng v?i thay d?i th? tru?ng to�n c?u.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-09",
    title: "Nh?ng di?m s�ng trong b?c tranh kinh t?, s? li?u qu� II v� 6 th�ng d?u nam 2026",
    slug: "nhung-diem-sang-trong-buc-tranh-kinh-te-so-lieu-quy-ii-va-6-thang-dau-nam-2026",
    summary:
      "<p>B?n tin t?ng h?p c�c t�n hi?u ph?c h?i, tang tru?ng xu?t kh?u v� m?c d? c?i thi?n ni?m tin th? tru?ng trong nhi?u nh�m ng�nh.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Tin Kinh T?", "Vi m�"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-03-25T08:30:00.000Z",
    updated_at: "2026-03-25T10:00:00.000Z",
    published_at: "2026-03-25T08:30",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "H� N?i",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-09-a",
        type: "text",
        position: 1,
        content:
          "<p>D? li?u cho th?y nhi?u nh�m doanh nghi?p dang c?i thi?n nang l?c don h�ng v� th�ch ?ng t?t hon v?i bi?n d?ng chi ph�.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-10",
    title: "T�nh h�nh kinh t? - vi m� Qu� 1 nam 2026",
    slug: "tinh-hinh-kinh-te-vi-mo-quy-1-nam-2026",
    summary:
      "<p>B�o c�o nhanh v? tang tru?ng, l?m ph�t, l�i su?t v� xu hu?ng d?u tu trong b?i c?nh kinh t? qu?c t? c�n nhi?u thay d?i.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Tin Kinh T?", "Vi m�"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-03-22T08:00:00.000Z",
    updated_at: "2026-03-22T09:30:00.000Z",
    published_at: "2026-03-22T08:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "H� N?i",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-10-a",
        type: "text",
        position: 1,
        content:
          "<p>B?n tin cung c?p g�c nh�n c� d?ng v? nh?ng ch? s? ?nh hu?ng tr?c ti?p d?n ho?t d?ng s?n xu?t, thuong m?i v� d?u tu.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-11",
    title: "C?m nang hu?ng d?n d?u tu kinh doanh t?i Vi?t Nam d�nh cho doanh nghi?p m?i",
    slug: "cam-nang-huong-dan-dau-tu-kinh-doanh-tai-viet-nam-danh-cho-doanh-nghiep-moi",
    summary:
      "<p>T�i li?u t?ng h?p c�c bu?c chu?n b? h? so, l?a ch?n d?a di?m v� nh?ng luu � ph�p l� ban d?u cho nh� d?u tu v� doanh nghi?p.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-news"],
    tagsearch_values: ["Chuy�n �?", "C?m nang"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-03-20T07:30:00.000Z",
    updated_at: "2026-03-20T09:00:00.000Z",
    published_at: "2026-03-20T07:30",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Tr?c tuy?n",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-11-a",
        type: "text",
        position: 1,
        content:
          "<p>N?i dung du?c bi�n t?p theo hu?ng d? �p d?ng, gi�p doanh nghi?p m?i c� th? tra c?u nhanh khi b?t d?u tri?n khai d? �n.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-12",
    title: "Kh�a d�o t?o: Qu?n tr? Thu? v� Ph�p l� trong giao d?ch",
    slug: "khoa-dao-tao-quan-tri-thue-va-phap-ly-trong-giao-dich",
    summary:
      "<p>Chuong tr�nh c?p nh?t c�c di?m m?i v? qu?n tr? thu?, h? so giao d?ch v� ki?m so�t r?i ro ph�p l� trong doanh nghi?p.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["��o t?o", "S? ki?n"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-11-01T08:00:00.000Z",
    updated_at: "2026-11-01T10:00:00.000Z",
    published_at: "2026-11-01T08:00",
    expired_at: "",
    started_at: "2026-11-18T08:30",
    ended_at: "2026-11-18T16:30",
    registration_deadline: "2026-11-15T17:00",
    location: "TP. H? Ch� Minh",
    participation_fee: "800.000 VN�",
    post_content: [
      {
        id: "section-admin-news-12-a",
        type: "text",
        position: 1,
        content:
          "<p>Kh�a h?c d�nh cho d?i ngu qu?n l�, k? to�n tru?ng v� chuy�n vi�n ph�p ch? c?n chu?n h�a quy tr�nh n?i b?.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-13",
    title: "S? ki?n - T?p hu?n NSDL�",
    slug: "su-kien-tap-huan-nsdld",
    summary:
      "<p>Bu?i t?p hu?n hu?ng d?n ngu?i s? d?ng lao d?ng c?p nh?t c�c quy d?nh th?c thi v� quy tr�nh ph?i h?p v?i b? ph?n nh�n s?.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["��o t?o", "S? ki?n"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-11-03T09:00:00.000Z",
    updated_at: "2026-11-03T09:30:00.000Z",
    published_at: "2026-11-03T09:00",
    expired_at: "",
    started_at: "2026-11-20T13:30",
    ended_at: "2026-11-20T17:00",
    registration_deadline: "2026-11-18T17:00",
    location: "H� N?i",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-13-a",
        type: "text",
        position: 1,
        content:
          "<p>N?i dung t?p hu?n t?p trung v�o c�c t�nh hu?ng thu?ng g?p trong qu� tr�nh v?n h�nh ch�nh s�ch nh�n s? v� lao d?ng.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-14",
    title: "Di?n d�n h?i vi�n: K?t n?i th? tru?ng v� chu?i cung ?ng",
    slug: "dien-dan-hoi-vien-ket-noi-thi-truong-va-chuoi-cung-ung",
    summary:
      "<p>Di?n d�n t?o kh�ng gian g?p g? gi?a doanh nghi?p s?n xu?t, don v? ph�n ph?i v� nh� cung c?p d?ch v? h? tr? th? tru?ng.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["S? ki?n", "H?i vi�n"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-11-05T08:30:00.000Z",
    updated_at: "2026-11-05T11:00:00.000Z",
    published_at: "2026-11-05T08:30",
    expired_at: "",
    started_at: "2026-11-24T08:00",
    ended_at: "2026-11-24T12:00",
    registration_deadline: "2026-11-22T17:00",
    location: "�� N?ng",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-14-a",
        type: "text",
        position: 1,
        content:
          "<p>Chuong tr�nh hu?ng d?n vi?c m? r?ng co h?i k?t n?i d?i t�c, chia s? nhu c?u th? tru?ng v� x�y d?ng chu?i cung ?ng linh ho?t hon.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-15",
    title: "Chuong tr�nh k?t n?i doanh nghi?p h?i vi�n ng�nh th?c ph?m v� b�n l?",
    slug: "chuong-trinh-ket-noi-doanh-nghiep-hoi-vien-nganh-thuc-pham-va-ban-le",
    summary:
      "<p>Bu?i k?t n?i t?o kh�ng gian gi?i thi?u s?n ph?m, chia s? nhu c?u mua h�ng v� gh�p n?i d?i t�c gi?a doanh nghi?p s?n xu?t v?i h? th?ng ph�n ph?i.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["S? ki?n", "H?i vi�n"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-11T08:15:00.000Z",
    updated_at: "2026-05-11T10:30:00.000Z",
    published_at: "2026-05-11T08:15",
    expired_at: "",
    started_at: "2026-05-22T14:00",
    ended_at: "2026-05-22T17:00",
    registration_deadline: "2026-05-20T17:00",
    location: "TP. H? Ch� Minh",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-15-a",
        type: "text",
        position: 1,
        content:
          "<p>Chuong tr�nh uu ti�n c�c nh�m doanh nghi?p dang c?n m? r?ng h? th?ng ph�n ph?i v� t�m d?i t�c d?ng h�nh t?i khu v?c ph�a Nam.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-16",
    title: "L?p d�o t?o ng?n h?n: K? nang x�y d?ng k? ho?ch x�c ti?n thuong m?i",
    slug: "lop-dao-tao-ngan-han-ky-nang-xay-dung-ke-hoach-xuc-tien-thuong-mai",
    summary:
      "<p>Kh�a h?c hu?ng d?n doanh nghi?p x�c d?nh m?c ti�u, ng�n s�ch v� c�ch tri?n khai ho?t d?ng x�c ti?n thuong m?i theo t?ng giai do?n.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["��o t?o", "S? ki?n"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-12T07:45:00.000Z",
    updated_at: "2026-05-12T09:20:00.000Z",
    published_at: "2026-05-12T07:45",
    expired_at: "",
    started_at: "2026-05-26T08:30",
    ended_at: "2026-05-26T11:30",
    registration_deadline: "2026-05-24T17:00",
    location: "Tr?c tuy?n",
    participation_fee: "350.000 VN�",
    post_content: [
      {
        id: "section-admin-news-16-a",
        type: "text",
        position: 1,
        content:
          "<p>N?i dung t?p trung v�o c?u tr�c k? ho?ch, x�y d?ng d?u vi?c uu ti�n v� l?a ch?n k�nh tri?n khai ph� h?p v?i ngu?n l?c c?a doanh nghi?p.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-17",
    title: "C�ng ty Western Coast Enterprise LTD c?n thu� mua v?t li?u x�y d?ng t?i Vi?t Nam",
    slug: "cong-ty-western-coast-enterprise-ltd-can-thue-mua-vat-lieu-xay-dung-tai-viet-nam",
    summary:
      "<p>Doanh nghi?p t�m ki?m d?i t�c cung ?ng v?t li?u x�y d?ng ?n d?nh t?i th? tru?ng Vi?t Nam d? ph?c v? k? ho?ch m? r?ng chu?i d? �n trong khu v?c.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-business-opportunity"],
    tagsearch_values: ["Co h?i kinh doanh", "K?t n?i giao thuong"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2025-11-12T08:00:00.000Z",
    updated_at: "2025-11-12T09:30:00.000Z",
    published_at: "2025-11-12T08:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. H? Ch� Minh",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-17-a",
        type: "text",
        position: 1,
        content:
          "<p>Nhu c?u t?p trung v�o nh�m v?t li?u ho�n thi?n, v?t li?u n?n m�ng v� c�c nh� cung ?ng c� kh? nang d�p ?ng don h�ng d�i h?n.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-18",
    title: "VCCI-HCM k?t n?i c�c nh� d?u tu nu?c ngo�i v?i doanh nghi?p Vi?t trong chu?i cung ?ng c�ng nghi?p",
    slug: "vcci-hcm-ket-noi-cac-nha-dau-tu-nuoc-ngoai-voi-doanh-nghiep-viet-trong-chuoi-cung-ung-cong-nghiep",
    summary:
      "<p>Chuong tr�nh gi?i thi?u danh m?c nhu c?u h?p t�c, t�m nh� cung ?ng linh ki?n v� d?i t�c gia c�ng cho nh�m doanh nghi?p FDI.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-business-opportunity"],
    tagsearch_values: ["Co h?i kinh doanh", "H?i vi�n"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2025-11-12T07:00:00.000Z",
    updated_at: "2025-11-12T08:15:00.000Z",
    published_at: "2025-11-12T07:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "B�nh Duong",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-18-a",
        type: "text",
        position: 1,
        content:
          "<p>Ho?t d?ng uu ti�n nh?ng doanh nghi?p c� nang l?c s?n xu?t ?n d?nh, minh b?ch h? so ch?t lu?ng v� s?n s�ng tham gia d�nh gi� nh� m�y.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-19",
    title: "Doanh nghi?p logistics t�m d?i t�c ph�n ph?i v� khai th�c tuy?n v?n chuy?n li�n v�ng",
    slug: "doanh-nghiep-logistics-tim-doi-tac-phan-phoi-va-khai-thac-tuyen-van-chuyen-lien-vung",
    summary:
      "<p>Th�ng tin m?i h?p t�c d�nh cho c�c doanh nghi?p c� h? th?ng kho b�i, d?i xe v� nang l?c x? l� don h�ng t?i khu v?c ph�a Nam.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-business-opportunity"],
    tagsearch_values: ["Co h?i kinh doanh", "Logistics"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2025-11-11T10:30:00.000Z",
    updated_at: "2025-11-11T11:00:00.000Z",
    published_at: "2025-11-11T10:30",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Long An",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-19-a",
        type: "text",
        position: 1,
        content:
          "<p>N?i dung h?p t�c bao g?m ph�n ph?i n?i d?a, gom h�ng xu?t kh?u v� ph�t tri?n th�m c�c di?m trung chuy?n m?i t?i khu v?c l�n c?n.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-20",
    title: "Nh?ng ch�nh s�ch m?i c� hi?u l?c t? ng�y 01/10/2026",
    slug: "nhung-chinh-sach-moi-co-hieu-luc-tu-ngay-01-10-2026",
    summary:
      "<p>T?ng h?p nhanh c�c quy d?nh m?i li�n quan d?n thu?, lao d?ng v� th? t?c h�nh ch�nh m� doanh nghi?p c?n luu � trong k? �p d?ng m?i.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-policy-law"],
    tagsearch_values: ["Ch�nh s�ch & ph�p lu?t", "Ch�nh s�ch"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2025-11-12T09:00:00.000Z",
    updated_at: "2025-11-12T09:40:00.000Z",
    published_at: "2025-11-12T09:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "H� N?i",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-20-a",
        type: "text",
        position: 1,
        content:
          "<p>B�i vi?t h? th?ng l?i c�c m?c �p d?ng, nh�m d?i tu?ng ch?u t�c d?ng v� m?t s? d?u vi?c doanh nghi?p n�n chu?n b? s?m.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-21",
    title: "Lu?t du?c s?a d?i: nhi?u quy d?nh m?i c� l?i cho doanh nghi?p",
    slug: "luat-duoc-sua-doi-nhieu-quy-dinh-moi-co-loi-cho-doanh-nghiep",
    summary:
      "<p>N?i dung c?p nh?t t?p trung v�o c�c di?m s?a d?i v? di?u ki?n kinh doanh, th? t?c h? so v� co ch? h? tr? doanh nghi?p nh? v� v?a.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-policy-law"],
    tagsearch_values: ["Ch�nh s�ch & ph�p lu?t", "Ph�p lu?t"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2025-11-12T08:30:00.000Z",
    updated_at: "2025-11-12T09:00:00.000Z",
    published_at: "2025-11-12T08:30",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "H� N?i",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-21-a",
        type: "text",
        position: 1,
        content:
          "<p>C�c thay d?i d�ng ch� � gi�p r�t ng?n th?i gian x? l� th? t?c v� m? r?ng th�m m?t s? co ch? linh ho?t cho nh� d?u tu.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-22",
    title: "B?o v? c? d�ng: c� du?c coi l� s? ki?n b?t kh? kh�ng d?i v?i doanh nghi?p",
    slug: "bao-ve-co-dong-co-duoc-coi-la-su-kien-bat-kha-khang-doi-voi-doanh-nghiep",
    summary:
      "<p>Ph�n t�ch t�nh hu?ng ph�p l� thu?ng g?p trong qu?n tr? doanh nghi?p, tr�ch nhi?m c�ng b? th�ng tin v� c�ch x�c d?nh r?i ro ph�t sinh.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-policy-law"],
    tagsearch_values: ["Ch�nh s�ch & ph�p lu?t", "Ph�p lu?t"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2025-11-12T08:00:00.000Z",
    updated_at: "2025-11-12T08:45:00.000Z",
    published_at: "2025-11-12T08:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. H? Ch� Minh",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-22-a",
        type: "text",
        position: 1,
        content:
          "<p>B�i vi?t dua ra g�c nh�n th?c ti?n v� khuy?n ngh? bu?c chu?n b? h? so n?i b? khi ph�t sinh tranh ch?p li�n quan d?n quy?n c? d�ng.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-23",
    title: "K?t n?i h?i vi�n ng�nh x�y d?ng v� v?t li?u t?i khu v?c ph�a Nam",
    slug: "ket-noi-hoi-vien-nganh-xay-dung-va-vat-lieu-tai-khu-vuc-phia-nam",
    summary:
      "<p>Ho?t d?ng k?t n?i t?p trung v�o nh�m doanh nghi?p s?n xu?t v?t li?u, thi c�ng c�ng tr�nh v� don v? tu v?n dang c?n m? r?ng m?ng lu?i h?p t�c.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-member-connection"],
    tagsearch_values: ["K?t n?i h?i vi�n", "H?i vi�n"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-13T08:00:00.000Z",
    updated_at: "2026-05-13T08:30:00.000Z",
    published_at: "2026-05-13T08:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. H? Ch� Minh",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-23-a",
        type: "text",
        position: 1,
        content:
          "<p>Chuong tr�nh gi?i thi?u nhu c?u h?p t�c, nhu c?u nh� cung ?ng v� c�c co h?i tri?n khai d? �n chung trong giai do?n t?i.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-24",
    title: "Kh�ng gian g?p g? h?i vi�n m?i trong m?ng lu?i doanh nghi?p d?ch v?",
    slug: "khong-gian-gap-go-hoi-vien-moi-trong-mang-luoi-doanh-nghiep-dich-vu",
    summary:
      "<p>Bu?i networking quy t? d?i di?n doanh nghi?p d?ch v?, thuong m?i v� don v? tu v?n c�ng chia s? nhu c?u k?t n?i kh�ch h�ng.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-member-connection"],
    tagsearch_values: ["K?t n?i h?i vi�n", "Networking"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-05-12T15:00:00.000Z",
    updated_at: "2026-05-12T16:15:00.000Z",
    published_at: "2026-05-12T15:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "TP. H? Ch� Minh",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-24-a",
        type: "text",
        position: 1,
        content:
          "<p>N?i dung ch� tr?ng v�o vi?c t?o di?m ch?m ban d?u gi?a c�c h?i vi�n m?i v?i c?ng d?ng doanh nghi?p hi?n c� c?a VCCI-HCM.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-25",
    title: "Chuong tr�nh chia s? co h?i h?p t�c gi?a h?i vi�n c�ng ngh? v� doanh nghi?p truy?n th?ng",
    slug: "chuong-trinh-chia-se-co-hoi-hop-tac-giua-hoi-vien-cong-nghe-va-doanh-nghiep-truyen-thong",
    summary:
      "<p>Chu?i ho?t d?ng gi�p doanh nghi?p c�ng ngh? gi?i thi?u gi?i ph�p s? v� t�m d?i t�c ?ng d?ng trong s?n xu?t, thuong m?i v� d?ch v?.</p>",
    type: "tintuc",
    header_category_id: "activity-news",
    category_ids: ["cat-member-connection"],
    tagsearch_values: ["K?t n?i h?i vi�n", "Chuy?n d?i s?"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-11T16:00:00.000Z",
    updated_at: "2026-05-11T17:00:00.000Z",
    published_at: "2026-05-11T16:00",
    expired_at: "",
    started_at: "",
    ended_at: "",
    registration_deadline: "",
    location: "Tr?c tuy?n",
    participation_fee: "",
    post_content: [
      {
        id: "section-admin-news-25-a",
        type: "text",
        position: 1,
        content:
          "<p>Chuong tr�nh m? ra nhi?u phi�n gi?i thi?u nhanh, matching nhu c?u v� trao d?i m� h�nh tri?n khai ph� h?p theo t?ng nh�m ng�nh.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-26",
    title: "Phi�n k?t n?i nh� mua h�ng qu?c t? v?i doanh nghi?p h?i vi�n ng�nh g?",
    slug: "phien-ket-noi-nha-mua-hang-quoc-te-voi-doanh-nghiep-hoi-vien-nganh-go",
    summary:
      "<p>Chuong tr�nh t?p trung v�o nhu c?u sourcing s?n ph?m n?i th?t, v?t li?u ho�n thi?n v� nh�m doanh nghi?p c� nang l?c xu?t kh?u t?i khu v?c ph�a Nam.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["S? ki?n", "H?i vi�n"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-13T09:00:00.000Z",
    updated_at: "2026-05-13T10:15:00.000Z",
    published_at: "2026-05-13T09:00",
    expired_at: "",
    started_at: "2026-05-29T08:30",
    ended_at: "2026-05-29T11:30",
    registration_deadline: "2026-05-27T17:00",
    location: "TP. H? Ch� Minh",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-26-a",
        type: "text",
        position: 1,
        content:
          "<p>Ho?t d?ng uu ti�n c�c doanh nghi?p c� b? h? so nang l?c xu?t kh?u r� r�ng v� s?n ph?m ph� h?p v?i nh�m nh� mua h�ng dang m? r?ng ngu?n cung t?i Vi?t Nam.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-27",
    title: "H?i th?o chuy�n d? logistics l?nh cho doanh nghi?p th?c ph?m v� n�ng s?n",
    slug: "hoi-thao-chuyen-de-logistics-lanh-cho-doanh-nghiep-thuc-pham-va-nong-san",
    summary:
      "<p>Chu?i chia s? c?p nh?t xu hu?ng b?o qu?n l?nh, t?i uu chi ph� v?n chuy?n v� ti�u chu?n ch?t lu?ng trong chu?i cung ?ng th?c ph?m.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["S? ki?n", "Chuy�n d?"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[0]),
    is_hidden: false,
    created_at: "2026-05-14T07:45:00.000Z",
    updated_at: "2026-05-14T08:20:00.000Z",
    published_at: "2026-05-14T07:45",
    expired_at: "",
    started_at: "2026-05-30T13:30",
    ended_at: "2026-05-30T16:30",
    registration_deadline: "2026-05-28T17:00",
    location: "C?n Tho",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-27-a",
        type: "text",
        position: 1,
        content:
          "<p>Phi�n th?o lu?n k?t n?i doanh nghi?p s?n xu?t v?i don v? kho v?n, chu?i b�n l? v� nh� cung c?p gi?i ph�p ki?m so�t nhi?t d? trong b?o qu?n.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-28",
    title: "Kh�a d�o t?o th?c h�nh x�y d?ng h? so nang l?c s? cho doanh nghi?p h?i vi�n",
    slug: "khoa-dao-tao-thuc-hanh-xay-dung-ho-so-nang-luc-so-cho-doanh-nghiep-hoi-vien",
    summary:
      "<p>Kh�a h?c hu?ng d?n doanh nghi?p chu?n h�a profile gi?i thi?u, t�i li?u b�n h�ng v� c�ng c? tr�nh b�y nang l?c tr�n m�i tru?ng s?.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["��o t?o", "H?i vi�n"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[3]),
    is_hidden: false,
    created_at: "2026-05-14T10:10:00.000Z",
    updated_at: "2026-05-14T10:50:00.000Z",
    published_at: "2026-05-14T10:10",
    expired_at: "",
    started_at: "2026-06-03T08:30",
    ended_at: "2026-06-03T11:30",
    registration_deadline: "2026-06-01T17:00",
    location: "Tr?c tuy?n",
    participation_fee: "300.000 VN�",
    post_content: [
      {
        id: "section-admin-news-28-a",
        type: "text",
        position: 1,
        content:
          "<p>N?i dung t?p trung v�o c�c ph?n c?t l�i c?a b? h? so gi?i thi?u doanh nghi?p, h�nh ?nh minh h?a v� c�ch tr�nh b�y th�ng tin s�c t�ch d? ch�o d?i t�c.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
  {
    id: "admin-news-29",
    title: "Di?n d�n k?t n?i t�i ch�nh xanh cho doanh nghi?p s?n xu?t v� xu?t kh?u",
    slug: "dien-dan-ket-noi-tai-chinh-xanh-cho-doanh-nghiep-san-xuat-va-xuat-khau",
    summary:
      "<p>Chuong tr�nh c?p nh?t c�c ngu?n v?n xanh, ti�u ch� d�nh gi� d? �n v� gi?i ph�p chu?n b? h? so ti?p c?n t�i ch�nh cho doanh nghi?p.</p>",
    type: "tintuc",
    header_category_id: "activity-events",
    category_ids: ["cat-event"],
    tagsearch_values: ["S? ki?n", "T�i ch�nh xanh"],
    is_featured: false,
    thumbnail: toImageRef(mediaSeed[2]),
    is_hidden: false,
    created_at: "2026-05-14T11:20:00.000Z",
    updated_at: "2026-05-14T12:00:00.000Z",
    published_at: "2026-05-14T11:20",
    expired_at: "",
    started_at: "2026-06-05T14:00",
    ended_at: "2026-06-05T17:00",
    registration_deadline: "2026-06-03T17:00",
    location: "H� N?i",
    participation_fee: "Mi?n ph�",
    post_content: [
      {
        id: "section-admin-news-29-a",
        type: "text",
        position: 1,
        content:
          "<p>Di?n d�n t?o nh?p k?t n?i gi?a doanh nghi?p, ng�n h�ng v� don v? tu v?n d? trao d?i v? di?u ki?n ti?p c?n c�c chuong tr�nh t�i ch�nh xanh.</p>",
        image_columns: 2,
        image_rows: 2,
        images: [],
      },
    ],
  },
];

export function slugifyAdminNews(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/d/g, "d")
    .replace(/�/g, "D")
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
  return items
    .map((item) => normalizeSeedMediaLabels(item))
    .sort((left, right) => {
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
    if (!Array.isArray(parsed)) {
      return getAdminMediaSeed();
    }

    const normalizedItems = normalizeAdminMediaItems(parsed);
    const hasNormalizedChanges =
      JSON.stringify(parsed) !== JSON.stringify(normalizedItems);

    if (hasNormalizedChanges) {
      window.localStorage.setItem(
        ADMIN_MEDIA_STORAGE_KEY,
        JSON.stringify(normalizedItems),
      );
    }

    return normalizedItems;
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
