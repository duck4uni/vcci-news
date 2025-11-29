import type { Metadata } from "next";
import "./styles.css";
import { Providers } from "./_providers";
import React from "react";
import links from "@links/index";

export const metadata: Metadata = {
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico' },
  title: 'HIỆP HỘI XUẤT NHẬP KHẨU THÀNH PHỐ HỒ CHÍ MINH',
  description: 'HIỆP HỘI XUẤT NHẬP KHẨU THÀNH PHỐ HỒ CHÍ MINH',
  metadataBase: new URL(links.siteURL),
  alternates: { canonical: links.siteURL },
  openGraph: {
    title: 'HIỆP HỘI XUẤT NHẬP KHẨU THÀNH PHỐ HỒ CHÍ MINH',
    description: 'HIỆP HỘI XUẤT NHẬP KHẨU THÀNH PHỐ HỒ CHÍ MINH',
    url: links.siteURL,
    siteName: 'HIỆP HỘI XUẤT NHẬP KHẨU THÀNH PHỐ HỒ CHÍ MINH',
    images: [
      {
        url: `${links.siteURL}/thumbnail.png`,
        width: 1200,
        height: 630,
        alt: 'HIỆP HỘI XUẤT NHẬP KHẨU THÀNH PHỐ HỒ CHÍ MINH'
      }
    ],
    locale: 'vi_VN',
    type: 'website'
  },
  twitter: { card: 'summary_large_image', title: 'HIỆP HỘI XUẤT NHẬP KHẨU THÀNH PHỐ HỒ CHÍ MINH', description: 'Tin tức và sự kiện từ HIỆP HỘI XUẤT NHẬP KHẨU THÀNH PHỐ HỒ CHÍ MINH', creator: '@vneic_hcm' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
