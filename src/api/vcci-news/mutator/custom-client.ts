import Axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import links from "@/links";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";

interface RetriableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

const shouldSkipAuthHandling = (url?: string | null) => {
  if (!url) return false;
  return /\/auth\/(login|refresh|logout)(\?|$)/.test(url);
};

const shouldHandleAdminAuth = () => {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/admin");
};

const instance = Axios.create({
  baseURL: links.apiEndpoint,
  withCredentials: false,
});

instance.interceptors.request.use((config) => {
  const authStore = useAuthStore.getState();
  if (authStore.appAccessToken) {
    config.headers.set("Authorization", `Bearer ${authStore.appAccessToken}`);
  }

  return config;
});

instance.interceptors.response.use(
  async (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableAxiosRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipAuthHandling(originalRequest.url) ||
      !shouldHandleAdminAuth()
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { appRefreshToken } = useAuthStore.getState();

          if (!appRefreshToken) {
            return null;
          }

          try {
            const { data } = await instance.post("/api/v1.0/auth/refresh", {
              refresh_token: appRefreshToken,
            });

            const refreshData = data?.responseData ?? data?.data?.responseData ?? data;

            if (!refreshData?.access_token || !refreshData?.refresh_token) {
              throw new Error("Thiếu access token mới từ API.");
            }

            useAuthStore.getState().setAuthSession({
              accessToken: refreshData.access_token,
              refreshToken: refreshData.refresh_token,
              persistSession: useAuthStore.getState().appPersistSession,
            });

            return refreshData.access_token;
          } catch (err) {
            return null;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const nextAccessToken = await refreshPromise;

      if (!nextAccessToken) {
        useAuthStore.getState().resetStore();
        useUserStore.getState().clearUser();
        if (typeof window !== "undefined") {
          const currentPath = `${window.location.pathname}${window.location.search}`;
          const redirect =
            currentPath.startsWith("/admin") &&
              currentPath !== "/admin/login"
              ? `?redirect=${encodeURIComponent(currentPath)}`
              : "";
          window.location.replace(`/admin/login${redirect}`);
        }
        return Promise.reject(error);
      }

      const headers = AxiosHeaders.from(originalRequest.headers);
      headers.set("Authorization", `Bearer ${nextAccessToken}`);
      originalRequest.headers = headers;

      return instance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export async function useCustomClient<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  const response = await instance({ ...config, ...options });
  return response.data as T;
};


export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
