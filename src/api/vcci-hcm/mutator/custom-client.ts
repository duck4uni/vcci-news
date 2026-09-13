import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import links from "@/links";

const instance = Axios.create({
  baseURL: links.externalApiOrigin,
  withCredentials: false,
});

export async function useCustomClient<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  const response = await instance({ ...config, ...options });
  return response.data as T;
}

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
