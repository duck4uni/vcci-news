"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandingTab } from "./_components/BrandingTab";
import { BannerTab } from "./_components/BannerTab";
import { ContactTab } from "./_components/ContactTab";
import { SocialTab } from "./_components/SocialTab";

export default function AdminBaseConfigPage() {
  const [activeTab, setActiveTab] = useState("branding");

  return (
    <div className="space-y-8">
      <Tabs className="space-y-5" value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto min-w-max rounded-2xl bg-[#eaf2ff] p-1.5">
            <TabsTrigger
              value="branding"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#063e8e] data-[state=active]:bg-white data-[state=active]:text-[#063e8e]"
            >
              Nhận diện thương hiệu
            </TabsTrigger>
            <TabsTrigger
              value="banner"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#063e8e] data-[state=active]:bg-white data-[state=active]:text-[#063e8e]"
            >
              Banner trang chủ
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#063e8e] data-[state=active]:bg-white data-[state=active]:text-[#063e8e]"
            >
              Thông tin liên hệ
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#063e8e] data-[state=active]:bg-white data-[state=active]:text-[#063e8e]"
            >
              Mạng xã hội
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="space-y-5">
          <BrandingTab />
          <BannerTab />
          <ContactTab />
          <SocialTab />
        </div>
      </Tabs>
    </div>
  );
}
