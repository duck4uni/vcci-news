import { Suspense } from "react";
import { AdminNewsFormContent } from "./_components/admin-news-form-content";

export default function AdminNewsDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-8 text-center text-sm text-gray-700">
          Đang tải...
        </div>
      }
    >
      <AdminNewsFormContent />
    </Suspense>
  );
}
