"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { usePostApiV10AuthForgotPasswordRequest } from "@/api/vcci-news/endpoints/authentication";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/lib/auth/admin-auth";
import useAuthStore from "@/store/useAuthStore";
import { AuthShell, type AuthMode } from "./_components/auth-shell";

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

function InlineMessage({ type, message }: {
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

function AdminLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = useMemo(
    () => normalizeRedirectPath(searchParams.get("redirect")),
    [searchParams],
  );

  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isLoggedIn = useAuthStore((state) => state.appIsLoggedIn);
  const rememberState = useAuthStore((state) => state.appUserRemember);
  const setAppUserRemember = useAuthStore((state) => state.setAppUserRemember);

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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
            <div className="relative">
              <Input
                id="admin-password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu"
                className={`${authFieldClassName} pr-11`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setPasswordVisible((current) => !current)}
                className="absolute right-1 top-1 h-9 w-9 rounded-lg text-gray-700 hover:bg-[#edf4ff] hover:text-[#063e8e]"
                title={passwordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {passwordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
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

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f6f9ff] text-sm text-gray-700">
          Đang tải...
        </div>
      }
    >
      <AdminLoginPageContent />
    </Suspense>
  );
}
