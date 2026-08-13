import { useQuery } from "@tanstack/react-query";
import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { useCustomClient } from "../mutator/custom-client";
import type { ErrorType } from "../mutator/custom-client";
import type { PostHistoryItem } from "../types/post-history";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
  message_en: string;
  timeStamp: string;
  violations: string | null;
}

type GetPostHistoryResponse = ApiResponse<PostHistoryItem[]>;

export type getApiV10PostIdHistoryResponse200 = {
  data: GetPostHistoryResponse;
  status: 200;
};

export type getApiV10PostIdHistoryResponse404 = {
  data: void;
  status: 404;
};

export type getApiV10PostIdHistoryResponseSuccess = getApiV10PostIdHistoryResponse200 & {
  headers: Headers;
};

export type getApiV10PostIdHistoryResponseError = getApiV10PostIdHistoryResponse404 & {
  headers: Headers;
};

export type getApiV10PostIdHistoryResponse =
  | getApiV10PostIdHistoryResponseSuccess
  | getApiV10PostIdHistoryResponseError;

export const getGetApiV10PostIdHistoryUrl = (id: string) => {
  return `/api/v1.0/post/${id}/history`;
};

export const getApiV10PostIdHistory = async (
  id: string,
  options?: RequestInit
): Promise<getApiV10PostIdHistoryResponse> => {
  return useCustomClient<getApiV10PostIdHistoryResponse>(
    getGetApiV10PostIdHistoryUrl(id),
    {
      ...options,
      method: "GET",
    }
  );
};

export const getGetApiV10PostIdHistoryQueryKey = (id: string) => {
  return [`/api/v1.0/post/${id}/history`] as const;
};

export const getGetApiV10PostIdHistoryQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiV10PostIdHistory>>,
  TError = ErrorType<void>
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiV10PostIdHistory>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof useCustomClient>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetApiV10PostIdHistoryQueryKey(id);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getApiV10PostIdHistory>>
  > = ({ signal }) =>
    getApiV10PostIdHistory(id, { signal, ...requestOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    retry: 3,
    retryDelay: 1000,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiV10PostIdHistory>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetApiV10PostIdHistoryQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiV10PostIdHistory>>
>;
export type GetApiV10PostIdHistoryQueryError = ErrorType<void>;

export function useGetApiV10PostIdHistory<
  TData = Awaited<ReturnType<typeof getApiV10PostIdHistory>>,
  TError = ErrorType<void>
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getApiV10PostIdHistory>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof useCustomClient>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetApiV10PostIdHistoryQueryOptions(id, options);

  const query = useQuery(queryOptions, undefined) as UseQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}
