"use client";

import {
  useGetApiV10Post,
} from "@/api/vcci-news/endpoints/post";
import type { RawPostWithThumbnail } from "@/api/vcci-news/types/post-raw";
import {
  buildPostLink,
  normalizeLink,
  resolveAssetUrl,
} from "@/lib/utils/post";
import { MOCK_HOME_POSTS } from "@/mockdata/home-posts";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const KET_NOI_HOI_VIEN_CATEGORY_ID = "a37b8a02-e8b3-42ce-9225-6dae460fed99";
const SECTION_LINK_FALLBACK = "/hoi-vien/ket-noi-hoi-vien";
const MEMBER_CONNECTION_FALLBACK_IMAGE = "/home/20-2048x1365.webp";
const PAGE_SIZE = 2;

/** Params lấy 2 bài "Kết nối hội viên" — sort & filter ở BE. */
const CONNECTION_POSTS_PARAMS = {
  page: 1,
  pageSize: PAGE_SIZE,
  sortField: "created_at",
  sortOrder: "desc",
  priorityFeatured: false,
  filters: [
    `category.id==${KET_NOI_HOI_VIEN_CATEGORY_ID}`,
    "is_hidden==false",
    "is_active==true",
    "type==news",
  ].join(","),
} as const;

type RawConnectionPost = RawPostWithThumbnail & {
};

export type MemberConnectionPost = {
  id: string;
  title: string;
  externalLink: string;
  createdAt: string;
  publishedAt: string;
  categoryName: string;
  thumbnail: { url: string; alt: string } | null;
};


const toConnectionPost = (post: RawConnectionPost): MemberConnectionPost => {
  const title = String(post.title ?? "").trim();
  const thumbnailPath = post.thumbnail?.path ?? post.thumbnail?.original ?? null;

  return {
    id: String(post.id ?? ""),
    title,
    externalLink: buildPostLink(
      post.slug ? `/${post.slug}` : (title ? `/${title}` : undefined),
      post.id ? String(post.id) : "",
    ),
    createdAt: String(post.created_at ?? ""),
    publishedAt: String(post.published_at ?? post.release_at ?? post.created_at ?? ""),
    categoryName: String(post.categories?.[0]?.name ?? ""),
    thumbnail: thumbnailPath
      ? { url: resolveAssetUrl(thumbnailPath), alt: title }
      : null,
  };
};

/** Link danh mục Kết nối hội viên từ chính posts, fallback nếu không có. */
const resolveSectionLink = (posts: RawConnectionPost[]) => {
  for (const post of posts) {
    const category = post.categories?.find(
      (item) => item?.id === KET_NOI_HOI_VIEN_CATEGORY_ID && item?.url && item.url !== "#",
    );
    if (category?.url) return normalizeLink(category.url, SECTION_LINK_FALLBACK);
  }
  return SECTION_LINK_FALLBACK;
};

const toMockConnectionPosts = (): MemberConnectionPost[] =>
  MOCK_HOME_POSTS.filter((item) =>
    item.categories.some((category) => category.id === KET_NOI_HOI_VIEN_CATEGORY_ID),
  )
    .slice(0, PAGE_SIZE)
    .map((item) => ({
      id: item.id,
      title: item.title,
      externalLink: item.externalLink,
      createdAt: item.createdAt,
      publishedAt: item.publishedAt,
      categoryName: item.categories[0]?.name ?? "",
      thumbnail: item.thumbnail,
    }));

const toConnectionPostsResult = (response: unknown): {
  posts: MemberConnectionPost[];
  sectionLink: string;
} => {
  const rows =
    (response as { responseData?: { rows?: RawConnectionPost[] } } | undefined)
      ?.responseData?.rows ?? [];

  if (rows.length === 0) {
    return {
      posts: toMockConnectionPosts(),
      sectionLink: SECTION_LINK_FALLBACK,
    };
  }

  return {
    posts: rows.map(toConnectionPost),
    sectionLink: resolveSectionLink(rows),
  };
};

const renderConnectionCard = (item: MemberConnectionPost, aspectClass = "aspect-[16/10] overflow-hidden") => (
  <>
    <div className={aspectClass}>
      <Image
        src={item.thumbnail?.url ?? MEMBER_CONNECTION_FALLBACK_IMAGE}
        alt={item.thumbnail?.alt || item.title}
        width={520}
        height={420}
        className="h-full w-full object-cover object-[center_80%]"
      />
    </div>
    <div className="absolute inset-0 bg-linear-to-t from-[#0d2f5f]/85 via-[#0d2f5f]/30 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-4">
      <h4 className="line-clamp-2 text-[15px] font-bold leading-[1.32] text-white transition-colors duration-200 group-hover:text-[#f7b500]">
        {item.title}
      </h4>
      <div className="mt-1.5 flex items-center gap-2">
        {item.categoryName && (
          <>
            <span className="text-[12px] font-medium text-[#f7b500]">
              {item.categoryName}
            </span>
            <span className="text-[12px] text-white/50">•</span>
          </>
        )}
        <p className="text-[12px] font-medium text-white/78">
          {dayjs(item.publishedAt || item.createdAt).format("DD/MM/YYYY")}
        </p>
      </div>
    </div>
  </>
);

const CONNECTION_CARD_LINK_CLASS =
  "group relative block cursor-pointer overflow-hidden rounded-[14px] shadow-[0_16px_32px_rgba(31,59,124,0.12)]";

export function MemberConnectionSkeleton() {
  return (
    <aside className="w-full xl:w-[31%] xl:min-w-[320px]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="client-section-title uppercase text-[#24469c]">
            Kết nối hội viên
          </h2>
          <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={`member-connection-skeleton-${index}`}
            className="h-[220px] animate-pulse rounded-[14px] bg-[#dde5f3]"
          />
        ))}
      </div>
    </aside>
  );
}

/** Khối "Kết nối hội viên": client component dùng hook orval (mobile dùng Swiper). */
export function MemberConnection() {
  // Dùng hook orval useGetApiV10Post: queryKey tự sinh, retry, devtools sẵn.
  const connectionPostsQuery = useGetApiV10Post(CONNECTION_POSTS_PARAMS, {
    query: {
      staleTime: 60 * 1000,
      select: toConnectionPostsResult,
    },
  });

  const connectionPosts = connectionPostsQuery.data?.posts ?? [];
  const sectionLink = connectionPostsQuery.data?.sectionLink ?? SECTION_LINK_FALLBACK;

  return (
    <aside className="w-full xl:w-[31%] xl:min-w-[320px]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="client-section-title uppercase text-[#24469c]">
            Kết nối hội viên
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

      <div>
        {connectionPosts.length > 0 ? (
          <>
            {/* Mobile + xl+: Swiper */}
            <div className="md:hidden xl:block">
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={connectionPosts.length > 1}
                slidesPerView={1}
                className="w-full overflow-hidden rounded-[14px]"
              >
                {connectionPosts.map((item) => (
                  <SwiperSlide key={item.id}>
                    <Link href={item.externalLink} className={CONNECTION_CARD_LINK_CLASS}>
                      {renderConnectionCard(item, "aspect-[16/10] overflow-hidden xl:aspect-[1.25/1]")}
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* md to < xl: Grid 2 columns */}
            <div className="hidden gap-4 md:grid md:grid-cols-2 xl:hidden">
              {connectionPosts.map((item) => (
                <Link key={item.id} href={item.externalLink} className={CONNECTION_CARD_LINK_CLASS}>
                  {renderConnectionCard(item, "aspect-[16/10] overflow-hidden")}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-[14px] bg-[#eef3fb] px-5 py-10 text-center text-sm text-[#7f8eab]">
            Chưa có thông tin.
          </div>
        )}
      </div>
    </aside>
  );
}
