import Axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import links from "@/links";
import {
  ensureValidAdminAccessToken,
  refreshAdminAccessToken,
} from "@/lib/auth/admin-auth";

interface RetriableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const createAxiosInstance = () => {
  const instance = Axios.create({
    baseURL: links.apiEndpoint,
    withCredentials: false,
  });

  instance.interceptors.request.use(async (config) => {
    if (shouldSkipAuthHandling(config.url) || !shouldHandleAdminAuth()) {
      config.withCredentials = false;
      return config;
    }

    config.withCredentials = true;
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
        shouldSkipAuthHandling(originalRequest.url) ||
        !shouldHandleAdminAuth()
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
const GET_CACHE_TTL = 2 * 60 * 1000;
const MAX_GET_CACHE_SIZE = 100;

type CustomClientPromise<T> = Promise<T> & {
  cancel?: () => void;
};

type CachedGetResponse = {
  expiresAt: number;
  value: unknown;
};

const inFlightGetRequests = new Map<string, CustomClientPromise<unknown>>();
const cachedGetResponses = new Map<string, CachedGetResponse>();

const shouldSkipAuthHandling = (url?: string | null) => {
  if (!url) return false;
  return /\/auth\/(login|refresh|logout)(\?|$)/.test(url);
};

const shouldHandleAdminAuth = () => {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/admin");
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

const getRequestMethod = (options?: RequestInit) =>
  (options?.method || "GET").toUpperCase();

const shouldUseGetCache = (url: string, options?: RequestInit) => {
  const method = getRequestMethod(options);
  const headers = convertHeaders(options?.headers);
  const hasAuthorizationHeader = Object.keys(headers ?? {}).some(
    (key) => key.toLowerCase() === "authorization",
  );

  return (
    method === "GET" &&
    !options?.body &&
    !hasAuthorizationHeader &&
    !shouldSkipAuthHandling(url)
  );
};

const makeGetCacheKey = (url: string, options?: RequestInit) => {
  const headers = convertHeaders(options?.headers);
  const headerKey = headers
    ? Object.entries(headers)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}:${value}`)
        .join("|")
    : "";

  return `${url}::${headerKey}`;
};

const clearGetCache = () => {
  inFlightGetRequests.clear();
  cachedGetResponses.clear();
};

const trimGetCache = () => {
  while (cachedGetResponses.size > MAX_GET_CACHE_SIZE) {
    const firstKey = cachedGetResponses.keys().next().value;
    if (!firstKey) return;
    cachedGetResponses.delete(firstKey);
  }
};

const withNoopCancel = <T>(promise: Promise<T>): CustomClientPromise<T> => {
  const nextPromise = promise as CustomClientPromise<T>;
  nextPromise.cancel = () => {};
  return nextPromise;
};

const useCustomClient = <T>(url: string, options?: RequestInit): Promise<T> => {
  const method = getRequestMethod(options);
  const shouldCacheGet = shouldUseGetCache(url, options);
  const cacheKey = shouldCacheGet ? makeGetCacheKey(url, options) : "";

  if (shouldCacheGet) {
    const cachedResponse = cachedGetResponses.get(cacheKey);

    if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
      return withNoopCancel(Promise.resolve(cachedResponse.value as T));
    }

    cachedGetResponses.delete(cacheKey);

    const inFlightRequest = inFlightGetRequests.get(cacheKey);

    if (inFlightRequest) {
      return withNoopCancel(inFlightRequest as Promise<T>);
    }
  } else if (method !== "GET") {
    clearGetCache();
  }

  const source = Axios.CancelToken.source();

  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    headers: convertHeaders(options?.headers),
    data: options?.body,
    signal: options?.signal || undefined,
    cancelToken: source.token,
  };

  const promise = AXIOS_INSTANCE(axiosConfig)
    .then(({ data, status }) => {
      const response = data instanceof Blob ? data : { ...data, statusCode: status };

      if (shouldCacheGet) {
        cachedGetResponses.set(cacheKey, {
          expiresAt: Date.now() + GET_CACHE_TTL,
          value: response,
        });
        trimGetCache();
      } else if (method !== "GET") {
        clearGetCache();
      }

      return response;
    })
    .finally(() => {
      if (shouldCacheGet) {
        inFlightGetRequests.delete(cacheKey);
      }
    }) as CustomClientPromise<T>;

  if (shouldCacheGet) {
    inFlightGetRequests.set(cacheKey, promise as CustomClientPromise<unknown>);
  }

  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };
  return promise;
};

export { useCustomClient };

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
