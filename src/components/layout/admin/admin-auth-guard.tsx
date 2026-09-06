"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ensureValidAdminAccessToken, logoutAdmin } from "@/lib/auth/admin-auth";
import useAuthStore from "@/store/useAuthStore";

const LOGIN_PATH = "/admin/login";
const CHANGE_PASSWORD_PATH = "/admin/change-password";
const PROACTIVE_REFRESH_INTERVAL_MS = 60 * 1000;

const getRefreshTokenExpiredAt = (session?: { refresh_expires_at?: string | null } | null) => {
  if (!session?.refresh_expires_at) return null;
  const time = new Date(session.refresh_expires_at).getTime();
  return Number.isFinite(time) ? time : null;
};

const isSessionUsable = () => {
  const state = useAuthStore.getState();
  if (!state.appRefreshToken) return false;
  const refreshExpiredAt = getRefreshTokenExpiredAt(state.appSession);
  return !refreshExpiredAt || refreshExpiredAt > Date.now();
};

export function AdminAuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 hidden w-24 border-r border-[#063e8e]/10 bg-white lg:block">
        <div className="flex h-full flex-col items-center gap-4 px-4 py-5">
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-[#063e8e]/10" />
          <div className="h-9 w-9 animate-pulse rounded-xl bg-[#063e8e]/[0.08]" />
          <div className="h-9 w-9 animate-pulse rounded-xl bg-[#063e8e]/[0.08]" />
          <div className="h-9 w-9 animate-pulse rounded-xl bg-[#063e8e]/[0.08]" />
        </div>
      </div>

      <div className="transition-all duration-300 lg:pl-24">
        <header className="sticky top-0 z-30 border-b border-[#063e8e]/15 bg-white">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-[#063e8e]/10" />
              <div className="h-7 w-48 animate-pulse rounded-lg bg-[#063e8e]/10" />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden h-10 w-36 animate-pulse rounded-full bg-[#063e8e]/10 sm:block" />
              <div className="h-10 w-28 animate-pulse rounded-xl bg-[#063e8e]/10" />
            </div>
          </div>
        </header>

        <main className="px-4 py-4 lg:px-6 lg:py-6">
          <div className="mb-6 rounded-3xl border border-[#063e8e]/10 bg-[#f8fbff] px-6 py-5">
            <div className="h-6 w-52 animate-pulse rounded bg-[#063e8e]/10" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-[#063e8e]/[0.08]" />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-3xl border border-[#063e8e]/10 bg-white p-5 xl:col-span-2">
              <div className="h-5 w-40 animate-pulse rounded bg-[#063e8e]/10" />
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="h-24 animate-pulse rounded-2xl bg-[#063e8e]/[0.06]" />
                <div className="h-24 animate-pulse rounded-2xl bg-[#063e8e]/[0.06]" />
                <div className="h-24 animate-pulse rounded-2xl bg-[#063e8e]/[0.06]" />
                <div className="h-24 animate-pulse rounded-2xl bg-[#063e8e]/[0.06]" />
              </div>
            </div>

            <div className="rounded-3xl border border-[#063e8e]/10 bg-white p-5">
              <div className="h-5 w-32 animate-pulse rounded bg-[#063e8e]/10" />
              <div className="mt-4 space-y-3">
                <div className="h-16 animate-pulse rounded-2xl bg-[#063e8e]/[0.06]" />
                <div className="h-16 animate-pulse rounded-2xl bg-[#063e8e]/[0.06]" />
                <div className="h-16 animate-pulse rounded-2xl bg-[#063e8e]/[0.06]" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isLoggedIn = useAuthStore((state) => state.appIsLoggedIn);
  const accessToken = useAuthStore((state) => state.appAccessToken);
  const accessTokenExpired = useAuthStore((state) => state.appAccessTokenExpired);
  const refreshToken = useAuthStore((state) => state.appRefreshToken);
  const isRefreshing = useAuthStore((state) => state.appIsRefreshing);
  const mustChangePassword = useAuthStore((state) => state.appUser?.must_change_password === true);
  const [authCheckState, setAuthCheckState] = useState<"idle" | "checking" | "ready">("idle");
  const redirectParam =
    typeof window === "undefined"
      ? encodeURIComponent(pathname || "/admin")
      : encodeURIComponent(`${window.location.pathname}${window.location.search}`);

  // Force redirect to change-password page if user must change password
  useEffect(() => {
    if (
      authCheckState === "ready" &&
      isLoggedIn &&
      mustChangePassword &&
      pathname !== CHANGE_PASSWORD_PATH &&
      pathname !== LOGIN_PATH
    ) {
      router.replace(CHANGE_PASSWORD_PATH);
    }
  }, [authCheckState, isLoggedIn, mustChangePassword, pathname, router]);

  useEffect(() => {
    if (pathname === LOGIN_PATH) {
      setAuthCheckState("ready");
      return;
    }

    if (!hasHydrated) {
      setAuthCheckState("idle");
      return;
    }

    let cancelled = false;

    const restoreSession = async () => {
      setAuthCheckState("checking");

      // Refresh token đã hết hạn → logout ngay, không cố refresh nữa
      if (!isSessionUsable()) {
        if (!cancelled) {
          setAuthCheckState("ready");
          void logoutAdmin({ silent: true, reason: "missing_refresh_token" });
        }
        return;
      }

      // Access token còn hạn → OK
      const hasValidAccessToken = Boolean(
        accessToken &&
          isLoggedIn &&
          accessTokenExpired !== null &&
          accessTokenExpired > Date.now(),
      );

      if (hasValidAccessToken) {
        if (!cancelled) {
          setAuthCheckState("ready");
        }
        return;
      }

      // Access token hết hạn nhưng còn refresh token → thử refresh
      try {
        const nextToken = await ensureValidAdminAccessToken();

        if (!nextToken && !cancelled) {
          // refresh đã gọi logoutAdmin bên trong, không cần redirect thêm
          setAuthCheckState("ready");
        }
      } catch {
        if (!cancelled) {
          setAuthCheckState("ready");
        }
      } finally {
        if (!cancelled) {
          setAuthCheckState("ready");
        }
      }
    };

    void restoreSession();

    // Proactive token refresh: kiểm tra định kỳ và refresh trước khi hết hạn
    const refreshInterval = setInterval(() => {
      if (cancelled) return;
      const state = useAuthStore.getState();
      if (!state.appAccessToken || !state.appRefreshToken) return;
      // Refresh token hết hạn → logout ngay
      if (!isSessionUsable()) {
        void logoutAdmin({ silent: true, reason: "missing_refresh_token" });
        return;
      }
      void ensureValidAdminAccessToken().catch(() => null);
    }, PROACTIVE_REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(refreshInterval);
    };
  }, [
    accessToken,
    accessTokenExpired,
    hasHydrated,
    isLoggedIn,
    pathname,
    redirectParam,
    refreshToken,
    router,
  ]);

  if (pathname === LOGIN_PATH || pathname === CHANGE_PASSWORD_PATH) {
    return <>{children}</>;
  }

  if (!hasHydrated || isRefreshing || authCheckState !== "ready") {
    return <AdminAuthLoadingScreen />;
  }

  if (!isLoggedIn || (!accessToken && refreshToken)) {
    return <AdminAuthLoadingScreen />;
  }

  if (!isLoggedIn || !accessToken) {
    return null;
  }

  // Nếu user phải đổi mật khẩu, không render nội dung admin (đã redirect ở useEffect)
  if (mustChangePassword) {
    return <AdminAuthLoadingScreen />;
  }

  return <>{children}</>;
}

export function useAdminAuthStatus() {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isLoggedIn = useAuthStore((state) => state.appIsLoggedIn);
  const accessToken = useAuthStore((state) => state.appAccessToken);
  const accessTokenExpired = useAuthStore((state) => state.appAccessTokenExpired);
  const refreshToken = useAuthStore((state) => state.appRefreshToken);
  const isRefreshing = useAuthStore((state) => state.appIsRefreshing);
  const [authCheckState, setAuthCheckState] = useState<"idle" | "checking" | "ready">("idle");
  const redirectParam =
    typeof window === "undefined"
      ? encodeURIComponent(pathname || "/admin")
      : encodeURIComponent(`${window.location.pathname}${window.location.search}`);

  useEffect(() => {
    if (pathname === LOGIN_PATH) {
      setAuthCheckState("ready");
      return;
    }

    if (!hasHydrated) {
      setAuthCheckState("idle");
      return;
    }

    let cancelled = false;

    const restoreSession = async () => {
      setAuthCheckState("checking");

      // Refresh token đã hết hạn → logout ngay
      if (!isSessionUsable()) {
        if (!cancelled) {
          setAuthCheckState("ready");
          void logoutAdmin({ silent: true, reason: "missing_refresh_token" });
        }
        return;
      }

      const hasValidAccessToken = Boolean(
        accessToken &&
          isLoggedIn &&
          accessTokenExpired !== null &&
          accessTokenExpired > Date.now(),
      );

      if (hasValidAccessToken) {
        if (!cancelled) {
          setAuthCheckState("ready");
        }
        return;
      }

      try {
        const nextToken = await ensureValidAdminAccessToken();

        if (!nextToken && !cancelled) {
          setAuthCheckState("ready");
        }
      } catch {
        if (!cancelled) {
          setAuthCheckState("ready");
        }
      } finally {
        if (!cancelled) {
          setAuthCheckState("ready");
        }
      }
    };

    void restoreSession();

    // Proactive token refresh
    const refreshInterval = setInterval(() => {
      if (cancelled) return;
      const state = useAuthStore.getState();
      if (!state.appAccessToken || !state.appRefreshToken) return;
      if (!isSessionUsable()) {
        void logoutAdmin({ silent: true, reason: "missing_refresh_token" });
        return;
      }
      void ensureValidAdminAccessToken().catch(() => null);
    }, PROACTIVE_REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(refreshInterval);
    };
  }, [
    accessToken,
    accessTokenExpired,
    hasHydrated,
    isLoggedIn,
    pathname,
    redirectParam,
    refreshToken,
    router,
  ]);

  if (pathname === LOGIN_PATH) {
    return "ready" as const;
  }

  if (!hasHydrated || isRefreshing || authCheckState !== "ready") {
    return "loading" as const;
  }

  if (!isLoggedIn || (!accessToken && refreshToken)) {
    return "loading" as const;
  }

  if (!isLoggedIn || !accessToken) {
    return "blocked" as const;
  }

  return "ready" as const;
}
