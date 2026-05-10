"use client";

import { toSlug } from "@/mockdata/header-config";

export interface HeaderCategoryPostItem {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  published_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const HEADER_CATEGORY_POSTS_STORAGE_KEY =
  "vcci-news.header-category-posts.data.v1";

export const headerCategoryPostSeed: HeaderCategoryPostItem[] = [
  {
    id: "header-post-intro-about",
    category_id: "intro-about",
    title: "VCCI News và định hướng phát triển nội dung số",
    slug: "vcci-news-va-dinh-huong-phat-trien-noi-dung-so",
    excerpt:
      "Tổng quan về định hướng vận hành, tổ chức chuyên mục và kế hoạch phát triển nội dung của VCCI News.",
    content:
      "<p>VCCI News tập trung phát triển hệ sinh thái nội dung gắn với hoạt động hội viên, doanh nghiệp và chuyển đổi số.</p><p>Trang này giúp đội ngũ quản trị cấu hình nhanh các điểm chạm chính trên website.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-05-01",
    is_active: true,
    created_at: "2026-05-01T09:00:00.000Z",
    updated_at: "2026-05-01T09:00:00.000Z",
  },
  {
    id: "header-post-activity-news-01",
    category_id: "activity-news",
    title: "VCCI tổ chức hội thảo kết nối doanh nghiệp khu vực phía Nam",
    slug: "vcci-to-chuc-hoi-thao-ket-noi-doanh-nghiep-khu-vuc-phia-nam",
    excerpt:
      "Sự kiện tập trung vào giải pháp mở rộng thị trường và tăng năng lực kết nối cho doanh nghiệp hội viên.",
    content:
      "<p>Hội thảo quy tụ nhiều doanh nghiệp tại TP.HCM và các tỉnh lân cận nhằm chia sẻ kinh nghiệm chuyển đổi số, mở rộng xuất khẩu và nâng cao năng lực quản trị.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-05-07",
    is_active: true,
    created_at: "2026-05-07T08:15:00.000Z",
    updated_at: "2026-05-07T08:15:00.000Z",
  },
  {
    id: "header-post-activity-news-02",
    category_id: "activity-news",
    title: "Bản tin tuần: xu hướng đầu tư xanh trong cộng đồng doanh nghiệp",
    slug: "ban-tin-tuan-xu-huong-dau-tu-xanh-trong-cong-dong-doanh-nghiep",
    excerpt:
      "Điểm lại các chuyển động đáng chú ý liên quan đến ESG, đầu tư xanh và năng lực cạnh tranh bền vững.",
    content:
      "<p>Bản tin tuần tổng hợp các chính sách mới, tín hiệu thị trường và hoạt động hỗ trợ doanh nghiệp hướng đến tăng trưởng xanh.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-05-09",
    is_active: true,
    created_at: "2026-05-09T03:20:00.000Z",
    updated_at: "2026-05-09T03:20:00.000Z",
  },
  {
    id: "header-post-activity-events-01",
    category_id: "activity-events",
    title: "Lịch sự kiện xúc tiến thương mại tháng 5",
    slug: "lich-su-kien-xuc-tien-thuong-mai-thang-5",
    excerpt:
      "Danh sách sự kiện nổi bật dành cho hội viên trong tháng 5 với thông tin thời gian và nội dung chính.",
    content:
      "<p>Chuỗi sự kiện tháng 5 tập trung vào xúc tiến thương mại, kết nối đối tác và đào tạo năng lực điều hành cho doanh nghiệp hội viên.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-05-05",
    is_active: false,
    created_at: "2026-05-05T10:30:00.000Z",
    updated_at: "2026-05-05T10:30:00.000Z",
  },
  {
    id: "header-post-library-highlight-01",
    category_id: "library-highlight",
    title: "Album ảnh hoạt động tiêu biểu quý II",
    slug: "album-anh-hoat-dong-tieu-bieu-quy-ii",
    excerpt:
      "Tổng hợp những hình ảnh nổi bật từ các chương trình, hội thảo và sự kiện kết nối doanh nghiệp.",
    content:
      "<p>Album giới thiệu các hình ảnh tiêu biểu từ chuỗi hoạt động gần đây của VCCI News và hệ sinh thái hội viên.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-05-03",
    is_active: true,
    created_at: "2026-05-03T06:45:00.000Z",
    updated_at: "2026-05-03T06:45:00.000Z",
  },
];

export interface HeaderCategoryPostFormValues {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  published_at: string;
  is_active: boolean;
}

export const EMPTY_HEADER_CATEGORY_POST_FORM: HeaderCategoryPostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: "",
  published_at: "",
  is_active: true,
};

export function normalizeHeaderCategoryPosts(items: HeaderCategoryPostItem[]) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.published_at || left.updated_at).getTime();
    const rightTime = new Date(right.published_at || right.updated_at).getTime();

    return rightTime - leftTime || right.updated_at.localeCompare(left.updated_at);
  });
}

export function createHeaderCategoryPostId() {
  return `header-post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function makeHeaderCategoryPostSlug(title: string) {
  return toSlug(title);
}

export function getHeaderCategoryPostSeed() {
  return normalizeHeaderCategoryPosts(headerCategoryPostSeed);
}
