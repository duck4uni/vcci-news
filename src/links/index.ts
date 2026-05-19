const DEFAULT_BACKEND_ORIGIN = "https://vietprodev.duckdns.org/gateway/vcci-news-backend";

const normalizeOrigin = (value?: string | null) => value?.trim().replace(/\/+$/, "") || "";

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
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

  const cleanPath = trimmed.replace(/^\/+/, "").replace(/^api\/uploads\//, "uploads/");
  if (cleanPath.startsWith("uploads/")) {
    return backendOrigin ? `${backendOrigin}/${cleanPath}` : `/${cleanPath}`;
  }

  return `${uploadsEndpoint}${cleanPath}`;
};

const links = {
  analyticsGoogle: "G-C9TEK9BS4C",
  apiEndpoint: backendOrigin ? `${backendOrigin}/api/v1.0` : "/api/v1.0",
  imageEndpoint: uploadsEndpoint,
  resolveUploadUrl,
  backendHost: backendUrl?.hostname || "",
  backendProtocol: backendUrl?.protocol.replace(":", "") || "",
  backendPathname: backendUrl?.pathname.replace(/\/+$/, "") || "/",
  siteURL: frontendUrl ? `${frontendUrl.origin}/` : "/",
};

export default links;
