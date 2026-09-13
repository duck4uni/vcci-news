"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";

const LOGIN_PATH = "/admin/login";
const CHANGE_PASSWORD_PATH = "/admin/change-password";

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
  const mustChangePassword = useUserStore((state) => state.appUser?.must_change_password === true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (hasHydrated && !isLoggedIn && pathname !== LOGIN_PATH) {
      const currentPath = `${window.location.pathname}${window.location.search}`;
      const isChangePasswordPage = currentPath.startsWith(CHANGE_PASSWORD_PATH);
      const redirect =
        currentPath.startsWith("/admin") &&
          currentPath !== LOGIN_PATH &&
          !isChangePasswordPage
          ? `?redirect=${encodeURIComponent(currentPath)}`
          : "";
      window.location.replace(`/admin/login${redirect}`);
    }
  }, [hasHydrated, isLoggedIn, pathname]);

  // Force redirect to change-password page if user must change password
  useEffect(() => {
    if (
      isLoggedIn &&
      mustChangePassword &&
      pathname !== CHANGE_PASSWORD_PATH &&
      pathname !== LOGIN_PATH
    ) {
      router.replace(CHANGE_PASSWORD_PATH);
    }
  }, [isLoggedIn, mustChangePassword, pathname, router]);

  if (pathname === LOGIN_PATH || pathname === CHANGE_PASSWORD_PATH) {
    return <>{children}</>;
  }

  if (!hasHydrated || !isLoggedIn || !accessToken) {
    return <AdminAuthLoadingScreen />;
  }

  if (mustChangePassword) {
    return <AdminAuthLoadingScreen />;
  }

  return <>{children}</>;
}

export function useAdminAuthStatus() {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isLoggedIn = useAuthStore((state) => state.appIsLoggedIn);
  const accessToken = useAuthStore((state) => state.appAccessToken);
  const pathname = usePathname();

  useEffect(() => {
    if (hasHydrated && !isLoggedIn && pathname !== LOGIN_PATH) {
      const currentPath = `${window.location.pathname}${window.location.search}`;
      const isChangePasswordPage = currentPath.startsWith(CHANGE_PASSWORD_PATH);
      const redirect =
        currentPath.startsWith("/admin") &&
          currentPath !== LOGIN_PATH &&
          !isChangePasswordPage
          ? `?redirect=${encodeURIComponent(currentPath)}`
          : "";
      window.location.replace(`/admin/login${redirect}`);
    }
  }, [hasHydrated, isLoggedIn, pathname]);

  if (pathname === LOGIN_PATH) {
    return "ready" as const;
  }

  if (!hasHydrated || !isLoggedIn || !accessToken) {
    return "loading" as const;
  }

  return "ready" as const;
}
