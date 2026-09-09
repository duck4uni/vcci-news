import Header from "@/components/layout/main/header";
import Footer from "@/components/layout/main/footer";
import React from "react";
import ScrollToTopButton from "../../components/layout/main/ScrollToTopButton";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex-1">{children}</div>
      <ScrollToTopButton />
      <Footer />
    </main>
  );
}
