import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import links from "@/links";

const AXIOS_INSTANCE = Axios.create({
  baseURL: links.externalApiOrigin,
  withCredentials: false,
});

type CustomClientPromise<T> = Promise<T> & {
  cancel?: () => void;
};

const useCustomClient = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): CustomClientPromise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({ ...config, ...options, cancelToken: source.token })
    .then(({ data }) => data as T) as CustomClientPromise<T>;

  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export { useCustomClient };

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
