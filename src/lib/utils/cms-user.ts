import type { RawUser, UserSummary } from "@/api/vcci-news/types/user";

/**
 * Normalize a raw user object from the API into a UserSummary.
 * Returns null if the user is missing or has no id.
 */
export function normalizeUser(user: RawUser | null | undefined): UserSummary | null {
  if (!user || typeof user !== "object" || !user.id) return null;
  const firstName = String(user.first_name ?? "").trim();
  const lastName = String(user.last_name ?? "").trim();
  const fullName =
    String(user.full_name ?? "").trim() ||
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    String(user.username ?? "").trim() ||
    String(user.email ?? "").trim();
  return {
    id: String(user.id),
    email: String(user.email ?? ""),
    username: user.username ? String(user.username) : null,
    first_name: firstName || null,
    last_name: lastName || null,
    full_name: fullName,
    avatar_url: user.avatar_url ? String(user.avatar_url) : null,
  };
}
