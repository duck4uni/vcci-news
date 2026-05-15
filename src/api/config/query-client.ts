// Core
import { AxiosError, isAxiosError } from 'axios'
import { QueryClient } from '@tanstack/react-query'

// App
// import router from '@/router'
import { handleAdminUnauthorized } from '@/lib/auth/admin-auth'
// import useProfileStore from '@stores/profile'
import { QueryData } from '@/lib/types/base-api'
// import { BASE_PATHS } from '@/constants/path'

// Constants
const RETRY_COUNT = 3
const EXPIRED_TOKEN_ERROR = 401
const DENIED_PERMISSION_ERROR = 403
const INTERNAL_SERVER_ERROR = 500

// Utils
// Handle check base retry logical
const handleCheckBaseRetryLogical = (failureCount: number, error: Error) => {
  // Check retry count and is axios error
  if (failureCount > RETRY_COUNT || !isAxiosError<QueryData>(error)) {
    return false
  }

  // Expired token error
  if (error.response?.status === EXPIRED_TOKEN_ERROR) {
    handleUnAuthorizationError()
    return false
  }

  // Denied permission error
  if (error.response?.status === DENIED_PERMISSION_ERROR) {
    // router.navigate('/')
    window.location.href = process ? '/' : '/admin'
    return false
  }

  return true
}

// Handle un authorization error
const handleUnAuthorizationError = () => {
  void handleAdminUnauthorized()
  // useProfileStore.getState().resetStore()

  // const languageAwarePath = addLanguageToPath({
  //   path: BASE_PATHS.authSignIn
  // })
  // router.navigate('')
}

// Handle delay value
const handleDelayRetry = (failureCount: number) => failureCount * 1000 + Math.random() * 1000

// Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
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
