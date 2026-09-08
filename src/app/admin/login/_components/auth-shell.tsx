import Image from "next/image";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useGetApiV10Logo } from "@/api/vcci-news/endpoints/logo";
import type { Logo } from "@/api/vcci-news/models/logo";

export type AuthMode = "login" | "forgot";

export function AuthShell({
  mode,
  children,
}: {
  mode: AuthMode;
  children: React.ReactNode;
}) {
  const { data: logoData } = useGetApiV10Logo(
    {
      page: 1,
      pageSize: 1,
      sortField: "updated_at",
      sortOrder: "desc",
    },
    {
      query: {
        select: (response: any) => {
          const responseData = response?.responseData ?? response?.data?.responseData;
          return (responseData?.rows?.[0] as Logo | undefined) ?? null;
        },
      },
    }
  );

  // Always use the static /logo.png from public/ for the login screen so the
  // logo renders reliably regardless of backend logo/upload state.
  const logoSrc = "/logo.png";

  const title =
    mode === "login"
      ? "Đăng nhập quản trị"
      : "Khôi phục mật khẩu";

  const description =
    mode === "login"
      ? "Truy cập khu vực quản trị nội dung VCCI News."
      : "Gửi yêu cầu reset mật khẩu cho ban quản trị.";

  return (
    <div className="min-h-screen bg-[#f6f9ff] px-4 py-8 text-gray-700">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-[#063e8e]/10 bg-white shadow-[0_20px_60px_rgba(6,62,142,0.10)] lg:grid-cols-[0.95fr_1.05fr]">
          <section className="relative hidden border-r border-[#063e8e]/10 bg-[#edf4ff] px-10 py-10 lg:block">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#063e8e]" />
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#063e8e]/10 bg-white shadow-sm">
                    <Image
                      src={logoSrc}
                      alt={logoData?.logo_name || "VCCI HCM"}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#063e8e]">
                      {logoData?.logo_name || "VCCI News"}
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      Trang quản trị website
                    </div>
                  </div>
                </div>

                <div className="mt-14 max-w-md">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#063e8e]/15 bg-white px-3 py-1.5 text-sm font-medium text-[#063e8e]">
                    <ShieldCheck className="h-4 w-4" />
                    Khu vực bảo mật
                  </div>
                  <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900">
                    Quản lý nội dung với giao diện riêng cho admin.
                  </h1>
                  <p className="mt-5 text-base leading-7 text-gray-700">
                    Hệ thống sử dụng tài khoản quản trị để bảo vệ cấu hình
                    website, bài viết, media và các dữ liệu vận hành.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {["Cấu hình", "Bài viết", "Liên hệ"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#063e8e]/10 bg-white px-4 py-3"
                  >
                    <div className="text-sm font-semibold text-[#063e8e]">
                      {item}
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-[#dbe8ff]" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-6 sm:px-8 lg:px-12 lg:py-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#063e8e]/10 bg-[#f8fbff]">
                  <Image
                    src={logoSrc}
                    alt={logoData?.logo_name || "VCCI HCM"}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                    priority
                  />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#063e8e]">
                    {logoData?.logo_name || "VCCI News"}
                  </div>
                  <div className="text-sm text-gray-700">
                    Trang quản trị website
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#063e8e]">
                  <LockKeyhole className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-gray-900">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {description}
                </p>
              </div>

              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
