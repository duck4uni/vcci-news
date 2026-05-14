import Axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import {
  ensureValidAdminAccessToken,
  refreshAdminAccessToken,
} from "@/lib/auth/admin-auth";

interface RetriableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const createAxiosInstance = () => {
  const instance = Axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1.0`,
    withCredentials: true,
  });

  instance.interceptors.request.use(async (config) => {
    if (shouldSkipAuthHandling(config.url)) {
      return config;
    }

    const token = await ensureValidAdminAccessToken().catch(() => null);

    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
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
        shouldSkipAuthHandling(originalRequest.url)
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const nextAccessToken = await refreshAdminAccessToken();

        if (!nextAccessToken) {
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

  return instance;
};

const AXIOS_INSTANCE = createAxiosInstance();

const shouldSkipAuthHandling = (url?: string | null) => {
  if (!url) return false;
  return /\/auth\/(login|refresh|logout)(\?|$)/.test(url);
};

const convertHeaders = (headers?: HeadersInit): Record<string, string> | undefined => {
  if (!headers) return undefined;

  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  if (Array.isArray(headers)) {
    const result: Record<string, string> = {};
    headers.forEach(([key, value]) => {
      result[key] = value;
    });
    return result;
  }

  return headers as Record<string, string>;
};

const useCustomClient = <T>(url: string, options?: RequestInit): Promise<T> => {
  const source = Axios.CancelToken.source();

  const axiosConfig: AxiosRequestConfig = {
    url,
    method: options?.method || "GET",
    headers: convertHeaders(options?.headers),
    data: options?.body,
    signal: options?.signal || undefined,
    cancelToken: source.token,
  };

  const promise = AXIOS_INSTANCE(axiosConfig).then(({ data, status }) => {
    return data instanceof Blob ? data : { ...data, statusCode: status };
  });

  // @ts-expect-error not exist cancel
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };
  return promise;
};

export { useCustomClient };

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
