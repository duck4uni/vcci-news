"use client";

import React, { useEffect, useState } from "react";
import { usePermission } from "@/hooks/usePermission";
import useAuthStore from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface PagePermissionGuardProps {
  children: React.ReactNode;
  /** Required permission để truy cập page, ví dụ: "posts:read" */
  requiredPermission?: string;
  /** Nhiều permissions - cần ít nhất một */
  requiredAnyPermission?: string[];
  /** Nếu không có quyền, redirect đến trang này */
  redirectTo?: string;
  /** Component hiển thị khi không có quyền (thay vì redirect) */
  fallbackComponent?: React.ReactNode;
}

/**
 * Component để bảo vệ page dựa trên permissions
 * - Kiểm tra user có permission cần thiết không
 * - Nếu không có quyền, redirect hoặc hiển thị fallback
 * - Nếu chưa hydrate xong auth store, hiển thị loading
 */
export function PagePermissionGuard({
  children,
  requiredPermission,
  requiredAnyPermission,
  redirectTo = "/admin/no-permission",
  fallbackComponent,
}: PagePermissionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const appIsLoggedIn = useAuthStore((state) => state.appIsLoggedIn);

  // Kiểm tra permission
  const hasPermission = usePermission(
    requiredPermission?.split(":")[0] || "",
    requiredPermission?.split(":")[1] || ""
  );

  // Kiểm tra nếu cần ít nhất một permission
  const hasAnyPermission = usePermission(
    requiredAnyPermission || [],
    "any"
  );

  useEffect(() => {
    // Chờ hydrate xong
    if (!hasHydrated) {
      return;
    }

    setIsChecking(false);

    // Nếu chưa đăng nhập, redirect đến login
    if (!appIsLoggedIn) {
      router.push("/admin/login");
      return;
    }

    // Kiểm tra permission
    const hasAccess = requiredPermission
      ? hasPermission
      : requiredAnyPermission
      ? hasAnyPermission
      : true;

    if (!hasAccess) {
      if (fallbackComponent) {
        // Đã render fallback component ở return bên dưới
      } else {
        router.push(redirectTo);
      }
    }
  }, [hasHydrated, appIsLoggedIn, hasPermission, hasAnyPermission, requiredPermission, requiredAnyPermission, redirectTo, router, fallbackComponent]);

  // Loading state - chờ hydrate
  if (!hasHydrated || isChecking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#063e8e]" />
          <p className="text-sm text-slate-500">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập - sẽ redirect
  if (!appIsLoggedIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#063e8e]" />
          <p className="text-sm text-slate-500">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  // Kiểm tra permission cuối cùng
  const hasAccess = requiredPermission
    ? hasPermission
    : requiredAnyPermission
    ? hasAnyPermission
    : true;

  // Không có quyền và có fallback component
  if (!hasAccess && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Không có quyền - sẽ redirect
  if (!hasAccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#063e8e]" />
          <p className="text-sm text-slate-500">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Mapping từ URL path -> required permission
 * Sử dụng cho các page admin thông thường
 */
export const ADMIN_PAGE_PERMISSIONS: Record<string, string> = {
  "/admin": "", // Dashboard - không cần permission cụ thể
  "/admin/base-config": "settings:read",
  "/admin/header-config": "categories:read",
  "/admin/news": "posts:read",
  "/admin/tags": "tags:read",
  "/admin/videos": "videos:read",
  "/admin/contact-management/newsletter-emails": "newsletter:read",
  "/admin/media": "files:read",
  "/admin/roles": "roles:read",
  "/admin/users": "users:read",
};

/**
 * Lấy required permission cho một path
 */
export function getRequiredPermissionForPath(path: string): string | undefined {
  // Exact match
  if (ADMIN_PAGE_PERMISSIONS[path]) {
    return ADMIN_PAGE_PERMISSIONS[path] || undefined;
  }

  // Prefix match (cho các sub-paths)
  for (const [basePath, permission] of Object.entries(ADMIN_PAGE_PERMISSIONS)) {
    if (path.startsWith(basePath + "/")) {
      return permission || undefined;
    }
  }

  // Default - không cần permission
  return undefined;
}

/**
 * Component tự động kiểm tra permission dựa trên URL
 * Sử dụng trong admin layout
 */
export function AutoPagePermissionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const requiredPermission = getRequiredPermissionForPath(pathname);

  if (!requiredPermission) {
    return <>{children}</>;
  }

  return (
    <PagePermissionGuard requiredPermission={requiredPermission}>
      {children}
    </PagePermissionGuard>
  );
}
