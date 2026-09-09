import type { Metadata } from "next";
import links from "@links/index";
import {
  getDynamicPostSeoImage,
  getDynamicPostExcerpt,
  stripHtml,
} from "./templates/data";
import { getApiV10Post, getApiV10PostId } from "@/api/vcci-news/endpoints/post";
import type { DynamicPostItem } from "./templates/types";
import { fetchCmsCategories } from "@/lib/api/cms-admin";
import DynamicPageClient from "./DynamicPageClient";

const STATIC_PAGE_SLUGS = new Set([
  "an-pham", "thu-vien-tai-lieu", "ve-vcci-hcm", "dich-vu-cung-cap",
  "dang-ky-hoi-vien", "ho-so-thi-truong", "loi-ich-hoi-vien-vcci",
  "phap-che", "giay-chung-nhan-gcn-va-chung-tu-thuong-mai-cttm",
  "quy-trinh-tiep-nhan-ho-so-cap-gcn-va-xac-nhan-cttm",
  "bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm", "phi-cap-gcn-va-xac-nhan-cttm",
  "diem-cap-va-thoi-gian-cap-gcn-va-xac-nhan-cttm", "thong-tin-lien-he",
  "danh-ba-hoi-vien", "search", "site-map", "video",
]);

const SITE_NAME = "VCCI HCM";
const SITE_TAGLINE = "Liên đoàn Thương mại và Công nghiệp Việt Nam - Chi nhánh khu vực TP.HCM";

const STATIC_PAGE_METADATA: Record<string, { title: string; description: string }> = {
  "an-pham": {
    title: "Ấn phẩm",
    description:
      "Tổng hợp các ấn phẩm, báo cáo và ấn phẩm định kỳ do VCCI-HCM phát hành, cập nhật thông tin doanh nghiệp và thị trường.",
  },
  "thu-vien-tai-lieu": {
    title: "Thư viện tài liệu",
    description:
      "Thư viện tài liệu VCCI-HCM: tài liệu nghiên cứu, báo cáo thị trường, văn bản pháp lý và ấn phẩm hỗ trợ doanh nghiệp.",
  },
  "ve-vcci-hcm": {
    title: "Về VCCI HCM",
    description:
      "Giới thiệu về Liên đoàn Thương mại và Công nghiệp Việt Nam - Chi nhánh khu vực TP.HCM: tầm nhìn, sứ mệnh, giá trị cốt lõi và lĩnh vực hoạt động.",
  },
  "dich-vu-cung-cap": {
    title: "Dịch vụ cung cấp",
    description:
      "Các dịch vụ VCCI-HCM cung cấp cho hội viên và doanh nghiệp: sự kiện, đào tạo, xúc tiến thương mại, cho thuê văn phòng và hỗ trợ pháp lý.",
  },
  "dang-ky-hoi-vien": {
    title: "Đăng ký hội viên",
    description:
      "Hướng dẫn hồ sơ, điều kiện và phí đăng ký trở thành hội viên chính thức của VCCI, cùng các biểu mẫu đính kèm.",
  },
  "ho-so-thi-truong": {
    title: "Hồ sơ thị trường",
    description:
      "Hồ sơ thị trường các khu vực Đông Nam Á, Đông Bắc Á, Âu - Mỹ, Trung Đông - Châu Phi hỗ trợ doanh nghiệp tiếp cận cơ hội xuất khẩu và đối tác.",
  },
  "loi-ich-hoi-vien-vcci": {
    title: "Lợi ích hội viên VCCI",
    description:
      "Các lợi ích khi trở thành hội viên VCCI-HCM: tiếng nói đại diện, nhận diện thương hiệu, hỗ trợ pháp lý và ưu đãi dịch vụ.",
  },
  "phap-che": {
    title: "Pháp chế",
    description:
      "Dịch vụ pháp chế của VCCI-HCM: góp ý xây dựng pháp luật, tư vấn chuyên sâu, dịch vụ thương mại và đào tạo nghiệp vụ pháp lý.",
  },
  "giay-chung-nhan-gcn-va-chung-tu-thuong-mai-cttm": {
    title: "Giấy chứng nhận GCN và chứng từ thương mại CTTM",
    description:
      "Giới thiệu về Giấy chứng nhận của VCCI và xác nhận Chứng từ thương mại (CTTM): định nghĩa, đơn vị cấp và phạm vi áp dụng.",
  },
  "quy-trinh-tiep-nhan-ho-so-cap-gcn-va-xac-nhan-cttm": {
    title: "Quy trình tiếp nhận hồ sơ cấp GCN và xác nhận CTTM",
    description:
      "Quy trình 5 bước tiếp nhận hồ sơ cấp Giấy chứng nhận (GCN) và xác nhận Chứng từ thương mại (CTTM) trên hệ thống COVCCI.",
  },
  "bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm": {
    title: "Biểu mẫu GCN và nội dung khai báo GCN, CTTM",
    description:
      "Biểu mẫu và hướng dẫn nội dung khai báo Giấy chứng nhận (GCN), Chứng từ thương mại (CTTM) do VCCI cấp.",
  },
  "phi-cap-gcn-va-xac-nhan-cttm": {
    title: "Phí cấp GCN và xác nhận CTTM",
    description:
      "Bảng giá dịch vụ cấp Giấy chứng nhận (GCN) và xác nhận Chứng từ thương mại (CTTM) của VCCI.",
  },
  "diem-cap-va-thoi-gian-cap-gcn-va-xac-nhan-cttm": {
    title: "Điểm cấp và thời gian cấp GCN và xác nhận CTTM",
    description:
      "Địa chỉ, điện thoại và thời gian làm việc của các điểm cấp Giấy chứng nhận (GCN) và xác nhận Chứng từ thương mại (CTTM).",
  },
  "thong-tin-lien-he": {
    title: "Thông tin liên hệ",
    description:
      "Thông tin liên hệ Phòng Pháp chế và xác nhận Chứng từ thương mại - VCCI-HCM: địa chỉ, điện thoại và email.",
  },
  "danh-ba-hoi-vien": {
    title: "Danh bạ hội viên",
    description:
      "Danh bạ hội viên VCCI-HCM: tra cứu thông tin doanh nghiệp hội viên và kết nối đối tác kinh doanh.",
  },
  "search": {
    title: "Tìm kiếm",
    description:
      "Tìm kiếm tin tức, bài viết và nội dung trên website VCCI-HCM theo từ khóa.",
  },
  "site-map": {
    title: "Sơ đồ site",
    description:
      "Sơ đồ tổng quan các chuyên mục và trang trên website VCCI-HCM, hỗ trợ điều hướng nhanh.",
  },
  "video": {
    title: "Video",
    description:
      "Thư viện video VCCI-HCM: các phóng sự, sự kiện, hội thảo và hoạt động xúc tiến thương mại.",
  },
};

/**
 * Build an absolute og:image URL. Relative paths (e.g. "/thumbnail.png") are
 * resolved against the site origin so social crawlers always receive an
 * absolute URL. Absolute URLs are returned as-is.
 */
function toAbsoluteSeoImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const origin = (links.siteURL || "").replace(/\/+$/, "");
  return `${origin}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

type GenerateMetadataArgs = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ id?: string; categoryId?: string }>;
};

/**
 * Verify that a remote image URL actually serves an image (not an HTML 404
 * page or redirect). Returns true for relative paths and on network errors
 * (benefit of the doubt) so we only fall back when we're certain the URL is
 * not an image.
 */
async function isRemoteImageValid(url: string): Promise<boolean> {
  if (!url || !/^https?:\/\//i.test(url)) return true;

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });

    // If the server rejects HEAD, give the benefit of the doubt
    if (!response.ok) return true;

    const contentType = response.headers.get("content-type") ?? "";
    return contentType.startsWith("image/");
  } catch {
    return true;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: GenerateMetadataArgs): Promise<Metadata> {
  const { slug } = await params;
  const { id } = await searchParams;

  const path = `/${(slug ?? []).join("/")}`;
  const postId = id?.trim() ?? "";
  const endingSlug = slug?.length ? String(slug[slug.length - 1] ?? "") : "";

  if (STATIC_PAGE_SLUGS.has(endingSlug)) {
    const pageMeta = STATIC_PAGE_METADATA[endingSlug] ?? {
      title: SITE_NAME,
      description: SITE_TAGLINE,
    };
    return {
      title: pageMeta.title,
      description: pageMeta.description,
      alternates: { canonical: `${links.siteURL.replace(/\/+$/, "")}${path}` },
    };
  }

  // Try to find a matching category for non-post routes
  let categoryTitle = "";
  if (!postId) {
    try {
      const categories = await fetchCmsCategories();
      const matched = categories.find((item) => item.url === path || `/${item.slug}` === path);
      if (matched) categoryTitle = matched.name;
    } catch {
      // ignore
    }
  }

  let post: DynamicPostItem | null = null;
  try {
    if (postId) {
      const response = await getApiV10PostId(postId).catch(() => null);
      post = (response?.responseData ?? null) as unknown as DynamicPostItem | null;
    } else {
      const slugFromPath = path.split("/").filter(Boolean).pop() ?? "";
      if (slugFromPath) {
        const response = await getApiV10Post({
          page: 1,
          pageSize: 1,
          filters: `slug==${slugFromPath},is_hidden==false,is_active==true,type==news`,
        }).catch(() => null);
        const rows = response?.responseData?.rows ?? [];
        post = (rows[0] as unknown as DynamicPostItem) ?? null;
      }
    }
  } catch {
    post = null;
  }

  if (!post || !post.title) {
    const title = categoryTitle || "VCCI HCM";
    return {
      title,
      description: "Liên đoàn Thương mại và Công nghiệp Việt Nam - Chi nhánh khu vực TP.HCM",
      alternates: { canonical: `${links.siteURL.replace(/\/+$/, "")}${path}` },
    };
  }

  const title = post.title;
  const description =
    stripHtml(post.summary) ||
    getDynamicPostExcerpt(post).slice(0, 160) ||
    "Tin tức từ VCCI HCM";
  const rawImageUrl = getDynamicPostSeoImage(post);
  const isImageValid = await isRemoteImageValid(rawImageUrl);
  const imageUrl = toAbsoluteSeoImageUrl(
    isImageValid ? rawImageUrl : "/thumbnail.png",
  );
  const articleUrl = `${links.siteURL.replace(/\/+$/, "")}${path}`;

  return {
    title,
    description,
    alternates: { canonical: articleUrl },
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName: "VCCI HCM",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function Page() {
  return <DynamicPageClient />;
}