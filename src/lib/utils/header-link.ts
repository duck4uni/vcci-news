/**
 * Build a static link from a slug and optional parent static link.
 *
 * Examples:
 * - buildStaticLink("", "/") → "/"
 * - buildStaticLink("about", "/") → "/about"
 * - buildStaticLink("about", "/parent") → "/parent/about"
 * - buildStaticLink("about", "/parent/") → "/parent/about"
 */
export function buildStaticLink(slug: string, parentStaticLink?: string | null): string {
  const cleanSlug = slug.trim().replace(/^\/+|\/+$/g, "");
  if (!cleanSlug) {
    return parentStaticLink?.trim() || "/";
  }

  const cleanParent = (parentStaticLink ?? "").trim().replace(/\/+$/, "");
  if (!cleanParent || cleanParent === "/") {
    return `/${cleanSlug}`;
  }

  return `${cleanParent}/${cleanSlug}`;
}
