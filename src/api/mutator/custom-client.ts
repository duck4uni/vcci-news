import Axios, { AxiosError, AxiosRequestConfig } from "axios";

const createAxiosInstance = () => {
  const instance = Axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/v1.0`,
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    const token = getPersistedAccessToken();

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    async (response) => response,
    (error) => Promise.reject(error),
  );

  return instance;
};

const AXIOS_INSTANCE = createAxiosInstance();

const getPersistedAccessToken = () => {
  if (typeof window === "undefined") return null;

  try {
    const rawAuthStorage = window.localStorage.getItem("app-auth-storage");
    if (!rawAuthStorage) return null;

    const parsedAuthStorage = JSON.parse(rawAuthStorage) as {
      state?: {
        appAccessToken?: string | null;
      };
    };

    return parsedAuthStorage.state?.appAccessToken ?? null;
  } catch {
    return null;
  }
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
