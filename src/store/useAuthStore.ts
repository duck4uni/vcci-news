import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface AuthenticatedAdminUser {
  id: string;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  roles: string[];
  permissions: string[];
  status: string | null;
  last_login_at: string | null;
}

export interface AuthenticatedAdminSession {
  id: string | null;
  expires_at: string | null;
  refresh_expires_at: string | null;
}

export interface AuthSessionPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  accessTokenExpired?: number | null;
  user: AuthenticatedAdminUser | null;
  session: AuthenticatedAdminSession | null;
  persistSession?: boolean;
}

export interface AuthRefreshPayload {
  accessToken: string;
  expiresIn: number;
  accessTokenExpired?: number | null;
  refreshToken?: string | null;
  session?: AuthenticatedAdminSession | null;
}

export interface AuthStoreStateType {
  appIsLoggedIn: boolean;
  appAccessToken: string | null;
  appAccessTokenExpired: number | null;
  appRefreshToken: string | null;
  appSession: AuthenticatedAdminSession | null;
  appUser: AuthenticatedAdminUser | null;
  appPersistSession: boolean;
  appIsRefreshing: boolean;
  appSessionExpiredNotified: boolean;
  appUserRemember: {
    username: string;
    password: string;
    remember: boolean;
  } | null;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated?: boolean) => void;
  setAppIsLoggedIn: (isLoggedIn: boolean) => void;
  setAuthSession: (payload: AuthSessionPayload) => void;
  updateAccessToken: (payload: AuthRefreshPayload) => void;
  setAppUser: (user: AuthenticatedAdminUser | null) => void;
  setAppToken: (accessToken: string, accessTokenExpired: number, refreshToken?: string) => void;
  setAppRefreshing: (isRefreshing: boolean) => void;
  markSessionExpiredNotified: (notified: boolean) => void;
  removeAppToken: () => void;
  setAppUserRemember: (username: string, password: string, remember: boolean) => void;
  resetStore: () => void;
}

const ACCESS_TOKEN_EXPIRY_SKEW_SECONDS = 300;

const getAccessTokenExpiredAt = (expiresIn: number) =>
  Date.now() + Math.max(expiresIn - ACCESS_TOKEN_EXPIRY_SKEW_SECONDS, 0) * 1000;

const getRefreshTokenExpiredAt = (session?: AuthenticatedAdminSession | null) => {
  if (!session?.refresh_expires_at) return null;

  const time = new Date(session.refresh_expires_at).getTime();
  return Number.isFinite(time) ? time : null;
};

const baseState = {
  appIsLoggedIn: false,
  appAccessToken: null,
  appAccessTokenExpired: null,
  appRefreshToken: null,
  appSession: null,
  appUser: null,
  appPersistSession: false,
  appIsRefreshing: false,
  appSessionExpiredNotified: false,
  appUserRemember: null,
  _hasHydrated: false,
};

const clearSessionState = {
  appIsLoggedIn: false,
  appAccessToken: null,
  appAccessTokenExpired: null,
  appRefreshToken: null,
  appSession: null,
  appUser: null,
  appPersistSession: false,
  appIsRefreshing: false,
  appSessionExpiredNotified: false,
};

const normalizePersistedAuthState = (
  persistedState: unknown,
  currentState: AuthStoreStateType,
) => {
  const storageState =
    typeof persistedState === "object" &&
    persistedState !== null &&
    "state" in persistedState &&
    typeof (persistedState as { state?: unknown }).state === "object" &&
    (persistedState as { state?: unknown }).state !== null
      ? (persistedState as { state: unknown }).state
      : persistedState;
  const persisted =
    typeof storageState === "object" && storageState !== null
      ? (storageState as Partial<AuthStoreStateType>)
      : {};
  const rememberState = persisted.appUserRemember ?? currentState.appUserRemember;
  const persistSession = persisted.appPersistSession === true;
  const refreshTokenExpiredAt = getRefreshTokenExpiredAt(persisted.appSession ?? null);
  const hasUsableSession =
    Boolean(persisted.appRefreshToken) &&
    (!refreshTokenExpiredAt || refreshTokenExpiredAt > Date.now());

  if (!hasUsableSession) {
    return {
      ...currentState,
      ...clearSessionState,
      appUserRemember: rememberState,
    };
  }

  return {
    ...currentState,
    ...persisted,
    appPersistSession: persistSession,
    appUserRemember: rememberState,
    appIsRefreshing: false,
  };
};

const useAuthStore = create<AuthStoreStateType>()(
  devtools(
    persist(
      (set, get) => ({
        ...baseState,
        setHasHydrated: (hasHydrated = true) =>
          set(() => ({
            _hasHydrated: hasHydrated,
          })),
        setAppIsLoggedIn: (isLoggedIn: boolean) =>
          set(() => ({
            appIsLoggedIn: isLoggedIn,
          })),
        setAuthSession: ({
          accessToken,
          refreshToken,
          expiresIn,
          accessTokenExpired,
          user,
          session,
          persistSession = false,
        }) =>
          set(() => ({
            appIsLoggedIn: true,
            appAccessToken: accessToken,
            appAccessTokenExpired: accessTokenExpired ?? getAccessTokenExpiredAt(expiresIn),
            appRefreshToken: refreshToken,
            appSession: session,
            appUser: user,
            appPersistSession: persistSession,
            appIsRefreshing: false,
            appSessionExpiredNotified: false,
          })),
        updateAccessToken: ({ accessToken, expiresIn, accessTokenExpired, refreshToken, session }) =>
          set(() => ({
            appIsLoggedIn: true,
            appAccessToken: accessToken,
            appAccessTokenExpired: accessTokenExpired ?? getAccessTokenExpiredAt(expiresIn),
            appRefreshToken: refreshToken ?? get().appRefreshToken,
            appSession: session ?? get().appSession,
            appIsRefreshing: false,
          })),
        setAppUser: (user: AuthenticatedAdminUser | null) =>
          set(() => ({
            appUser: user,
          })),
        setAppToken: (accessToken: string, accessTokenExpired: number, refreshToken?: string) =>
          set(() => ({
            appIsLoggedIn: true,
            appAccessToken: accessToken,
            appAccessTokenExpired: getAccessTokenExpiredAt(accessTokenExpired),
            appRefreshToken: refreshToken ?? get().appRefreshToken,
            appIsRefreshing: false,
          })),
        setAppRefreshing: (isRefreshing: boolean) =>
          set(() => ({
            appIsRefreshing: isRefreshing,
          })),
        markSessionExpiredNotified: (notified: boolean) =>
          set(() => ({
            appSessionExpiredNotified: notified,
          })),
        removeAppToken: () => {
          set(() => ({
            ...clearSessionState,
            appUserRemember: get().appUserRemember,
            _hasHydrated: get()._hasHydrated,
          }));
        },
        setAppUserRemember: (username, password, remember) =>
          set(() => ({
            appPersistSession: remember,
            appUserRemember: remember
              ? {
                  username,
                  password,
                  remember,
                }
              : null,
          })),
        resetStore: () => {
          const rememberedUser = get().appUserRemember;
          set(() => ({
            ...clearSessionState,
            appUserRemember: rememberedUser,
            _hasHydrated: true,
          }));
        },
      }),
      {
        name: "app-auth-storage",
        storage: createJSONStorage(() => ({
          getItem: (name) => {
            if (typeof window === "undefined") return null;
            return localStorage.getItem(name) ?? sessionStorage.getItem(name);
          },
          setItem: (name, value) => {
            if (typeof window === "undefined") return;
            try {
              const parsed = JSON.parse(value) as {
                state?: Partial<AuthStoreStateType>;
              };
              const state = parsed.state ?? {};

              if (state.appPersistSession === true) {
                localStorage.setItem(name, value);
                sessionStorage.removeItem(name);
              } else {
                sessionStorage.setItem(name, value);
                localStorage.removeItem(name);
              }
            } catch {
              localStorage.setItem(name, value);
            }
          },
          removeItem: (name) => {
            if (typeof window === "undefined") return;
            localStorage.removeItem(name);
            sessionStorage.removeItem(name);
          },
        })),
        partialize: (state) => ({
          appPersistSession: state.appPersistSession,
          appIsLoggedIn: state.appIsLoggedIn,
          appAccessToken: state.appAccessToken,
          appAccessTokenExpired: state.appAccessTokenExpired,
          appRefreshToken: state.appRefreshToken,
          appSession: state.appSession,
          appUser: state.appUser,
          appSessionExpiredNotified: state.appSessionExpiredNotified,
          appUserRemember: state.appUserRemember,
        }),
        merge: (persistedState, currentState) =>
          normalizePersistedAuthState(persistedState, currentState),
        onRehydrateStorage: () => {
          return (state: AuthStoreStateType | undefined, error: unknown) => {
            if (error) {
              useAuthStore.persist.clearStorage();
            }

            (state ?? useAuthStore.getState()).setHasHydrated(true);
          };
        },
      },
    ),
  ),
);

export default useAuthStore;
