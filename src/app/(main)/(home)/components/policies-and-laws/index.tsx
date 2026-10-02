import { getApiV10Post } from "@/api/vcci-news/endpoints/post";
import type { RawPost } from "@/api/vcci-news/types/post-raw";
import type { PagedResult } from "@/api/vcci-news/types/paged-result";
import {
  buildPostLink,
  normalizeLink,
} from "@/lib/utils/post";
import { MOCK_HOME_POSTS } from "@/mockdata/home-posts";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const CATEGORY_ID = "cc448be9-b9ea-46a8-aa7b-0584803330e8";

const SECTION_LINK_FALLBACK = "/thong-tin-truyen-thong/thong-tin-chinh-sach-va-phap-luat";

const SECTION_PARAMS = {
  page: 1,
  pageSize: 4,
  sortField: "created_at",
  sortOrder: "desc",
  priorityFeatured: false,
  filters: [
    `category.id==${CATEGORY_ID}`,
    "is_hidden==false",
    "is_active==true",
    "type==news",
  ].join(","),
} as const;

/** Item đã chuẩn hóa mà component cần để render. */
type PolicyAndLawsItem = {
  id: string;
  title: string;
  externalLink: string;
  createdAt: string;
  publishedAt: string;
};


const toPolicyAndLawsItem = (post: RawPost): PolicyAndLawsItem => {
  const title = String(post.title ?? "").trim();

  return {
    id: String(post.id ?? ""),
    title,
    externalLink: buildPostLink(
      post.slug ? `/${post.slug}` : undefined,
      post.id ? String(post.id) : "",
      "#",
    ),
    createdAt: String(post.created_at ?? ""),
    publishedAt: String(post.published_at ?? post.release_at ?? post.created_at ?? ""),
  };
};

/** Đọc URL category "Chính sách và Pháp luật" từ bài viết đầu tiên (nếu có). */
const resolveSectionLink = (posts: RawPost[]) => {
  const categoryUrl = posts[0]?.categories?.find(
    (category) => category?.url && category.url !== "#",
  )?.url;

  return categoryUrl ? normalizeLink(categoryUrl) : SECTION_LINK_FALLBACK;
};


const fetchPolicyAndLawsPosts = async (): Promise<{
  posts: PolicyAndLawsItem[];
  sectionLink: string;
}> => {
  try {
    const response = await getApiV10Post(SECTION_PARAMS);
    const rows =
      (response as PagedResult<RawPost> | undefined)?.responseData?.rows ?? [];

    if (rows.length === 0) throw new Error("Empty rows");

    return {
      posts: rows.map(toPolicyAndLawsItem),
      sectionLink: resolveSectionLink(rows),
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      "[PolicyAndLaws] CMS unavailable, falling back to mock data",
      error,
    );

    const mockPosts = MOCK_HOME_POSTS.filter((item) =>
      item.categories.some((category) => category.id === CATEGORY_ID),
    );

    return {
      posts: mockPosts.map((item) => ({
        id: item.id,
        title: item.title,
        externalLink: item.externalLink,
        createdAt: item.createdAt,
        publishedAt: item.publishedAt,
      })),
      sectionLink:
        mockPosts[0]?.categories.find(
          (category) => category.id === CATEGORY_ID && category.url !== "#",
        )?.url ?? SECTION_LINK_FALLBACK,
    };
  }
};

export function PolicyAndLawsSkeleton() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="client-section-title uppercase text-[#24469c]">
            Chính sách & pháp luật
          </h2>
          <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
        </div>
        <ChevronRight className="h-5 w-5 text-[#24469c]" />
      </div>

      <div className="flex min-h-[270px] flex-1 flex-col gap-2.5">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={`policy-skeleton-${index}`}
            className={`flex min-h-[58px] gap-3 rounded-[16px] px-0.5 py-1 ${index === 0 ? "pt-0.5" : ""}`}
          >
            <span className="mt-1 h-[40px] w-[2px] shrink-0 rounded-full bg-[#f7b500]/40" />
            <div className="min-w-0 flex-1">
              <div className="h-5 w-5/6 animate-pulse rounded bg-[#eef3fb]" />
              <div className="mt-1.5 h-4 w-24 animate-pulse rounded bg-[#f4f7fb]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function PolicyAndLaws() {
  const { posts, sectionLink } = await fetchPolicyAndLawsPosts();
  const listSlots = Array.from({ length: 4 }, (_, index) => posts[index] ?? null);

  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="client-section-title uppercase text-[#24469c]">
            Chính sách & pháp luật
          </h2>
          <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
        </div>

        <Link
          href={sectionLink}
          className="text-[#24469c] transition-colors hover:text-[#1b55a1]"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex min-h-[270px] flex-1 flex-col gap-2.5">
        {listSlots.map((item, index) =>
          item ? (
            <Link
              key={item.id}
              href={item.externalLink}
              className={`group flex min-h-[58px] gap-3 rounded-[16px] pr-4 py-3 transition-all duration-200 hover:bg-[#f5f7fb] hover:shadow-[0_10px_24px_rgba(36,70,156,0.08)] ${index === 0 ? "pt-3.5" : ""
                }`}
            >
              <span className="mt-1 h-[40px] w-[2px] shrink-0 rounded-full bg-[#f7b500] transition-opacity duration-200 group-hover:opacity-0" />

              <div className="hidden min-w-0 group-hover:block">
                <h3 className="line-clamp-2 text-[15px] font-bold leading-[1.45] text-[#264798] md:text-[16px]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-[#9aa8c1]">
                  {dayjs(item.publishedAt || item.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>

              <div className="min-w-0 group-hover:hidden">
                <h3 className="line-clamp-2 text-[15px] leading-[1.45] text-[#264798] md:text-[16px]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-[#9aa8c1]">
                  {dayjs(item.publishedAt || item.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>
            </Link>
          ) : (
            <div
              key={`policy-placeholder-${index}`}
              className={`flex min-h-[58px] gap-3 rounded-[16px] px-0.5 py-1 ${index === 0 ? "pt-0.5" : ""}`}
            >
              <span className="mt-1 h-[40px] w-[2px] shrink-0 rounded-full bg-[#f7b500]/40" />
              <div className="min-w-0 flex-1">
                <div className="h-5 w-5/6 rounded bg-[#eef3fb]" />
                <div className="mt-1.5 h-4 w-24 rounded bg-[#f4f7fb]" />
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
