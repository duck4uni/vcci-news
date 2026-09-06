// Types
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  user_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EditForm {
  name: string;
  description: string;
  permissions: string[];
}

// All available permissions
export const ALL_PERMISSIONS = [
  { resource: "settings", actions: ["read", "write"], label: "Cấu hình chung" },
  { resource: "categories", actions: ["read", "write", "delete"], label: "Danh mục" },
  { resource: "posts", actions: ["read", "write", "delete", "publish"], label: "Bài viết" },
  { resource: "tags", actions: ["read", "write", "delete"], label: "Tags" },
  { resource: "videos", actions: ["read", "write", "delete"], label: "Videos" },
  { resource: "newsletter", actions: ["read", "delete"], label: "Newsletter" },
  { resource: "files", actions: ["read", "write", "delete"], label: "Files/Media" },
  { resource: "advertisements", actions: ["read", "write", "delete"], label: "Quảng cáo" },
  { resource: "roles", actions: ["read", "write", "delete"], label: "Roles (Quản lý vai trò)" },
  { resource: "users", actions: ["read", "write", "delete"], label: "Users (Quản lý người dùng)" },
];

// System roles không cho phép xóa
export const SYSTEM_ROLES = ["system_admin", "admin", "new"];
