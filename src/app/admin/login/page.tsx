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
import { useGetApiV10Logo } from "@/api/endpoints/logo";
import type { Logo } from "@/api/models/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/VCCI-HCM-logo-VN-2025.png";
import links, { resolveUploadUrl } from "@/links";
import { loginAdmin } from "@/lib/auth/admin-auth";
import useAuthStore from "@/store/useAuthStore";

type AuthMode = "login" | "forgot" | "reset";
type ResetStep = "request" | "verify" | "password" | "done";

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

type VerifyOtpPayload = {
  reset_token?: string;
  expires_in?: number;
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

const DEFAULT_REDIRECT = "/admin/base-config";
const ADMIN_BLUE = "#063e8e";
const authFieldClassName =
  "h-11 rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-400 shadow-sm focus-visible:ring-[#063e8e]/30";
const authButtonClassName =
  "h-11 rounded-xl bg-[#063e8e] text-white shadow-[0_12px_24px_rgba(6,62,142,0.16)] hover:bg-[#052f6c]";

function normalizeRedirectPath(redirect: string | null) {
  if (
    !redirect ||
    !redirect.startsWith("/admin") ||
    redirect === "/admin/login"
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

async function postAuthJson<TResponse, TBody>(path: string, body: TBody) {
  const response = await fetch(`${links.apiEndpoint}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as TResponse &
    ErrorResponse;

  if (!response.ok) {
    throw {
      response: {
        data,
      },
    };
  }

  return data as TResponse;
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

  const title =
    mode === "login"
      ? "Đăng nhập quản trị"
      : mode === "forgot"
        ? "Khôi phục mật khẩu"
        : "Đặt lại mật khẩu";

  const description =
    mode === "login"
      ? "Truy cập khu vực quản trị nội dung VCCI News."
      : mode === "forgot"
        ? "Xác thực email quản trị để nhận mã OTP."
        : "Nhập mã OTP để tạo mật khẩu mới cho tài khoản.";

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
                      src={logoData?.logo_url ? resolveUploadUrl(logoData.logo_url) : logo}
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
                    src={logoData?.logo_url ? resolveUploadUrl(logoData.logo_url) : logo}
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

  const [resetStep, setResetStep] = useState<ResetStep>("request");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    if (!rememberState?.remember) return;

    setEmail(rememberState.username);
    setPassword(rememberState.password);
    setRemember(true);
  }, [rememberState]);

  useEffect(() => {
    if (!hasHydrated || !isLoggedIn) return;

    router.replace(redirect);
  }, [hasHydrated, isLoggedIn, redirect, router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      await loginAdmin(email.trim(), password, { persistSession: remember });
      setAppUserRemember(
        remember ? email.trim() : "",
        remember ? password : "",
        remember,
      );

      toast.success("Đăng nhập quản trị thành công");
      router.replace(redirect);
    } catch (error) {
      setLoginError(
        getAuthErrorMessage(error, "Đăng nhập thất bại. Vui lòng thử lại."),
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetError(null);
    setResetMessage(null);
    setResetLoading(true);

    try {
      await postAuthJson<ApiEnvelope, { email: string }>(
        "/auth/forgot-password/send-otp",
        {
          email: email.trim(),
        },
      );

      setResetStep("verify");
      setMode("reset");
      setResetMessage("M? OTP d? du?c g?i d?n email qu?n tr?.");
    } catch (error) {
      setResetError(
        getAuthErrorMessage(error, "Kh?ng th? g?i m? OTP. Vui l?ng th? l?i."),
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetError(null);
    setResetMessage(null);
    setResetLoading(true);

    try {
      const response = await postAuthJson<
        ApiEnvelope<VerifyOtpPayload>,
        { email: string; otp: string }
      >("/auth/forgot-password/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });
      const payload = getResponseData<VerifyOtpPayload>(response);

      if (!payload?.reset_token) {
        throw new Error("Kh?ng nh?n du?c m? d?t l?i m?t kh?u t? API.");
      }

      setResetToken(payload.reset_token);
      setResetStep("password");
      setResetMessage("OTP hợp lệ. Bạn có thể tạo mật khẩu mới.");
    } catch (error) {
      setResetError(
        getAuthErrorMessage(error, "OTP kh?ng h?p l? ho?c d? h?t h?n."),
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetError(null);
    setResetMessage(null);

    if (newPassword.length < 6) {
      setResetError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    setResetLoading(true);

    try {
      await postAuthJson<
        ApiEnvelope,
        { reset_token: string; new_password: string }
      >("/auth/forgot-password/reset", {
        reset_token: resetToken,
        new_password: newPassword,
      });

      setResetStep("done");
      setResetMessage(
        "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.",
      );
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Đặt lại mật khẩu thành công");
    } catch (error) {
      setResetError(
        getAuthErrorMessage(
          error,
          "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
        ),
      );
    } finally {
      setResetLoading(false);
    }
  };

  const switchToLogin = () => {
    setMode("login");
    setResetError(null);
    setResetMessage(null);
  };

  const switchToForgot = () => {
    setMode("forgot");
    setResetStep("request");
    setResetError(null);
    setResetMessage(null);
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
        <form className="space-y-5" onSubmit={handleSendOtp}>
          {resetError ? (
            <InlineMessage type="error" message={resetError} />
          ) : null}
          {resetMessage ? (
            <InlineMessage type="success" message={resetMessage} />
          ) : null}

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

          <Button
            type="submit"
            className={authButtonClassName}
            disabled={resetLoading}
          >
            {resetLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Đang gửi OTP...
              </>
            ) : (
              "Gửi mã OTP"
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

      {mode === "reset" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["verify", "OTP"],
              ["password", "Mật khẩu"],
              ["done", "Hoàn tất"],
            ].map(([step, label]) => {
              const stepIndex = ["verify", "password", "done"].indexOf(step);
              const currentIndex = ["verify", "password", "done"].indexOf(
                resetStep,
              );
              const active = currentIndex >= stepIndex;

              return (
                <div
                  key={step}
                  className={
                    active
                      ? "rounded-xl border border-[#063e8e]/20 bg-[#edf4ff] px-3 py-2 text-center text-xs font-semibold text-[#063e8e]"
                      : "rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-xs font-semibold text-gray-500"
                  }
                >
                  {label}
                </div>
              );
            })}
          </div>

          {resetError ? (
            <InlineMessage type="error" message={resetError} />
          ) : null}
          {resetMessage ? (
            <InlineMessage type="success" message={resetMessage} />
          ) : null}

          {resetStep === "verify" ? (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-700">
                  M? OTP
                </Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Nhập 6 chữ số"
                  className={`${authFieldClassName} text-center text-lg font-semibold tracking-[0.35em]`}
                  required
                />
              </div>
              <Button
                type="submit"
                className={authButtonClassName}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  "Xác thực OTP"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={switchToForgot}
                className="h-10 w-full rounded-xl text-gray-700 hover:bg-[#edf4ff] hover:text-[#063e8e]"
              >
                G?i l?i m? OTP
              </Button>
            </form>
          ) : null}

          {resetStep === "password" ? (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-700">
                  Mật khẩu mới
                </Label>
                <PasswordInput
                  id="new-password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Tối thiểu 6 ký tự"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700">
                  Xác nhận mật khẩu
                </Label>
                <PasswordInput
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Nhập lại mật khẩu mới"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                className={authButtonClassName}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </form>
          ) : null}

          {resetStep === "done" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#063e8e]/15 bg-[#f8fbff] p-5 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#063e8e]" />
                <div className="mt-3 text-base font-semibold text-gray-900">
                  M?t kh?u d? du?c c?p nh?t
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Quay lại màn đăng nhập để vào khu vực quản trị bằng mật khẩu
                  mới.
                </p>
              </div>
              <Button
                type="button"
                className={authButtonClassName}
                onClick={switchToLogin}
              >
                Đăng nhập ngay
              </Button>
            </div>
          ) : null}
        </div>
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
