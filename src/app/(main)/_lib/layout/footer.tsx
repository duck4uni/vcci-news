"use client";

import React, { useState } from "react";
import {
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Printer,
  SendHorizontal,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { subscribeNewsletterEmail } from "@/lib/api/newsletter-subscriptions";
import { getSiteInformation } from "@/api/endpoints/site-information";
import type { SiteInformationData } from "@/api/models";

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

const ZaloIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
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

const TiktokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
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
    icon: <Facebook className="h-5 w-5" />,
  },
  {
    key: "twitter",
    url: "https://twitter.com/VCCI_HCM",
    icon: <Twitter className="h-5 w-5" />,
  },
  {
    key: "youtube",
    url: "https://www.youtube.com/user/VCCIHCMC",
    icon: <Youtube className="h-5 w-5" />,
  },
  {
    key: "linkedin",
    url: "https://www.linkedin.com/company/vietnam-chamber-of-commerce-and-industry-ho-chi-minh-city-branch-vcci-hcm-?trk=biz-companies-cym",
    icon: <Linkedin className="h-5 w-5" />,
  },
];

const getEnvelopeData = <T,>(payload?: ApiEnvelope<T> | null) =>
  payload?.responseData ?? payload?.data?.responseData;

const getSocialIcon = (key: string): React.ReactNode => {
  const normalized = key.toLowerCase();
  if (normalized.includes("facebook")) return <Facebook className="h-5 w-5" />;
  if (normalized.includes("twitter") || normalized === "x") {
    return <Twitter className="h-5 w-5" />;
  }
  if (normalized.includes("youtube")) return <Youtube className="h-5 w-5" />;
  if (normalized.includes("linkedin")) return <Linkedin className="h-5 w-5" />;
  if (normalized.includes("zalo")) return <ZaloIcon className="h-5 w-5" />;
  if (normalized.includes("tiktok")) return <TiktokIcon className="h-5 w-5" />;
  return null;
};

const quickLinks = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Hội viên", href: "/hoi-vien/loi-ich-hoi-vien-vcci" },
  { label: "Hoạt động", href: "/hoat-dong/su-kien" },
  { label: "Xúc tiến Thương mại", href: "/xuc-tien-thuong-mai/ho-so-thi-truong" },
];

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function Footer() {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [checkError, setCheckError] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: siteInformationResponse } =
    useQuery<ApiEnvelope<SiteInformationData> | null>({
      queryKey: ["site-information"],
      queryFn: () => getSiteInformation().catch(() => null),
      staleTime: 5 * 60 * 1000,
    });

  const siteInformation = getEnvelopeData<SiteInformationData>(
    siteInformationResponse,
  );
  const primaryBranch =
    siteInformation?.branches?.find((branch) => branch?.is_active) ??
    siteInformation?.branches?.[0] ??
    null;
  const branches = (siteInformation?.branches ?? [])
    .filter((branch) => branch?.is_active ?? true)
    .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0));
  const extraBranches = branches.filter(
    (branch) => branch?.id && branch?.id !== primaryBranch?.id,
  );

  const contactInfo = {
    name:
      primaryBranch?.branch_name ??
      siteInformation?.website_name ??
      "LIÊN ĐOÀN THƯƠNG MẠI & CÔNG NGHIỆP VIỆT NAM - CHI NHÁNH KHU VỰC THÀNH PHỐ HỒ CHÍ MINH",
    address:
      siteInformation?.address ??
      primaryBranch?.address ??
      "171 Võ Thị Sáu, Phường Xuân Hòa, TP. HCM",
    telephone:
      siteInformation?.telephone ??
      primaryBranch?.telephone ??
      primaryBranch?.hotline ??
      "+84 28 3932 6598",
    fax: primaryBranch?.fax ?? "+84 28 3932 5472",
    email:
      siteInformation?.email ?? primaryBranch?.email ?? "info@vcci-hcm.org.vn",
  };

  const socialLinks = (() => {
    const socials =
      siteInformation?.socials ?? siteInformation?.link_socials ?? [];
    const active = socials
      .filter((item) => item?.is_active && item?.url)
      .sort((left, right) => (left.sort_order ?? 0) - (right.sort_order ?? 0))
      .map((item) => {
        const key = item.icon_key || item.platform || item.label || "";
        const icon = getSocialIcon(key);
        if (!icon || !item.url) return null;

        return {
          key: item.id || key,
          url: item.url,
          icon,
        } as SocialItem;
      })
      .filter((item): item is SocialItem => item !== null);

    return active.length ? active : fallbackSocials;
  })();

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    let hasError = false;

    setMessage("");

    if (!trimmedEmail) {
      setEmailError("Thông tin bắt buộc");
      hasError = true;
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError("Email không hợp lệ");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!accepted) {
      setCheckError(true);
      hasError = true;
    } else {
      setCheckError(false);
    }

    if (hasError) return;

    setSubmitting(true);

    try {
      await subscribeNewsletterEmail(trimmedEmail);
      setEmail("");
      setAccepted(false);
      setMessage("Đăng ký nhận thông tin thành công.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng ký nhận thông tin.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-[#202f67] text-white">
      <div className="container mx-auto px-5 py-10 sm:px-6 lg:px-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1.05fr_0.9fr]">
          <div>
            <h2 className="client-footer-title uppercase">
              Đăng ký nhận thông tin VCCI
            </h2>
            <div className="mt-2.5 h-[4px] w-[48px] rounded-full bg-[#f7b500]" />

            <div className="mt-5">
              <div className="flex w-full max-w-[350px] gap-2">
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 flex-1 rounded-[4px] border border-[#31458d] bg-[#29418f] px-4 text-[15px] text-white placeholder:text-[#84a1ef] outline-hidden"
                  type="email"
                  placeholder="Nhập email của bạn"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#f7b500] text-[#203067] transition-colors hover:bg-[#ffca30] disabled:cursor-not-allowed disabled:opacity-70"
                  aria-label="Đăng ký nhận thông tin"
                >
                  <SendHorizontal className="h-5 w-5" />
                </button>
              </div>

              {emailError ? (
                <p className="mt-2 text-[12px] text-[#ff9b9b]">{emailError}</p>
              ) : null}

              <div className="mt-3 flex items-center gap-2">
                <input
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  type="checkbox"
                  id="footer-check"
                  className="h-4 w-4 rounded border-white/30 bg-transparent accent-[#f7b500]"
                />
                <label
                  className="text-[13px] text-[#86b8ff]"
                  htmlFor="footer-check"
                >
                  Đồng ý với Điều khoản nhận email
                </label>
              </div>

              {checkError ? (
                <p className="mt-2 text-[12px] text-[#ff9b9b]">
                  Bạn cần đồng ý với Điều khoản nhận email
                </p>
              ) : null}

              {message ? (
                <p className="mt-2 text-[12px] text-[#b8d8ff]">{message}</p>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="client-footer-title uppercase">Liên hệ</h2>
            <div className="mt-2.5 h-[4px] w-[48px] rounded-full bg-[#f7b500]" />

            <div className="mt-5 space-y-4">
              <p className="max-w-[420px] text-[16px] font-semibold leading-[1.5] text-[#dce7ff]">
                {contactInfo.name}
              </p>

              <div className="space-y-2.5 text-[15px] text-[#c7d8ff]">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f7b500]" />
                  <span>{contactInfo.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-[#f7b500]" />
                  <span>{contactInfo.telephone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Printer className="h-4 w-4 shrink-0 text-[#f7b500]" />
                  <span>{contactInfo.fax}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-[#f7b500]" />
                  <a href={`mailto:${contactInfo.email}`}>
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {extraBranches.length > 0 ? (
                <div className="pt-4">
                  <p className="text-[14px] font-semibold uppercase text-[#dce7ff]">
                    Các chi nhánh khác
                  </p>
                  <div className="mt-3 space-y-3 text-[14px] text-[#c7d8ff]">
                    {extraBranches.map((branch) => (
                      <div key={branch.id} className="space-y-1">
                        {branch.branch_name ? (
                          <p className="font-semibold text-[#dce7ff]">
                            {branch.branch_name}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="client-footer-title uppercase">Kết nối</h2>
            <div className="mt-2.5 h-[4px] w-[48px] rounded-full bg-[#f7b500]" />

            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2a4ec4] text-white transition-colors hover:bg-[#3b60da]"
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <div className="mt-5 space-y-2 text-[15px] text-[#c7d8ff]">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#2946a3] pt-5 text-center text-[14px] text-[#62a7ff]">
          © Bản quyền VCCI-HCM | All rights reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;
