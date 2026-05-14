"use client";

import Link from "next/link";

export default function MainNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#063e8e]">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-black md:text-4xl">
          Trang không tồn tại
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-700">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#063e8e] px-6 text-sm font-semibold text-white transition hover:bg-[#063e8e]/90"
          >
            Về trang chủ
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#063e8e]/15 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-[#063e8e]/5 hover:text-[#063e8e]"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
