"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoPermissionMessage } from "@/components/shared/permission-gate";
import { usePermission } from "@/hooks/usePermission";
import { AdvertisementList } from "./advertisement-list";

export default function AdvertisementsPage() {
  const canRead = usePermission("advertisements", "read");

  if (!canRead) {
    return <NoPermissionMessage />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#163b73]">Quản lý Quảng cáo</h1>
        <p className="mt-1 text-sm text-slate-600">
          Quản lý quảng cáo sidebar (vuông) và banner ngang trên trang chủ
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="square" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-2xl border border-[#063e8e]/10 bg-[#f8fbff] p-1">
          <TabsTrigger
            value="square"
            className="rounded-xl data-[state=active]:bg-[#063e8e] data-[state=active]:text-white"
          >
            Quảng cáo vuông (Sidebar)
          </TabsTrigger>
          <TabsTrigger
            value="horizontal"
            className="rounded-xl data-[state=active]:bg-[#063e8e] data-[state=active]:text-white"
          >
            Quảng cáo ngang (Banner)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="square" className="mt-6">
          <AdvertisementList
            type="square"
            title="Quảng cáo vuông (Sidebar)"
            description="Hiển thị ở sidebar các trang. Tỉ lệ ảnh khuyến nghị 16:10"
            previewAspect="16 / 10"
            note="Website chỉ hiển thị tối đa 5 quảng cáo vuông (theo sort_order). Các quảng cáo có thứ tự lớn hơn hoặc trạng thái 'Ẩn' sẽ không hiện trên trang."
          />
        </TabsContent>

        <TabsContent value="horizontal" className="mt-6">
          <AdvertisementList
            type="horizontal"
            title="Quảng cáo ngang (Banner)"
            description="Hiển thị banner full-width giữa các section. Tỉ lệ ảnh khuyến nghị 1600:200"
            previewAspect="1600 / 200"
            note="Website chỉ hiển thị 1 quảng cáo ngang duy nhất (quảng cáo có sort_order nhỏ nhất và trạng thái 'Hiển thị'). Tất cả vị trí banner trên trang sẽ dùng chung 1 quảng cáo này."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
