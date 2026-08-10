const DEFAULT_BACKEND_ORIGIN = "https://news.vccihcm.vn";
const DEFAULT_FRONTEND_ORIGIN = "https://news.vccihcm.vn";
const LEGACY_MEDIA_HOSTS = new Set([
  "vietprodev.duckdns.org",
  "vcci-hcm.org.vn",
  "vccihcm.vn",
]);

const normalizeOrigin = (value?: string | null) =>
  value?.trim().replace(/\/+$/, "").replace(/\/api\/v\d+\.\d+$/, "") || "";

const normalizeUploadPath = (pathname: string) => {
  if (pathname.includes("/api/uploads/")) {
    return pathname.replace(/^.*\/api\/uploads\//, "/uploads/");
  }

  if (pathname.includes("/images/")) {
    return pathname.replace(/^.*\/images\//, "/uploads/images/");
  }

  if (pathname.startsWith("images/")) {
    return pathname.replace(/^images\//, "/uploads/images/");
  }

  if (pathname.includes("/uploads/")) {
    return pathname.replace(/^.*\/uploads\//, "/uploads/");
  }

  if (pathname.startsWith("uploads/")) {
    return pathname.replace(/^uploads\//, "/uploads/");
  }

  if (pathname.includes("/wp-content/uploads/")) {
    return pathname.replace(/^.*\/wp-content\/uploads\//, "/uploads/");
  }

  return pathname;
};

const readOrigin = (key: "NEXT_PUBLIC_BACKEND_HOST" | "NEXT_PUBLIC_FRONTEND_HOST") => {
  const envOrigin = normalizeOrigin(
    key === "NEXT_PUBLIC_BACKEND_HOST"
      ? process.env.NEXT_PUBLIC_BACKEND_HOST
      : process.env.NEXT_PUBLIC_FRONTEND_HOST,
  );
  if (envOrigin) return envOrigin;
  if (key === "NEXT_PUBLIC_BACKEND_HOST" && process.env.NODE_ENV === "production") {
    return DEFAULT_BACKEND_ORIGIN;
  }
  if (key === "NEXT_PUBLIC_FRONTEND_HOST" && process.env.NODE_ENV === "production") {
    return DEFAULT_FRONTEND_ORIGIN;
  }

  if (typeof window !== "undefined" && key === "NEXT_PUBLIC_FRONTEND_HOST") {
    return normalizeOrigin(window.location.origin);
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(`${key} is missing`);
  }

  return "";
};

const toUrl = (value: string) => {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Invalid origin: ${value}`);
    }
    return null;
  }
};

const backendOrigin = readOrigin("NEXT_PUBLIC_BACKEND_HOST");
const frontendOrigin = readOrigin("NEXT_PUBLIC_FRONTEND_HOST");

const backendUrl = toUrl(backendOrigin);
const frontendUrl = toUrl(frontendOrigin);
const uploadsEndpoint = backendOrigin ? `${backendOrigin}/uploads/` : "/uploads/";

export const resolveUploadUrl = (value?: string | null) => {
  const trimmed = value?.trim();

  if (!trimmed) return "";
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);

      // Keep URLs from current backend/frontend origins as-is
      const currentOrigins = [backendOrigin, frontendOrigin].filter(Boolean);
      if (currentOrigins.some(origin => url.origin === origin)) {
        return trimmed;
      }

      const normalizedPath = normalizeUploadPath(url.pathname);

      if (normalizedPath !== url.pathname) {
        return backendOrigin ? `${backendOrigin}${normalizedPath}` : normalizedPath;
      }

      if (LEGACY_MEDIA_HOSTS.has(url.hostname)) {
        // Keep legacy media URLs as-is since they already have correct domain
        return trimmed;
      }
    } catch {
      return trimmed;
    }

    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    if (
      trimmed.startsWith("/uploads/") ||
      trimmed.startsWith("/api/uploads/") ||
      trimmed.startsWith("/images/") ||
      trimmed.startsWith("/wp-content/uploads/")
    ) {
      const cleanPath = normalizeUploadPath(trimmed).replace(/^\/+/, "");
      return backendOrigin ? `${backendOrigin}/${cleanPath}` : `/${cleanPath}`;
    }

    return trimmed;
  }

  const cleanPath = normalizeUploadPath(trimmed).replace(/^\/+/, "");
  if (
    cleanPath.startsWith("uploads/") ||
    cleanPath.startsWith("images/") ||
    cleanPath.startsWith("wp-content/uploads/")
  ) {
    return backendOrigin ? `${backendOrigin}/${cleanPath}` : `/${cleanPath}`;
  }

  return `${uploadsEndpoint}${cleanPath}`;
};

const links = {
  analyticsGoogle: "G-C9TEK9BS4C",
  // CHỈ dùng origin làm baseURL — orval-generated endpoints đã chứa path
  // đầy đủ dạng `/api/v1.0/<resource>` nếu không axios sẽ ghép thành double prefix
  // (vd: `https://news.vccihcm.vn/api/v1.0` + `/api/v1.0/banner` => .../api/v1.0/api/v1.0/banner).
  apiEndpoint: backendOrigin || "",
  imageEndpoint: uploadsEndpoint,
  resolveUploadUrl,
  backendHost: backendUrl?.hostname || "",
  backendProtocol: backendUrl?.protocol.replace(":", "") || "",
  backendPathname: backendUrl?.pathname.replace(/\/+$/, "") || "/",
  siteURL: frontendUrl ? `${frontendUrl.origin}/` : "/",
};

export default links;
