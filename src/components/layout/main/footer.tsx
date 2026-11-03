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
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { postApiV10NewsletterSubscription } from "@/api/vcci-news/endpoints/newsletter-subscription";
import { getApiV10SiteInformation } from "@/api/vcci-news/endpoints/site-information";
import type { SiteInformationData } from "@/api/vcci-news/models";
import { ZaloIcon, TiktokIcon } from "@/components/ui/icons";

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

type FooterBranchLink = {
  label: string;
  url: string;
};

type FooterBranch = {
  branch_name: string;
  address: string;
  telephone?: string;
  fax?: string;
  email?: string;
  zalo?: FooterBranchLink;
  facebook?: FooterBranchLink;
  qr_image?: string;
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
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  const { data: siteInformationResponse } =
    useQuery<ApiEnvelope<SiteInformationData> | null>({
      queryKey: ["site-information"],
      queryFn: () => getApiV10SiteInformation().catch(() => null),
      staleTime: 5 * 60 * 1000,
    });

  const siteInformation = getEnvelopeData<SiteInformationData>(
    siteInformationResponse,
  );
  const footerBranches: FooterBranch[] = [
  {
    branch_name:
      "LIÊN ĐOÀN THƯƠNG MẠI & CÔNG NGHIỆP VIỆT NAM - CHI NHÁNH KHU VỰC THÀNH PHỐ HỒ CHÍ MINH",
    address: "Số 171 Võ Thị Sáu, Phường Xuân Hoà, TP. Hồ Chí Minh",
    telephone: "+84 28 3932 6598",
    fax: "+84 28 3932 5472",
    email: "info@vcci-hcm.org.vn",
  },
  {
    branch_name: "Cơ sở 2",
    address: "Số 155 Nguyễn Thái Học, Phường Tam Thắng, TP. Hồ Chí Minh",
    telephone: "+84 254 3852 710",
    email: "vccihcm.cs2@gmail.com",
    zalo: {
      label: "VCCI HCM CS2",
      url: "https://zalo.me/vccivungtau",
    },
    facebook: {
      label: "Liên đoàn Thương mại và Công nghiệp Việt Nam, Chi nhánh KV TP.HCM, Cơ sở 2",
      url: "https://www.facebook.com/vccivt",
    },
    qr_image: "/qr-footer/qr-zl.jpg",
  },
];

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
    setMessageType("success");

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
      await postApiV10NewsletterSubscription({ email: trimmedEmail.trim() });
      setEmail("");
      setAccepted(false);
      setMessageType("success");
      setMessage("Đăng ký nhận thông tin thành công.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể đăng ký nhận thông tin.";
      setMessageType("error");
      setMessage(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-[#202f67] text-white">
      <div className="container mx-auto px-5 py-10 sm:px-6 lg:px-10 lg:pt-12 lg:pb-6">
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
                  className="h-12 flex-1 rounded-[4px] border border-[#31458d] bg-[#29418f] px-4 text-[14px] text-white placeholder:text-[#84a1ef] outline-hidden"
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
                  className="text-[14px] text-[#86b8ff]"
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
                <div
                  className={`mt-3 flex items-center gap-2 rounded-[6px] px-4 py-3 text-[14px] font-medium ${messageType === "success"
                    ? "bg-[#1a8754] text-white"
                    : "bg-[#c0392b] text-white"
                    }`}
                >
                  <span className="text-base leading-none">
                    {messageType === "success" ? "✓" : "✕"}
                  </span>
                  <span>{message}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="client-footer-title uppercase">Liên hệ</h2>
            <div className="mt-2.5 h-[4px] w-[48px] rounded-full bg-[#f7b500]" />

            <div className="mt-5 space-y-4">
              {footerBranches.map((branch) => (
                <div key={branch.branch_name} className="space-y-2">
                  {branch.branch_name ? (
                    <p className="font-semibold text-[#dce7ff]">
                      {branch.branch_name}
                    </p>
                  ) : null}
                  {branch.address ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f7b500]" />
                      <span className="text-[14px] leading-[1.5] text-[#c7d8ff]">
                        {branch.address}
                      </span>
                    </div>
                  ) : null}
                  {branch.telephone ? (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-[#f7b500]" />
                      <span className="text-[14px] leading-[1.5] text-[#c7d8ff]">
                        {branch.telephone}
                      </span>
                    </div>
                  ) : null}
                  {branch.fax ? (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-[#f7b500]" />
                      <span className="text-[14px] leading-[1.5] text-[#c7d8ff]">
                        {branch.fax}
                      </span>
                    </div>
                  ) : null}
                  {branch.email ? (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-[#f7b500]" />
                      <a
                        href={`mailto:${branch.email}`}
                        className="text-[14px] leading-[1.5] text-[#86b8ff] hover:text-white"
                      >
                        {branch.email}
                      </a>
                    </div>
                  ) : null}
                  {branch.zalo ? (
                    <div className="flex items-start gap-2">
                      <span className="text-[14px] leading-[1.5] text-[#c7d8ff]">
                        Zalo OA:{" "}
                        <a
                          href={branch.zalo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#86b8ff] hover:text-white"
                        >
                          {branch.zalo.label}
                        </a>
                      </span>
                    </div>
                  ) : null}
                  {branch.facebook ? (
                    <div className="flex items-start gap-2">
                      <span className="text-[14px] leading-[1.5] text-[#c7d8ff]">
                        Facebook:{" "}
                        <a
                          href={branch.facebook.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#86b8ff] hover:text-white"
                        >
                          {branch.facebook.label}
                        </a>
                      </span>
                    </div>
                  ) : null}
                  {branch.qr_image ? (
                    <div className="flex items-start gap-2">
                      <div className="relative h-28 w-28 overflow-hidden rounded-md bg-white p-1">
                        <Image
                          src={branch.qr_image}
                          alt={`Mã QR Zalo ${branch.branch_name}`}
                          fill
                          sizes="112px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
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

            <div className="mt-5 space-y-2 text-[14px] text-[#c7d8ff]">
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
          <div className="mb-1">
            Thiết kế và phát triển bởi{" "}
            <a
              href="https://vcci-hcm.org.vn/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-white transition-colors hover:text-[#f7b500]"
            >
              VCCI-HCM
            </a>
            {" "}và{" "}
            <a
              href="https://meu.com.vn/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-white transition-colors hover:text-[#f7b500]"
            >
              MEU Solutions
            </a>
          </div>
          <div>© Bản quyền VCCI-HCM | All rights reserved</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
