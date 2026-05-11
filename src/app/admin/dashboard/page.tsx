"use client";

import * as React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import {
  ArrowRight,
  FolderTree,
  Globe,
  Image as ImageIcon,
  LayoutTemplate,
  Mail,
  MapPin,
  MonitorPlay,
  Newspaper,
  Sparkles,
  Users,
} from "lucide-react";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type AdminMediaItem,
  type AdminNewsItem,
  readAdminMediaItems,
  readAdminNewsItems,
} from "@/mockdata/admin-news";
import { type BaseConfigData, readBaseConfig } from "@/mockdata/base-config";
import {
  type ContactRequestItem,
  type MembershipApplicationItem,
  type NewsletterSubscriptionItem,
  readContactRequests,
  readMembershipApplications,
  readNewsletterSubscriptions,
} from "@/mockdata/contact-management";
import {
  type HeaderCategoryPostItem,
  getHeaderCategoryPostSeed,
} from "@/mockdata/header-category-posts";
import { type HeaderCategoryItem, getHeaderCategorySeed } from "@/mockdata/header-config";
import {
  type MemberField,
  type MemberItem,
  type MemberRegion,
  readMemberFields,
  readMemberRegions,
  readMembers,
} from "@/mockdata/members";
import { type VideoItem, readVideos } from "@/mockdata/videos";

function formatDateTime(value: string) {
  return dayjs(value).format("DD/MM/YYYY HH:mm");
}

type DashboardMetric = {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

type DashboardShortcut = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  badge: string;
  href: string;
};

export default function AdminDashboardPage() {
  const [ready, setReady] = React.useState(false);
  const [newsItems, setNewsItems] = React.useState<AdminNewsItem[]>([]);
  const [mediaItems, setMediaItems] = React.useState<AdminMediaItem[]>([]);
  const [videos, setVideos] = React.useState<VideoItem[]>([]);
  const [members, setMembers] = React.useState<MemberItem[]>([]);
  const [memberFields, setMemberFields] = React.useState<MemberField[]>([]);
  const [memberRegions, setMemberRegions] = React.useState<MemberRegion[]>([]);
  const [newsletterItems, setNewsletterItems] = React.useState<NewsletterSubscriptionItem[]>([]);
  const [contactRequests, setContactRequests] = React.useState<ContactRequestItem[]>([]);
  const [membershipApplications, setMembershipApplications] = React.useState<
    MembershipApplicationItem[]
  >([]);
  const [baseConfig, setBaseConfig] = React.useState<BaseConfigData>(() => readBaseConfig());

  React.useEffect(() => {
    setNewsItems(readAdminNewsItems());
    setMediaItems(readAdminMediaItems());
    setVideos(readVideos());
    setMembers(readMembers());
    setMemberFields(readMemberFields());
    setMemberRegions(readMemberRegions());
    setNewsletterItems(readNewsletterSubscriptions());
    setContactRequests(readContactRequests());
    setMembershipApplications(readMembershipApplications());
    setBaseConfig(readBaseConfig());
    setReady(true);
  }, []);

  const headerCategories = React.useMemo<HeaderCategoryItem[]>(() => getHeaderCategorySeed(), []);
  const headerPosts = React.useMemo<HeaderCategoryPostItem[]>(() => getHeaderCategoryPostSeed(), []);

  const metrics = React.useMemo<DashboardMetric[]>(() => {
    const totalContactForms =
      newsletterItems.length + contactRequests.length + membershipApplications.length;

    return [
      {
        title: "Bài viết nội dung",
        value: String(newsItems.length + headerPosts.length),
        description: `${newsItems.length} bài admin, ${headerPosts.length} bài danh mục`,
        icon: Newspaper,
        href: "/admin/news",
      },
      {
        title: "Tài nguyên media",
        value: String(mediaItems.length + videos.length),
        description: `${mediaItems.length} ảnh, ${videos.length} video`,
        icon: ImageIcon,
        href: "/admin/media",
      },
      {
        title: "Hội viên & biểu mẫu",
        value: String(members.length + membershipApplications.length),
        description: `${members.length} hội viên, ${membershipApplications.length} đơn chờ xử lý`,
        icon: Users,
        href: "/admin/members",
      },
      {
        title: "Liên hệ từ website",
        value: String(totalContactForms),
        description: `${newsletterItems.length} email nhận tin, ${contactRequests.length} đơn liên hệ`,
        icon: Mail,
        href: "/admin/contact-management/newsletter-emails",
      },
    ];
  }, [
    contactRequests.length,
    headerPosts.length,
    mediaItems.length,
    members.length,
    membershipApplications.length,
    newsletterItems.length,
    newsItems.length,
    videos.length,
  ]);

  const shortcuts = React.useMemo<DashboardShortcut[]>(
    () => [
      {
        title: "Cấu hình chung",
        description: "Logo, banner, chi nhánh liên hệ và mạng xã hội",
        href: "/admin/base-config",
        icon: Globe,
      },
      {
        title: "Cấu hình danh mục",
        description: "Menu header và bài viết theo danh mục",
        href: "/admin/header-config",
        icon: FolderTree,
      },
      {
        title: "Quản lý bài viết",
        description: "Tin tức, bài viết trang và nội dung xuất bản",
        href: "/admin/news",
        icon: LayoutTemplate,
      },
      {
        title: "Quản lý liên hệ",
        description: "Email nhận tin, đơn liên hệ và đăng ký hội viên",
        href: "/admin/contact-management/newsletter-emails",
        icon: Mail,
      },
    ],
    [],
  );

  const recentActivities = React.useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [
      ...newsItems.map((item) => ({
        id: `news-${item.id}`,
        title: item.title,
        description: "Cập nhật trong Quản lý bài viết",
        time: item.updated_at || item.created_at,
        badge: "Bài viết",
        href: "/admin/news",
      })),
      ...mediaItems.map((item) => ({
        id: `media-${item.id}`,
        title: item.name,
        description: "Cập nhật trong kho ảnh website",
        time: item.updated_at,
        badge: "Ảnh",
        href: "/admin/media",
      })),
      ...membershipApplications.map((item) => ({
        id: `member-app-${item.id}`,
        title: item.organizationName,
        description: "Đơn đăng ký hội viên mới",
        time: item.submittedAt,
        badge: "Đơn hội viên",
        href: "/admin/contact-management/membership-applications",
      })),
      ...contactRequests.map((item) => ({
        id: `contact-${item.id}`,
        title: item.contactName,
        description: item.purpose,
        time: item.submittedAt,
        badge: "Liên hệ",
        href: "/admin/contact-management/contact-requests",
      })),
    ];

    return items
      .sort((left, right) => dayjs(right.time).valueOf() - dayjs(left.time).valueOf())
      .slice(0, 6);
  }, [contactRequests, mediaItems, membershipApplications, newsItems]);

  const spotlightNews = React.useMemo(() => newsItems.slice(0, 3), [newsItems]);
  const visibleSocials = React.useMemo(
    () => baseConfig.socials.filter((item) => item.isVisible).sort((a, b) => a.sortOrder - b.sortOrder),
    [baseConfig.socials],
  );
  const activeBanners = React.useMemo(
    () => baseConfig.banners.filter((item) => item.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [baseConfig.banners],
  );

  if (!ready) {
    return (
      <div className="grid gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`dashboard-loading-${index}`}
            className="h-40 animate-pulse rounded-[28px] border border-[#063e8e]/10 bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="overflow-hidden rounded-[30px] border-[#063e8e]/10 bg-[linear-gradient(135deg,#ffffff_0%,#f5f9ff_55%,#ebf3ff_100%)] shadow-[0_18px_55px_rgba(6,62,142,0.08)]">
          <CardContent className="p-6 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#063e8e]/10 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#063e8e]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tổng quan hệ thống
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-[#163b73]">Dashboard quản trị VCCI News</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Theo dõi nhanh nội dung, tài nguyên media, cấu hình website và các biểu mẫu từ
                    người dùng ngay trên một màn hình tổng hợp.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/admin/news"
                  className="rounded-[24px] border border-[#063e8e]/10 bg-white/90 p-4 transition hover:border-[#063e8e]/20 hover:shadow-sm"
                >
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Xuất bản</div>
                  <div className="mt-2 text-2xl font-semibold text-[#163b73]">{newsItems.length}</div>
                  <div className="mt-1 text-sm text-slate-500">bài viết đang quản lý</div>
                </Link>
                <Link
                  href="/admin/contact-management/contact-requests"
                  className="rounded-[24px] border border-[#063e8e]/10 bg-white/90 p-4 transition hover:border-[#063e8e]/20 hover:shadow-sm"
                >
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Phản hồi</div>
                  <div className="mt-2 text-2xl font-semibold text-[#163b73]">
                    {contactRequests.length + membershipApplications.length}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">đơn đang cần theo dõi</div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-[#163b73]">Thông tin website</CardTitle>
            <CardDescription className="text-slate-600">
              Tóm tắt nhận diện và cấu hình chung đang hiển thị.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-[#063e8e]/10 bg-[#f8fbff] p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Website</div>
              <div className="mt-2 text-lg font-semibold text-[#163b73]">{baseConfig.websiteName}</div>
              <div className="mt-1 truncate text-sm text-slate-500">{baseConfig.websiteLink}</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[#063e8e]/10 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Banner hoạt động</div>
                <div className="mt-2 text-2xl font-semibold text-[#163b73]">{activeBanners.length}</div>
              </div>
              <div className="rounded-[24px] border border-[#063e8e]/10 bg-white p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Mạng xã hội hiển thị</div>
                <div className="mt-2 text-2xl font-semibold text-[#163b73]">{visibleSocials.length}</div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#063e8e]/10 bg-white p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Chi nhánh liên hệ</div>
              <div className="mt-2 text-lg font-semibold text-[#163b73]">{baseConfig.branches.length} địa điểm</div>
              <div className="mt-1 text-sm text-slate-500">
                {baseConfig.branches[0]?.branchName || "Chưa có chi nhánh nào được cấu hình"}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Link key={metric.title} href={metric.href}>
            <Card className="h-full rounded-[28px] border-[#063e8e]/10 shadow-sm transition hover:-translate-y-0.5 hover:border-[#063e8e]/20 hover:shadow-[0_16px_40px_rgba(6,62,142,0.1)]">
              <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-500">{metric.title}</div>
                    <div className="mt-3 text-3xl font-semibold text-[#163b73]">{metric.value}</div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#063e8e]">
                    <metric.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-sm leading-6 text-slate-500">{metric.description}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl text-[#163b73]">Hoạt động gần đây</CardTitle>
                <CardDescription className="text-slate-600">
                  Các cập nhật mới nhất từ bài viết, kho ảnh và biểu mẫu liên hệ.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-[#063e8e]/15 text-[#063e8e]">
                {recentActivities.length} mục
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-start justify-between gap-4 rounded-[24px] border border-[#063e8e]/10 bg-white p-4 transition hover:bg-[#f8fbff]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-[#063e8e]/15 text-[#063e8e]">
                      {item.badge}
                    </Badge>
                    <span className="text-xs text-slate-400">{formatDateTime(item.time)}</span>
                  </div>
                  <div className="mt-2 line-clamp-1 text-sm font-semibold text-[#163b73]">
                    {item.title}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-[#163b73]">Lối tắt quản trị</CardTitle>
            <CardDescription className="text-slate-600">
              Truy cập nhanh vào các module quan trọng trong admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {shortcuts.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-[24px] border border-[#063e8e]/10 bg-[#f8fbff] p-4 transition hover:border-[#063e8e]/20 hover:bg-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#063e8e] shadow-sm">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold text-[#163b73]">{item.title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-500">{item.description}</div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl text-[#163b73]">Nội dung nổi bật</CardTitle>
                <CardDescription className="text-slate-600">
                  Các bài viết mới nhất đang được quản lý trong admin.
                </CardDescription>
              </div>
              <Button asChild variant="outline" className="rounded-xl border-[#063e8e]/15 text-[#063e8e]">
                <Link href="/admin/news">Xem tất cả</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {spotlightNews.map((item) => (
              <Link
                key={item.id}
                href={`/admin/news/${item.id}`}
                className="flex gap-4 rounded-[24px] border border-[#063e8e]/10 bg-white p-4 transition hover:bg-[#f8fbff]"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#eef4ff]">
                  {item.thumbnail ? (
                    <SafeNextImage
                      src={item.thumbnail.url}
                      alt={item.thumbnail.alt || item.thumbnail.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#063e8e]">
                      <Newspaper className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="line-clamp-2 text-sm font-semibold text-[#163b73]">{item.title}</div>
                  <div className="mt-2 text-xs text-slate-400">
                    {formatDateTime(item.updated_at || item.created_at)}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-[#163b73]">Danh mục & thư viện</CardTitle>
            <CardDescription className="text-slate-600">
              Tình trạng cấu trúc nội dung và dữ liệu danh mục đang dùng.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[#063e8e]/10 bg-[#f8fbff] p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Menu header</div>
                <div className="mt-2 text-2xl font-semibold text-[#163b73]">{headerCategories.length}</div>
                <div className="mt-1 text-sm text-slate-500">mục điều hướng</div>
              </div>
              <div className="rounded-[24px] border border-[#063e8e]/10 bg-[#f8fbff] p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Bài trong danh mục</div>
                <div className="mt-2 text-2xl font-semibold text-[#163b73]">{headerPosts.length}</div>
                <div className="mt-1 text-sm text-slate-500">bản ghi nội dung</div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#063e8e]/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#163b73]">Kho ảnh website</div>
                <Badge variant="outline" className="border-[#063e8e]/15 text-[#063e8e]">
                  {mediaItems.length} ảnh
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {mediaItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="relative aspect-square overflow-hidden rounded-2xl bg-[#eef4ff]">
                    <SafeNextImage
                      src={item.url}
                      alt={item.alt || item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-[#163b73]">Quy mô dữ liệu</CardTitle>
            <CardDescription className="text-slate-600">
              Tổng hợp nhanh các nhóm dữ liệu đang có trong hệ thống.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Video", value: videos.length, icon: MonitorPlay },
              { label: "Lĩnh vực hội viên", value: memberFields.length, icon: FolderTree },
              { label: "Khu vực hội viên", value: memberRegions.length, icon: MapPin },
              { label: "Chi nhánh liên hệ", value: baseConfig.branches.length, icon: Globe },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[22px] border border-[#063e8e]/10 bg-[#f8fbff] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#063e8e] shadow-sm">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">{item.label}</span>
                </div>
                <span className="text-lg font-semibold text-[#163b73]">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
