import Header from "@/app/(main)/_lib/layout/header"
import Footer from "@/app/(main)/_lib/layout/footer"
import React from "react";



export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className="bg-background">
          <Header />
          {children}
          <Footer />
      </main>
  );
}
