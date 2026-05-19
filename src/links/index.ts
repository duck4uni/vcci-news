const normalizeOrigin = (value?: string | null) => value?.trim().replace(/\/+$/, "") || "";

const readOrigin = (key: "NEXT_PUBLIC_BACKEND_HOST" | "NEXT_PUBLIC_FRONTEND_HOST") => {
  const envOrigin = normalizeOrigin(process.env[key]);
  if (envOrigin) return envOrigin;

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

const links = {
  analyticsGoogle: "G-C9TEK9BS4C",
  apiEndpoint: backendOrigin ? `${backendOrigin}/api/v1.0` : "/api/v1.0",
  imageEndpoint: backendOrigin ? `${backendOrigin}/uploads/` : "/uploads/",
  backendHost: backendUrl?.hostname || "",
  backendProtocol: backendUrl?.protocol.replace(":", "") || "",
  backendPathname: backendUrl?.pathname.replace(/\/+$/, "") || "/",
  siteURL: frontendUrl ? `${frontendUrl.origin}/` : "/",
};

export default links;
