import Header from "@/app/(main)/_lib/layout/header";
import Footer from "@/app/(main)/_lib/layout/footer";
import React from "react";
import ScrollToTopButton from "./_lib/layout/ScrollToTopButton";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1 ">{children}</div>
      <ScrollToTopButton />
      <Footer />
    </main>
  );
}
