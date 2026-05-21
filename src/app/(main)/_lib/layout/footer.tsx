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
  return null;
};

const quickLinks = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Hội viên", href: "/danh-ba-hoi-vien" },
  { label: "Hoạt động", href: "/hoat-dong/tin-tuc" },
  { label: "Xúc tiến Thương mại", href: "/xuc-tien-thuong-mai/co-hoi/" },
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
                    Chi nhánh khác
                  </p>
                  <div className="mt-3 space-y-3 text-[14px] text-[#c7d8ff]">
                    {extraBranches.map((branch) => (
                      <div key={branch.id} className="space-y-1">
                        {branch.branch_name ? (
                          <p className="font-semibold text-[#dce7ff]">
                            {branch.branch_name}
                          </p>
                        ) : null}
                        {branch.address ? (
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f7b500]" />
                            <span>{branch.address}</span>
                          </div>
                        ) : null}
                        {branch.telephone || branch.hotline ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-[#f7b500]" />
                            <span>{branch.telephone || branch.hotline}</span>
                          </div>
                        ) : null}
                        {branch.fax ? (
                          <div className="flex items-center gap-2">
                            <Printer className="h-3.5 w-3.5 shrink-0 text-[#f7b500]" />
                            <span>{branch.fax}</span>
                          </div>
                        ) : null}
                        {branch.email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 shrink-0 text-[#f7b500]" />
                            <a href={`mailto:${branch.email}`}>
                              {branch.email}
                            </a>
                          </div>
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
