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

const getRequestMethod = (options?: RequestInit) =>
  (options?.method || "GET").toUpperCase();

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

const shouldUseGetCache = (options?: RequestInit) => {
  const headers = convertHeaders(options?.headers);
  const hasAuthorizationHeader = Object.keys(headers ?? {}).some(
    (key) => key.toLowerCase() === "authorization",
  );

  return getRequestMethod(options) === "GET" && !options?.body && !hasAuthorizationHeader;
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

const useCustomClient = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const method = getRequestMethod(options);
  const shouldCacheGet = shouldUseGetCache(options);
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

  const promise = fetch(url, {
    method,
    headers: options?.headers,
    body: options?.body,
    signal: options?.signal,
  })
    .then(async (response) => {
      const data = await response.json();
      const result = { ...data, statusCode: response.status } as T;

      if (shouldCacheGet) {
        cachedGetResponses.set(cacheKey, {
          expiresAt: Date.now() + GET_CACHE_TTL,
          value: result,
        });
        trimGetCache();
      } else if (method !== "GET") {
        clearGetCache();
      }

      return result;
    })
    .finally(() => {
      if (shouldCacheGet) {
        inFlightGetRequests.delete(cacheKey);
      }
    }) as CustomClientPromise<T>;

  promise.cancel = () => {};

  if (shouldCacheGet) {
    inFlightGetRequests.set(cacheKey, promise as CustomClientPromise<unknown>);
  }

  return promise;
};

export { useCustomClient };

export type ErrorType<Error> = Error;
export type BodyType<BodyData> = BodyData;
