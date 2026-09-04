"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useGetApiV10Logo } from "@/api/vcci-news/endpoints/logo";
import { usePostApiV10AuthForgotPasswordRequest } from "@/api/vcci-news/endpoints/authentication";
import type { Logo } from "@/api/vcci-news/models/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/lib/auth/admin-auth";
import useAuthStore from "@/store/useAuthStore";

type AuthMode = "login" | "forgot";

type ApiEnvelope<T = unknown> = {
  responseData?: T;
  data?: {
    responseData?: T;
  };
  message?: string | null;
  message_en?: string | null;
};

type LogoListEnvelope = {
  data?: {
    responseData?: {
      rows?: Logo[];
    };
  };
};

type ErrorResponse = {
  message?: string;
  error?: {
    message?: {
      vi?: string;
      en?: string;
    };
  };
};

const DEFAULT_REDIRECT = "/admin";
const ADMIN_BLUE = "#063e8e";
const authFieldClassName =
  "h-11 rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-400 shadow-sm focus-visible:ring-[#063e8e]/30";
const authButtonClassName =
  "h-11 rounded-xl bg-[#063e8e] text-white shadow-[0_12px_24px_rgba(6,62,142,0.16)] hover:bg-[#052f6c]";

function normalizeRedirectPath(redirect: string | null) {
  if (
    !redirect ||
    !redirect.startsWith("/admin") ||
    redirect === "/admin/login" ||
    redirect === "/admin/change-password"
  ) {
    return DEFAULT_REDIRECT;
  }

  return redirect;
}

function getResponseData<T>(response: ApiEnvelope<T>) {
  return response.responseData ?? response.data?.responseData;
}

function getAuthErrorMessage(error: unknown, fallback: string) {
  const apiError = error as {
    response?: {
      data?: ErrorResponse;
    };
    message?: string;
  };

  return (
    apiError.response?.data?.error?.message?.vi ??
    apiError.response?.data?.message ??
    apiError.message ??
    fallback
  );
}

function AuthShell({
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

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${authFieldClassName} pr-11`}
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-1 top-1 h-9 w-9 rounded-lg text-gray-700 hover:bg-[#edf4ff] hover:text-[#063e8e]"
        title={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}

function InlineMessage({
  type,
  message,
}: {
  type: "error" | "success";
  message: string;
}) {
  return (
    <div
      className={
        type === "error"
          ? "rounded-2xl border border-[#063e8e]/15 bg-[#f8fbff] px-4 py-3 text-sm text-gray-700"
          : "rounded-2xl border border-[#063e8e]/15 bg-[#edf4ff] px-4 py-3 text-sm text-[#063e8e]"
      }
    >
      <div className="flex items-start gap-2">
        {type === "success" ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        ) : null}
        <span>{message}</span>
      </div>
    </div>
  );
}

function AdminLoginPageContent({ redirect }: { redirect: string }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isLoggedIn = useAuthStore((state) => state.appIsLoggedIn);
  const rememberState = useAuthStore((state) => state.appUserRemember);
  const setAppUserRemember = useAuthStore((state) => state.setAppUserRemember);

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Forgot password state
  const [forgotNote, setForgotNote] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!rememberState?.remember) return;

    setEmail(rememberState.username);
    setPassword(rememberState.password);
    setRemember(true);
  }, [rememberState]);

  useEffect(() => {
    if (!hasHydrated || !isLoggedIn) return;

    // Nếu user phải đổi mật khẩu → luôn redirect sang change-password
    const currentUser = useAuthStore.getState().appUser;
    if (currentUser?.must_change_password) {
      router.replace("/admin/change-password");
    } else {
      router.replace(redirect);
    }
  }, [hasHydrated, isLoggedIn, redirect, router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const loginData = await loginAdmin(email.trim(), password, { persistSession: remember });
      setAppUserRemember(
        remember ? email.trim() : "",
        remember ? password : "",
        remember,
      );

      // Nếu BE báo phải đổi mật khẩu → redirect sang trang đổi mật khẩu
      if (loginData?.must_change_password) {
        toast.success("Đăng nhập thành công. Vui lòng đổi mật khẩu để tiếp tục.");
        router.replace("/admin/change-password");
      } else {
        toast.success("Đăng nhập quản trị thành công");
        router.replace(redirect);
      }
    } catch (error) {
      setLoginError(
        getAuthErrorMessage(error, "Đăng nhập thất bại. Vui lòng thử lại."),
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const forgotMutation = usePostApiV10AuthForgotPasswordRequest({
    mutation: {
      onSuccess: (response: any) => {
        const data = response?.responseData ?? response?.data?.responseData;
        setForgotMessage(
          data?.message ||
          "Yêu cầu của bạn đã được ghi nhận. Ban quản trị sẽ liên hệ với bạn sớm.",
        );
        setForgotNote("");
        toast.success("Đã gửi yêu cầu reset mật khẩu");
      },
      onError: (error: any) => {
        setForgotError(
          getAuthErrorMessage(error, "Không thể gửi yêu cầu. Vui lòng thử lại."),
        );
      },
      onSettled: () => {
        setForgotLoading(false);
      },
    },
  });

  const handleForgotRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForgotError(null);
    setForgotMessage(null);

    if (!email.trim()) {
      setForgotError("Vui lòng nhập email quản trị.");
      return;
    }

    setForgotLoading(true);
    forgotMutation.mutate({
      data: { email: email.trim(), note: forgotNote.trim() || undefined },
    });
  };

  const switchToLogin = () => {
    setMode("login");
    setForgotError(null);
    setForgotMessage(null);
  };

  const switchToForgot = () => {
    setMode("forgot");
    setForgotError(null);
    setForgotMessage(null);
  };

  if (!hasHydrated) {
    return (
      <AuthShell mode="login">
        <div className="rounded-2xl border border-[#063e8e]/10 bg-[#f8fbff] px-4 py-3 text-sm text-gray-700">
          Đang tải...
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell mode={mode}>
      {mode === "login" ? (
        <form className="space-y-5" onSubmit={handleLogin}>
          {loginError ? (
            <InlineMessage type="error" message={loginError} />
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-gray-700">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@vcci.com"
                className={`${authFieldClassName} pl-10`}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-gray-700">
              Mật khẩu
            </Label>
            <PasswordInput
              id="admin-password"
              value={password}
              onChange={setPassword}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="remember-account"
              className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
            >
              <Checkbox
                id="remember-account"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked === true)}
                className="border-[#063e8e]/25 data-[state=checked]:bg-[#063e8e]"
              />
              Ghi nhớ tài khoản
            </label>

            <Button
              type="button"
              variant="ghost"
              onClick={switchToForgot}
              className="h-auto px-0 py-0 text-sm font-semibold text-[#063e8e] hover:bg-transparent hover:text-[#052f6c]"
            >
              Quên mật khẩu?
            </Button>
          </div>

          <Button
            type="submit"
            className={authButtonClassName}
            disabled={loginLoading}
          >
            {loginLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>
      ) : null}

      {mode === "forgot" ? (
        <form className="space-y-5" onSubmit={handleForgotRequest}>
          {forgotError ? (
            <InlineMessage type="error" message={forgotError} />
          ) : null}
          {forgotMessage ? (
            <InlineMessage type="success" message={forgotMessage} />
          ) : null}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Nếu bạn quên mật khẩu, vui lòng nhập email và ghi chú yêu cầu.
            Ban quản trị sẽ liên hệ để cấp lại mật khẩu cho bạn.
          </div>

          <div className="space-y-2">
            <Label htmlFor="forgot-email" className="text-gray-700">
              Email quản trị
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@vcci.com"
                className={`${authFieldClassName} pl-10`}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forgot-note" className="text-gray-700">
              Ghi chú (tùy chọn)
            </Label>
            <textarea
              id="forgot-note"
              value={forgotNote}
              onChange={(event) => setForgotNote(event.target.value)}
              placeholder="VD: Tên của bạn, lý do quên mật khẩu, số điện thoại liên hệ..."
              rows={3}
              className={`${authFieldClassName} resize-none`}
            />
          </div>

          <Button
            type="submit"
            className={authButtonClassName}
            disabled={forgotLoading}
          >
            {forgotLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Đang gửi yêu cầu...
              </>
            ) : (
              "Gửi yêu cầu reset mật khẩu"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={switchToLogin}
            className="h-10 w-full rounded-xl text-gray-700 hover:bg-[#edf4ff] hover:text-[#063e8e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Button>
        </form>
      ) : null}
    </AuthShell>
  );
}

function SearchParamsContainer() {
  const searchParams = useSearchParams();
  const redirectPath = useMemo(
    () => normalizeRedirectPath(searchParams.get("redirect")),
    [searchParams],
  );

  return <AdminLoginPageContent redirect={redirectPath} />;
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f6f9ff] text-sm text-gray-700">
          Đang tải...
        </div>
      }
    >
      <SearchParamsContainer />
    </Suspense>
  );
}
