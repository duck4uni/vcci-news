"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";

const DEFAULT_ADMIN_PATH = "/admin";

function normalizeRedirectPath(redirect: string | null) {
  if (!redirect) return DEFAULT_ADMIN_PATH;

  try {
    const url = new URL(redirect, "http://localhost");
    const pathname = url.pathname;
    const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
    const isAuthPath =
      pathname === "/admin/login" ||
      pathname.startsWith("/admin/login/") ||
      pathname === "/admin/change-password";

    if (!isAdminPath || isAuthPath) return DEFAULT_ADMIN_PATH;

    return `${pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_ADMIN_PATH;
  }
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const userHasHydrated = useUserStore((state) => state._hasHydrated);
  const appUser = useUserStore((state) => state.appUser);
  const authHasHydrated = useAuthStore((state) => state._hasHydrated);
  const isLoggedIn = useAuthStore((state) => state.appIsLoggedIn);

  useEffect(() => {
    if (!userHasHydrated || !authHasHydrated || !isLoggedIn || !appUser) return;

    const redirect = normalizeRedirectPath(
      new URLSearchParams(window.location.search).get("redirect"),
    );

    if (appUser.must_change_password) {
      router.replace("/admin/change-password");
    } else {
      router.replace(redirect);
    }
  }, [appUser, authHasHydrated, isLoggedIn, router, userHasHydrated]);

  return <>{children}</>;
}
