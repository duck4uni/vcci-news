// Core
import { AxiosError, isAxiosError } from 'axios'
import { QueryClient } from '@tanstack/react-query'

// App
import { QueryData } from '@/lib/types/base-api'

// Constants
const RETRY_COUNT = 3
const EXPIRED_TOKEN_ERROR = 401
const DENIED_PERMISSION_ERROR = 403
const INTERNAL_SERVER_ERROR = 500
const API_QUERY_STALE_TIME = 2 * 60 * 1000
const API_QUERY_GC_TIME = 10 * 60 * 1000

// Utils
// Handle check base retry logical
const handleCheckBaseRetryLogical = (failureCount: number, error: Error) => {
  // Check retry count and is axios error
  if (failureCount > RETRY_COUNT || !isAxiosError<QueryData>(error)) {
    return false
  }

  // Expired token error — let the interceptor handle refresh, don't retry here
  if (error.response?.status === EXPIRED_TOKEN_ERROR) {
    return false
  }

  // Denied permission error
  if (error.response?.status === DENIED_PERMISSION_ERROR) {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      window.location.href = '/admin'
    }
    return false
  }

  return true
}

// Handle delay value
const handleDelayRetry = (failureCount: number) => failureCount * 1000 + Math.random() * 1000

// Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: API_QUERY_STALE_TIME,
      gcTime: API_QUERY_GC_TIME,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      placeholderData: (previousData: unknown) => previousData,
      retry(failureCount, error) {
        if (!handleCheckBaseRetryLogical(failureCount, error)) return false

        return true
      },
      retryDelay: handleDelayRetry
    },
    mutations: {
      retry: (failureCount, error) => {
        if (!handleCheckBaseRetryLogical(failureCount, error)) {
          return false
        }

        if ((error as AxiosError<QueryData>).response?.status === INTERNAL_SERVER_ERROR) {
          return true
        }

        return false
      },
      retryDelay: handleDelayRetry
    }
  }
})

export default queryClient
