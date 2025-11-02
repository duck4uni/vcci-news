import type { Metadata } from "next";
import "./styles.css";
import { Providers } from "./_providers";
import React from "react";
import links from "@links/index";



export const metadata: Metadata = {
  title: 'VCCI',
  description: 'Liên đoàn Thương mại và Công nghiệp Việt Nam - Chi nhánh TP.HCM',
  metadataBase: new URL(links.siteURL),
  alternates: { canonical: links.siteURL },
  openGraph: {
    title: 'VCCI - TP.HCM',
    description: 'Tin tức và sự kiện từ Liên đoàn Thương mại và Công nghiệp Việt Nam - Chi nhánh TP.HCM',
    url: links.siteURL,
    siteName: 'VCCI HCM',
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
