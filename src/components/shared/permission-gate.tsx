"use client";

import React from "react";
import { usePermission } from "@/hooks/usePermission";

interface PermissionGateProps {
  children: React.ReactNode;
  /** Một permission duy nhất, ví dụ: "posts:write" HOẶC resource + action riêng */
  required?: string;
  /** Resource khi dùng cùng với requiredAction */
  resource?: string;
  /** Action khi dùng cùng với requiredResource */
  action?: string;
  /** Nhiều permissions - cần tất cả (AND) hoặc ít nhất một (OR) */
  requires?: string[];
  /** Mode khi dùng requires: "all" = cần tất cả, "any" = cần ít nhất một */
  mode?: "all" | "any";
  /** Component thay thế khi không có quyền */
  fallback?: React.ReactNode;
  /** Ẩn hoàn toàn khi không có quyền (mặc định: false - hiển thị fallback) */
  hidden?: boolean;
}

/**
 * Component để kiểm soát hiển thị dựa trên permissions
 *
 * @example
 * // Kiểm tra một permission
 * <PermissionGate required="posts:write">
 *   <Button>Create Post</Button>
 * </PermissionGate>
 *
 * // Kiểm tra với resource + action riêng
 * <PermissionGate resource="posts" action="write">
 *   <Button>Create Post</Button>
 * </PermissionGate>
 *
 * // Cần nhiều permissions
 * <PermissionGate requires={["posts:write", "posts:delete"]} mode="all">
 *   <Button>Full Post Control</Button>
 * </PermissionGate>
 *
 * // Hiển thị fallback khi không có quyền
 * <PermissionGate required="posts:delete" fallback={<DisabledButton />}>
 *   <Button>Delete</Button>
 * </PermissionGate>
 */
export function PermissionGate({
  children,
  required,
  resource,
  action,
  requires,
  mode = "all",
  fallback = null,
  hidden = false,
}: PermissionGateProps) {
  // Xác định permission cuối cùng
  let finalPermission: string | string[];

  if (required) {
    finalPermission = required;
  } else if (resource && action) {
    finalPermission = `${resource}:${action}`;
  } else if (requires) {
    finalPermission = requires;
  } else {
    console.warn("[PermissionGate] Missing permission configuration");
    return hidden ? null : <>{fallback}</>;
  }

  // Kiểm tra permission với hook
  // Khi finalPermission là string có dấu ":" (vd "roles:write"), truyền 1 tham số
  // Khi là string không có ":" + có resource/action, truyền 2 tham số riêng
  // Khi là array, truyền array + mode
  const hasPermission = usePermission(
    finalPermission,
    Array.isArray(finalPermission) ? mode : undefined,
  );

  if (hasPermission) {
    return <>{children}</>;
  }

  if (hidden) {
    return null;
  }

  return <>{fallback}</>;
}

/**
 * Component để hiển thị thông báo khi không có quyền
 * Sử dụng khi toàn bộ trang bị chặn
 */
export function NoPermissionMessage({
  message = "Tài khoản của bạn hiện không có quyền hạn để truy cập trang này. Vui lòng liên hệ bộ phận kỹ thuật để được hỗ trợ.",
  showContactButton = true,
}: {
  message?: string;
  showContactButton?: boolean;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-red-50 p-6">
        <svg
          className="h-16 w-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h2 className="mb-3 text-2xl font-bold text-gray-900">Không có quyền truy cập</h2>

      <p className="mb-8 max-w-md text-gray-600">{message}</p>

      {showContactButton && (
        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Quay lại
          </button>
          <a
            href="/admin"
            className="rounded-xl bg-[#063e8e] px-6 py-3 font-medium text-white transition-colors hover:bg-[#063e8e]/90"
          >
            Về trang chính
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Component để redirect khi không có quyền
 * Sử dụng trong các page components
 */
export function PermissionRedirect({
  required,
  redirectTo = "/admin/no-permission",
}: {
  required: string | string[];
  redirectTo?: string;
}) {
  const hasPermission = usePermission(
    Array.isArray(required) ? required : [required],
    "any",
  );

  React.useEffect(() => {
    if (!hasPermission) {
      window.location.href = redirectTo;
    }
  }, [hasPermission, redirectTo]);

  if (!hasPermission) {
    return null;
  }

  return null;
}
