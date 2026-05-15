"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ensureValidAdminAccessToken } from "@/lib/auth/admin-auth";
import useAuthStore from "@/store/useAuthStore";

const LOGIN_PATH = "/admin/login";

function AdminAuthLoadingScreen() {
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
  const [isRestoringSession, setIsRestoringSession] = useState(false);

  useEffect(() => {
    if (!hasHydrated || pathname === LOGIN_PATH) return;

    let cancelled = false;

    const restoreSession = async () => {
      const needsRefresh = Boolean(
        accessToken &&
          accessTokenExpired &&
          accessTokenExpired <= Date.now() &&
          refreshToken,
      );

      if (accessToken && isLoggedIn && !needsRefresh) return;

      if (!refreshToken) {
        router.replace(`${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      setIsRestoringSession(true);

      try {
        const nextToken = await ensureValidAdminAccessToken();

        if (!nextToken && !cancelled) {
          router.replace(`${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`);
        }
      } catch {
        if (!cancelled) {
          router.replace(`${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`);
        }
      } finally {
        if (!cancelled) {
          setIsRestoringSession(false);
        }
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [accessToken, accessTokenExpired, hasHydrated, isLoggedIn, pathname, refreshToken, router]);

  if (pathname === LOGIN_PATH) {
    return <>{children}</>;
  }

  if (!hasHydrated || isRefreshing || isRestoringSession) {
    return <AdminAuthLoadingScreen />;
  }

  if (!isLoggedIn || !accessToken) {
    return null;
  }

  return <>{children}</>;
}
