"use client";

import { useMemo } from "react";
import useAuthStore from "@/store/useAuthStore";

/**
 * Hook để kiểm tra permission của user hiện tại
 *
 * @example
 * // Kiểm tra một permission cụ thể
 * const canWritePosts = usePermission("posts", "write");
 *
 * // Kiểm tra nhiều permissions (AND - cần tất cả)
 * const canManagePosts = usePermission(["posts:write", "posts:delete"], "all");
 *
 * // Kiểm tra nhiều permissions (OR - cần ít nhất một)
 * const canDoSomething = usePermission(["posts:read", "posts:write"], "any");
 */
export function usePermission(
  resourceOrPermissions: string | string[],
  actionOrMode?: string,
): boolean {
  const appUser = useAuthStore((state) => state.appUser);

  return useMemo(() => {
    const userPermissions = appUser?.permissions || [];

    // Case 1: Truyền vào resource và action riêng biệt
    // usePermission("posts", "write") -> kiểm tra "posts:write"
    if (typeof resourceOrPermissions === "string" && typeof actionOrMode === "string") {
      const permission = `${resourceOrPermissions}:${actionOrMode}`;
      return userPermissions.includes(permission);
    }

    // Case 2: Truyền vào array permissions với mode
    if (Array.isArray(resourceOrPermissions)) {
      const mode = actionOrMode as "all" | "any" | undefined;

      if (mode === "all") {
        // Cần TẤT CẢ permissions trong array
        return resourceOrPermissions.every((perm) => userPermissions.includes(perm));
      } else if (mode === "any") {
        // Cần ÍT NHẤT MỘT permission trong array
        return resourceOrPermissions.some((perm) => userPermissions.includes(perm));
      } else {
        // Default: kiểm tra như "all" (cần tất cả)
        return resourceOrPermissions.every((perm) => userPermissions.includes(perm));
      }
    }

    // Case 3: Truyền vào một permission string trực tiếp
    // usePermission("posts:write")
    if (typeof resourceOrPermissions === "string") {
      return userPermissions.includes(resourceOrPermissions);
    }

    return false;
  }, [appUser, resourceOrPermissions, actionOrMode]);
}

/**
 * Hook để kiểm tra user có role cụ thể hay không
 *
 * @example
 * const isAdmin = useHasRole("admin");
 * const isSystemAdmin = useHasRole("system_admin");
 */
export function useHasRole(roleName: string | string[]): boolean {
  const appUser = useAuthStore((state) => state.appUser);

  return useMemo(() => {
    const userRoles = appUser?.roles || [];

    if (Array.isArray(roleName)) {
      return roleName.some((role) => userRoles.includes(role));
    }

    return userRoles.includes(roleName);
  }, [appUser, roleName]);
}

/**
 * Hook để lấy tất cả permissions của user hiện tại
 *
 * @example
 * const permissions = useAllPermissions();
 */
export function useAllPermissions(): string[] {
  const appUser = useAuthStore((state) => state.appUser);
  return appUser?.permissions || [];
}

/**
 * Hook để lấy tất cả roles của user hiện tại
 *
 * @example
 * const roles = useAllRoles();
 */
export function useAllRoles(): string[] {
  const appUser = useAuthStore((state) => state.appUser);
  return appUser?.roles || [];
}

/**
 * Hook để kiểm tra user có bất kỳ quyền hạn nào không
 *
 * @example
 * const hasAnyPermission = useHasAnyPermission();
 */
export function useHasAnyPermission(): boolean {
  const appUser = useAuthStore((state) => state.appUser);
  return (appUser?.permissions?.length || 0) > 0;
}

/**
 * Hook để kiểm tra user có phải là system_admin không
 *
 * @example
 * const isSystemAdmin = useIsSystemAdmin();
 */
export function useIsSystemAdmin(): boolean {
  return useHasRole("system_admin");
}

/**
 * Hook để kiểm tra user có phải là admin (admin hoặc system_admin) không
 *
 * @example
 * const isAdmin = useIsAdmin();
 */
export function useIsAdmin(): boolean {
  return useHasRole(["admin", "system_admin"]);
}
