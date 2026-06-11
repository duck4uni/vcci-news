"use client";

import { toast } from "sonner";
import useAuthStore, {
  type AuthenticatedAdminSession,
  type AuthenticatedAdminUser,
} from "@/store/useAuthStore";
import links from "@/links";

const AUTH_BASE_URL = `${links.apiEndpoint}/auth`;
const SESSION_EXPIRED_MESSAGE = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";

interface AuthEnvelope<T> {
  message?: string | null;
  message_en?: string | null;
  responseData?: T;
  data?: {
    responseData?: T;
  };
}

interface AuthErrorPayload {
  message?: string | null;
  message_en?: string | null;
  error?: {
    message?: {
      vi?: string | null;
      en?: string | null;
    };
  };
}

interface LoginResponseData {
  user?: Partial<AuthenticatedAdminUser> | null;
  session?: Partial<AuthenticatedAdminSession> | null;
  access_token?: string | null;
  refresh_token?: string | null;
  expires_in?: number | null;
  token_type?: string | null;
}

type MeResponseData = Partial<AuthenticatedAdminUser>;

interface RefreshResponseData {
  session?: Partial<AuthenticatedAdminSession> | null;
  access_token?: string | null;
  refresh_token?: string | null;
  expires_in?: number | null;
  token_type?: string | null;
}

interface AuthRequestOptions extends RequestInit {
  skipAuthHeader?: boolean;
  authToken?: string | null;
}

type AuthFailureReason = "missing_refresh_token" | "refresh_failed";

let refreshPromise: Promise<string | null> | null = null;
let forcedLogoutPromise: Promise<void> | null = null;
const ACCESS_TOKEN_EXPIRY_SKEW_SECONDS = 300;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getEnvelopeData = <T>(payload: AuthEnvelope<T>) =>
  payload.responseData ?? payload.data?.responseData;

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (!isObject(payload)) return fallback;

  const apiPayload = payload as AuthErrorPayload;
  return (
    apiPayload.error?.message?.vi ??
    apiPayload.message ??
    apiPayload.message_en ??
    fallback
  );
};

const normalizeUser = (user?: Partial<AuthenticatedAdminUser> | null): AuthenticatedAdminUser | null => {
  if (!user?.id || !user.email || !user.username) return null;

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    first_name: user.first_name ?? null,
    last_name: user.last_name ?? null,
    roles: Array.isArray(user.roles) ? user.roles.filter((value): value is string => typeof value === "string") : [],
    permissions: Array.isArray(user.permissions)
      ? user.permissions.filter((value): value is string => typeof value === "string")
      : [],
    status: user.status ?? null,
    last_login_at: user.last_login_at ?? null,
  };
};

const normalizeSession = (
  session?: Partial<AuthenticatedAdminSession> | null,
): AuthenticatedAdminSession | null => {
  if (!session) return null;

  return {
    id: typeof session.id === "string" ? session.id : null,
    expires_at: typeof session.expires_at === "string" ? session.expires_at : null,
    refresh_expires_at:
      typeof session.refresh_expires_at === "string" ? session.refresh_expires_at : null,
  };
};

const getJwtExpiresAt = (token?: string | null) => {
  if (!token) return null;

  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded =
      typeof window === "undefined"
        ? Buffer.from(normalizedPayload, "base64").toString("utf8")
        : window.atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "="));
    const parsed = JSON.parse(decoded) as { exp?: unknown };
    const exp = typeof parsed.exp === "number" ? parsed.exp : null;

    return exp ? (exp - ACCESS_TOKEN_EXPIRY_SKEW_SECONDS) * 1000 : null;
  } catch {
    return null;
  }
};

async function requestAuth<T>(
  path: string,
  init?: AuthRequestOptions,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  if (!init?.skipAuthHeader) {
    const token = init?.authToken ?? useAuthStore.getState().appAccessToken;
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  const data = (await response.json().catch(() => ({}))) as AuthEnvelope<T> & AuthErrorPayload;

  if (!response.ok) {
    const error = new Error(getErrorMessage(data, "Yêu cầu xác thực thất bại.")) as Error & {
      status?: number;
      payload?: unknown;
    };

    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return getEnvelopeData(data) as T;
}

const redirectToLogin = () => {
  if (typeof window === "undefined") return;

  const currentPath = `${window.location.pathname}${window.location.search}`;
  const redirect = currentPath.startsWith("/admin") && currentPath !== "/admin/login"
    ? `?redirect=${encodeURIComponent(currentPath)}`
    : "";

  window.location.replace(`/admin/login${redirect}`);
};

const markSessionExpiredAndNotify = () => {
  const store = useAuthStore.getState();

  if (!store.appSessionExpiredNotified) {
    store.markSessionExpiredNotified(true);
    toast.error(SESSION_EXPIRED_MESSAGE);
  }
};

export async function loginAdmin(
  email: string,
  password: string,
  options?: { persistSession?: boolean },
) {
  const payload = await requestAuth<LoginResponseData>("/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    skipAuthHeader: true,
  });

  if (!payload.access_token || !payload.refresh_token || !payload.expires_in) {
    throw new Error("Thiếu dữ liệu phiên đăng nhập từ API.");
  }

  const me = await requestAuth<MeResponseData>("/me", {
    method: "GET",
    authToken: payload.access_token,
  }).catch(() => payload.user ?? null);

  const normalizedUser = normalizeUser(me ?? payload.user);

  useAuthStore.getState().setAuthSession({
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresIn: payload.expires_in,
    accessTokenExpired: getJwtExpiresAt(payload.access_token),
    user: normalizedUser,
    session: normalizeSession(payload.session),
    persistSession: options?.persistSession === true,
  });

  useAuthStore.getState().setAppUser(normalizedUser);

  return payload;
}

export async function logoutAdmin(options?: {
  silent?: boolean;
  redirectToLogin?: boolean;
  reason?: AuthFailureReason;
}) {
  const { silent = false, redirectToLogin: shouldRedirect = true, reason } = options ?? {};

  if (forcedLogoutPromise) {
    return forcedLogoutPromise;
  }

  forcedLogoutPromise = (async () => {
    const store = useAuthStore.getState();
    const refreshToken = store.appRefreshToken;

    try {
      await requestAuth("/logout", {
        method: "DELETE",
      });
    } catch {
      // Ignore logout API failure and continue clearing local auth state.
    } finally {
      if (reason === "refresh_failed") {
        markSessionExpiredAndNotify();
      }

      useAuthStore.getState().resetStore();

      if (reason === "refresh_failed") {
        useAuthStore.getState().markSessionExpiredNotified(true);
      } else if (!silent) {
        toast.success("Đã đăng xuất khỏi trang quản trị");
      }

      if (shouldRedirect) {
        redirectToLogin();
      }
    }
  })();

  try {
    await forcedLogoutPromise;
  } finally {
    forcedLogoutPromise = null;
  }
}

export async function refreshAdminAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const store = useAuthStore.getState();
    const refreshToken = store.appRefreshToken;

    if (!refreshToken) {
      await logoutAdmin({ silent: true, reason: "missing_refresh_token" });
      return null;
    }

    store.setAppRefreshing(true);

    try {
      const payload = await requestAuth<RefreshResponseData>("/refresh", {
        method: "POST",
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
        skipAuthHeader: true,
      });

      if (!payload.access_token || !payload.expires_in) {
        throw new Error("Thiếu access token mới từ API.");
      }

      useAuthStore.getState().updateAccessToken({
        accessToken: payload.access_token,
        expiresIn: payload.expires_in,
        accessTokenExpired: getJwtExpiresAt(payload.access_token),
        refreshToken: payload.refresh_token ?? refreshToken,
        session: normalizeSession(payload.session),
      });

      return payload.access_token;
    } catch (error) {
      await logoutAdmin({ silent: true, reason: "refresh_failed" });
      throw error;
    } finally {
      useAuthStore.getState().setAppRefreshing(false);
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function ensureValidAdminAccessToken() {
  const store = useAuthStore.getState();

  if (!store.appAccessToken) {
    if (store.appRefreshToken) {
      return refreshAdminAccessToken();
    }

    return null;
  }

  if (!store.appAccessTokenExpired || store.appAccessTokenExpired > Date.now()) {
    const jwtExpiresAt = getJwtExpiresAt(store.appAccessToken);

    if (!jwtExpiresAt || jwtExpiresAt > Date.now()) {
      return store.appAccessToken;
    }
  }

  return refreshAdminAccessToken();
}

export async function handleAdminUnauthorized() {
  await logoutAdmin({ silent: true, reason: "refresh_failed" });
}

export const adminSessionExpiredMessage = SESSION_EXPIRED_MESSAGE;
