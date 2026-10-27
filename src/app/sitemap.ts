import type { MetadataRoute } from "next";
import links from "@links/index";
import { getApiV10Category } from "@/api/vcci-news/endpoints/category";
import { getApiV10Post } from "@/api/vcci-news/endpoints/post";

const SITE_URL = links.siteURL.replace(/\/+$/, "");

const STATIC_PAGE_SLUGS = [
  "an-pham",
  "thu-vien-tai-lieu",
  "ve-vcci-hcm",
  "dich-vu-cung-cap",
  "dang-ky-hoi-vien",
  "ho-so-thi-truong",
  "loi-ich-hoi-vien-vcci",
  "phap-che",
  "giay-chung-nhan-gcn-va-chung-tu-thuong-mai-cttm",
  "quy-trinh-tiep-nhan-ho-so-cap-gcn-va-xac-nhan-cttm",
  "bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm",
  "phi-cap-gcn-va-xac-nhan-cttm",
  "diem-cap-va-thoi-gian-cap-gcn-va-xac-nhan-cttm",
  "thong-tin-lien-he",
  "danh-ba-hoi-vien",
  "site-map",
  "video",
];

const normalizePath = (value?: string | null) => {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
};

const toIso = (value?: string | null) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

type CategoryRow = {
  id: string;
  name?: string | null;
  slug?: string | null;
  url?: string | null;
  type?: string | null;
  updated_at?: string | null;
};

type PostRow = {
  id?: string | null;
  slug?: string | null;
  title?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
};

type PagedRows<T> = {
  responseData?: {
    count?: number;
    rows?: T[];
  };
};

// Chia nhỏ request để tránh nginx trả 504 khi lấy quá nhiều bản ghi một lúc
const POST_PAGE_SIZE = 500;
const POST_MAX_PAGES = 100; // đủ cho 50.000 bài viết
const POST_PAGE_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchPostPage = async (page: number): Promise<PagedRows<PostRow> | null> => {
  for (let attempt = 1; attempt <= POST_PAGE_RETRIES; attempt++) {
    try {
      return (await getApiV10Post({
        page,
        pageSize: POST_PAGE_SIZE,
        sortField: "published_at",
        sortOrder: "desc",
        filters: "is_hidden==false,is_active==true,type==news",
      })) as unknown as PagedRows<PostRow>;
    } catch (error) {
      console.warn(`[sitemap] Failed to fetch posts page ${page} (attempt ${attempt}/${POST_PAGE_RETRIES})`, error);
      if (attempt < POST_PAGE_RETRIES) await sleep(RETRY_DELAY_MS);
    }
  }
  return null;
};

const fetchAllNewsPosts = async (): Promise<PostRow[]> => {
  const all: PostRow[] = [];

  for (let page = 1; page <= POST_MAX_PAGES; page++) {
    const response = await fetchPostPage(page);
    if (!response) break;

    const rows = response?.responseData?.rows ?? [];
    all.push(...rows);

    const count = Number(response?.responseData?.count ?? 0);
    if (rows.length < POST_PAGE_SIZE || (count > 0 && all.length >= count)) break;
  }

  return all;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Trang tĩnh
  for (const slug of STATIC_PAGE_SLUGS) {
    entries.push({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Danh mục + bài viết (chạy song song)
  const [categoryResponse, posts] = await Promise.all([
    getApiV10Category({
      page: 1,
      pageSize: 200,
      sortField: "sort_order",
      sortOrder: "asc",
    }).catch(() => null),
    fetchAllNewsPosts(),
  ]);

  const categoryRows =
    ((categoryResponse as unknown as PagedRows<CategoryRow> | null)?.responseData?.rows ?? []) as CategoryRow[];

  const seenCategoryPaths = new Set<string>();
  for (const cat of categoryRows) {
    if (!cat.id || !cat.url) continue;
    const path = normalizePath(cat.url);
    if (path === "/" || seenCategoryPaths.has(path)) continue;
    seenCategoryPaths.add(path);

    entries.push({
      url: `${SITE_URL}${path}`,
      lastModified: toIso(cat.updated_at) ?? now,
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  const seenPostSlugs = new Set<string>();
  for (const post of posts) {
    const slug = post.slug?.trim();
    if (!slug || !post.id || !post.title) continue;
    if (seenPostSlugs.has(slug)) continue;
    seenPostSlugs.add(slug);

    entries.push({
      url: `${SITE_URL}/${slug}`,
      lastModified: toIso(post.updated_at) ?? toIso(post.published_at) ?? toIso(post.published_at) ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
