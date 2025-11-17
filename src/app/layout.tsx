import type { Metadata } from "next";
import "./styles.css";
import { Providers } from "./_providers";
import React from "react";
import links from "@links/index";

export const metadata: Metadata = {
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico' },
  title: 'Chức năng Đại diện Người sử dụng lao động - Liên đoàn Thương mại và Công nghiệp Việt Nam, CN TP.HCM',
  description: 'Chức năng Đại diện Người sử dụng lao động (NSDLĐ):',
  metadataBase: new URL(links.siteURL),
  alternates: { canonical: links.siteURL },
  openGraph: {
    title: 'Liên đoàn Thương mại và Công nghiệp Việt Nam, CN TP.HCM',
    description: 'Phòng Thương mại và Công nghiệp Việt Nam (VCCI) là tổ chức quốc gia tập hợp và đại diện cho cộng đồng doanh nghiệp, doanh nhân, người sử dụng lao động...',
    url: links.siteURL,
    siteName: 'Liên đoàn Thương mại và Công nghiệp Việt Nam, CN TP.HCM',
    images: [
      {
        url: `${links.siteURL}/thumbnail.png`,
        width: 1200,
        height: 630,
        alt: 'VCCI HCM'
      }
    ],
    locale: 'vi_VN',
    type: 'website'
  },
  twitter: { card: 'summary_large_image', title: 'VCCI HCM', description: 'Tin tức và sự kiện từ VCCI HCM', creator: '@vcci_hcm' },
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
