import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AuthStoreStateType {
  // States
  appIsLoggedIn: boolean
  appAccessToken: string | null
  appAccessTokenExpired: number | null
  appRefreshToken: string | null
  appUserRemember: {
    username: string
    password: string
    remember: boolean
  } | null
  _hasHydrated: boolean

  // Actions
  setHasHydrated: (state: AuthStoreStateType) => void
  setAppIsLoggedIn: (isLoggedIn: boolean) => void
  setAppToken: (accessToken: string, accessTokenExpired: number, refreshToken?: string) => void
  removeAppToken: () => void
  setAppUserRemember: (username: string, password: string, remember: boolean) => void
  resetStore: () => void
  
}

// Define store
const useAuthStore = create<AuthStoreStateType>()(
  devtools(
    persist(
      (set, get) => ({
        // States
        appIsLoggedIn: false,
        appAccessToken: null,
        appAccessTokenExpired: null,
        appRefreshToken: null,
        appUserRemember: null,

        // Methods
        setAppIsLoggedIn: (isLoggedIn: boolean) => set(() => ({ appIsLoggedIn: isLoggedIn })),
        setAppToken: (accessToken: string, accessTokenExpired: number, refreshToken?: string) =>
          set(() => ({
            appAccessToken: accessToken,
            appAccessTokenExpired: Date.now() + (accessTokenExpired / 60 - 5) * 60 * 1000,
            appRefreshToken: refreshToken ?? get().appRefreshToken
          })),
        removeAppToken: () => {
          set(() => ({
            appAccessToken: null,
            appAccessTokenExpired: null,
            appRefreshToken: null
          }))
        },
        setAppUserRemember: (username, password, remember) =>
          set(() => ({
            appUserRemember: {
              username,
              password,
              remember
            }
          })),
        resetStore: () => {
          // Clear in-memory state
          set(() => ({
            appIsLoggedIn: false,
            appAccessToken: null,
            appAccessTokenExpired: null,
            appRefreshToken: null,
            appUserRemember: null,
            _hasHydrated: false
          }))

          // Remove persisted storage
          try {
            localStorage.removeItem('app-auth-storage')
          } catch {
            // ignore
          }
        },
        _hasHydrated: false,
        setHasHydrated: (state: AuthStoreStateType) =>
          set(() => ({
            _hasHydrated: state != undefined
          }))
      }),
      {
        name: 'app-auth-storage',
        onRehydrateStorage: () => {
          return (state: AuthStoreStateType | undefined, error: unknown) => {
            if (error || state == undefined) return

            state.setHasHydrated(state)
            return
          }
        }
      }
    )
  )
)

export default useAuthStore
