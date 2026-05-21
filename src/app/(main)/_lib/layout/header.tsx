"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Facebook, Linkedin, Menu, Twitter, X, Youtube } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/VCCI-HCM-logo-VN-2025.png";
import { useGetLogo } from "@/api/endpoints/logo";
import { getSiteInformation } from "@/api/endpoints/site-information";
import { resolveUploadUrl } from "@/links";
import type { Logo } from "@/api/models/logo";
import type {
  SiteInformationData,
  SiteInformationSocialLink,
} from "@/api/models";
import MenuItem from "@/components/base/menu-item";
import { useCustomClient as customClient } from "@/api/mutator/custom-client";
import type { Category } from "@/api/models/category";
import { getCategoryFallbackResponse } from "@/mockdata/categories";

type HeaderMenuItem = {
  id: string;
  name: string;
  url: string;
  sort_order: number | null;
  children: HeaderMenuItem[];
};

type CategoryListResponse = {
  responseData?: {
    rows?: Category[];
  };
};

type LogoListEnvelope = {
  data?: {
    responseData?: {
      rows?: Logo[];
    };
  };
};

type ApiEnvelope<T> = {
  responseData?: T;
  data?: {
    responseData?: T;
  };
};

type SocialItem = {
  key: string;
  url: string;
  icon: React.ReactNode;
};

const getEnvelopeData = <T,>(payload?: ApiEnvelope<T> | null) =>
  payload?.responseData ?? payload?.data?.responseData;

const ZaloIcon = ({ size = 12, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path
      d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z"
    />
  </svg>
);

const TiktokIcon = ({ size = 12, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path
      d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
    />
  </svg>
);

const fallbackSocials: SocialItem[] = [
  {
    key: "facebook",
    url: "https://www.facebook.com/VCCIHCMC/",
    icon: <Facebook size={13} />,
  },
  {
    key: "twitter",
    url: "https://twitter.com/VCCI_HCM",
    icon: <Twitter size={13} />,
  },
  {
    key: "youtube",
    url: "https://www.youtube.com/user/VCCIHCMC",
    icon: <Youtube size={13} />,
  },
  {
    key: "linkedin",
    url: "https://www.linkedin.com/company/vietnam-chamber-of-commerce-and-industry-ho-chi-minh-city-branch-vcci-hcm-?trk=biz-companies-cym",
    icon: <Linkedin size={13} />,
  },
];

const getSocialIcon = (key: string) => {
  const normalized = key.toLowerCase();
  if (normalized.includes("facebook"))
    return <Facebook size={13} />;
  if (normalized.includes("twitter") || normalized === "x") {
    return <Twitter size={13} />;
  }
  if (normalized.includes("youtube"))
    return <Youtube size={13} />;
  if (normalized.includes("linkedin"))
    return <Linkedin size={13} />;
  if (normalized.includes("zalo")) {
    return <ZaloIcon size={13} />;
  }
  if (normalized.includes("tiktok")) {
    return <TiktokIcon size={13} />;
  }
  return null;
};

function normalizeCategoryUrl(url?: string | null) {
  if (!url) return "#";
  return url.startsWith("/") ? url : `/${url}`;
}

function buildHeaderMenuTree(rows?: Category[]) {
  if (!rows?.length) return [];

  const itemMap = new Map<string, HeaderMenuItem>();
  const sortMenuItems = (items: HeaderMenuItem[]) => {
    items.sort((left, right) => {
      const leftOrder = left.sort_order ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.sort_order ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.name.localeCompare(right.name, "vi");
    });
  };

  rows.forEach((item) => {
    if (!item.id || !item.name) return;

    itemMap.set(item.id, {
      id: item.id,
      name: item.name,
      url: normalizeCategoryUrl(item.url),
      sort_order: item.sort_order ?? null,
      children: [],
    });
  });

  const roots: HeaderMenuItem[] = [];

  rows.forEach((item) => {
    if (!item.id || !item.name) return;

    const current = itemMap.get(item.id);
    if (!current) return;

    if (item.parent_id && itemMap.has(item.parent_id)) {
      const parent = itemMap.get(item.parent_id);
      parent?.children.push(current);
      if (parent) sortMenuItems(parent.children);
      return;
    }

    if ((item.type ?? "") === "category") {
      roots.push(current);
    }
  });

  sortMenuItems(roots);
  return roots;
}

function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isTopBarHidden, setIsTopBarHidden] = useState(false);
  const router = useRouter();

  const handleDesktopMenuWheel = useCallback(
    (event: React.WheelEvent<HTMLElement>) => {
      const element = event.currentTarget;

      if (element.scrollWidth <= element.clientWidth) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();
      element.scrollLeft += event.deltaY;
    },
    [],
  );

  const { data: categoriesResponse } = useQuery({
    queryKey: ["header-categories"],
    queryFn: () =>
      customClient<CategoryListResponse>(
        "/category?page=1&pageSize=200&sortField=sort_order&sortOrder=ASC",
      ).catch(() => getCategoryFallbackResponse()),
    staleTime: 5 * 60 * 1000,
  });

  const { data: currentLogo = null } = useGetLogo(
    {
      page: 1,
      pageSize: 1,
      sortField: "updated_at",
      sortOrder: "desc",
    },
    {
      query: {
        select: (response: any) => {
          const responseData = response?.responseData ?? response?.data?.responseData;
          return (responseData?.rows?.[0] as Logo | undefined) ?? null;
        },
        staleTime: 5 * 60 * 1000,
      },
    }
  );

  const { data: siteInformationResponse } =
    useQuery<ApiEnvelope<SiteInformationData> | null>({
      queryKey: ["site-information"],
      queryFn: () => getSiteInformation().catch(() => null),
      staleTime: 5 * 60 * 1000,
    });

  const menuItems = useMemo(
    () => buildHeaderMenuTree(categoriesResponse?.responseData?.rows),
    [categoriesResponse?.responseData?.rows],
  );
  const siteInformation = getEnvelopeData<SiteInformationData>(
    siteInformationResponse,
  );
  const socialLinks = useMemo(() => {
    const socials =
      siteInformation?.socials ?? siteInformation?.link_socials ?? [];

    const active = socials
      .filter((item) => item?.is_active && item?.url)
      .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
      .map((item): SocialItem | null => {
        const key = item.icon_key || item.platform || item.label || "";
        const icon = getSocialIcon(key);
        if (!icon || !item.url) return null;

        return {
          key: item.id || key,
          url: item.url,
          icon,
        };
      })
      .filter((item): item is SocialItem => Boolean(item));

    return active.length ? active : fallbackSocials;
  }, [siteInformation?.socials, siteInformation?.link_socials]);

  useEffect(() => {
    const handleScroll = () => {
      setIsTopBarHidden(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = toggleMenu ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [toggleMenu]);

  return (
    <header className="sticky top-0 z-50 shadow-[0_1px_0_rgba(15,23,42,0.05)]">
      <div
        className={`hidden w-full items-center justify-center overflow-hidden bg-[#25439a] ${isTopBarHidden ? "lg:hidden" : "h-10 lg:flex"
          }`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1460px] items-center justify-between gap-6 px-6 xl:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 items-center justify-center rounded-[4px] bg-[#f2b500] px-4 shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]">
              <Link
                className="text-[13px] font-semibold leading-none text-[#15357a] transition hover:opacity-85"
                href="https://vccihcm.vn/dang-ky"
              >
                {"\u0110\u0103ng K\u00fd H\u1ed9i Vi\u00ean"}
              </Link>
            </div>
            {/* <Link
              className="px-3 py-1 text-[13px] font-medium text-white transition hover:opacity-80"
              href="/site-map"
            >
              Sitemap
            </Link> */}
            <Link
              className="px-3 py-1 text-[13px] font-medium text-white transition hover:opacity-80"
              href="https://vccihcm.vn/lien-he"
            >
              {"Li\u00ean h\u1ec7"}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <input
              className="h-7 w-44 rounded-[4px] border border-[#3a57b4] bg-[#3554b7] px-3 text-[13px] text-white outline-none placeholder:text-[13px] placeholder:text-[#b5c4ff]"
              type="text"
              placeholder={"T\u00ecm ki\u1ebfm"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value =
                    (e.currentTarget as HTMLInputElement).value || "";
                  const encoded = encodeURIComponent(value);
                  router.push(`/search?q=${encoded}&page=1`);
                }
              }}
            />

            <div className="flex items-center gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-[22px] items-center justify-center rounded-full bg-white text-[#2f57ff] transition hover:opacity-80"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 w-full max-w-[1460px] items-center justify-between gap-10 px-6 xl:px-8">
          <Link
            href="/"
            className="flex w-[136px] shrink-0 items-center xl:w-[152px]"
          >
            <Image
              width={108}
              height={40}
              className="h-auto max-h-10 w-[108px] object-contain"
              src={currentLogo?.logo_url ? resolveUploadUrl(currentLogo.logo_url) : logo}
              alt={currentLogo?.logo_name || "VCCI-HCM"}
              priority
            />
          </Link>

          <div className="hidden min-w-0 flex-1 justify-end pl-6 lg:flex xl:pl-10">
            <nav
              className="header-menu-scroll min-w-0 max-w-full overflow-x-auto overflow-y-hidden"
              onWheel={handleDesktopMenuWheel}
            >
              <div className="flex w-max min-w-full items-center justify-end gap-4 whitespace-nowrap pr-1 xl:gap-6">
                {menuItems.map((category) => (
                  <MenuItem
                    key={category.id}
                    title={category.name}
                    link={category.url}
                    items={category.children.map((child) => ({
                      title: child.name,
                      link: child.url,
                    }))}
                  />
                ))}
              </div>
            </nav>
          </div>

          <button
            onClick={() => setToggleMenu((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-[#163b73] transition hover:bg-slate-50 lg:hidden"
            aria-label={"M\u1edf menu"}
          >
            {toggleMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-60 bg-white transition-all duration-300 lg:hidden ${toggleMenu
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
          }`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="sticky top-0 z-10 flex h-[78px] shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
            <Link
              href="/"
              className="flex w-[136px] shrink-0 items-center"
              onClick={() => setToggleMenu(false)}
            >
              <Image
                width={108}
                height={40}
                className="h-auto max-h-10 w-[108px] object-contain"
                src={currentLogo?.logo_url ? resolveUploadUrl(currentLogo.logo_url) : logo}
                alt={currentLogo?.logo_name || "VCCI-HCM"}
                priority
              />
            </Link>
            <button
              onClick={() => setToggleMenu(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-[#163b73] transition hover:bg-slate-50"
              aria-label={"Đ\u00f3ng menu"}
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
            <input
              className="h-11 w-full shrink-0 rounded-md border border-slate-200 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-[#2f57ff]"
              type="text"
              placeholder={"T\u00ecm ki\u1ebfm"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value =
                    (e.currentTarget as HTMLInputElement).value || "";
                  const encoded = encodeURIComponent(value);
                  router.push(`/search?q=${encoded}&page=1`);
                  setToggleMenu(false);
                }
              }}
            />

            <div className="pb-6">
              {menuItems.map((category) => (
                <div
                  key={category.id}
                  className="border-t border-slate-100 first:border-t-0"
                >
                  <Link
                    href={category.url || "#"}
                    className="block px-5 py-3 text-[15px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#2f57ff]"
                    onClick={() => setToggleMenu(false)}
                  >
                    {category.name}
                  </Link>
                  {category.children.length > 0 ? (
                    <div className="pb-2 pl-8 pr-5">
                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url || "#"}
                          className="block py-2 text-sm text-slate-500 transition hover:text-[#2f57ff]"
                          onClick={() => setToggleMenu(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
