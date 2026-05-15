import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
  user: AuthenticatedAdminUser | null;
  session: AuthenticatedAdminSession | null;
}

export interface AuthRefreshPayload {
  accessToken: string;
  expiresIn: number;
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
  appIsRefreshing: boolean;
  appSessionExpiredNotified: boolean;
  appUserRemember: {
    username: string;
    password: string;
    remember: boolean;
  } | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: AuthStoreStateType) => void;
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

const getAccessTokenExpiredAt = (expiresIn: number) =>
  Date.now() + Math.max(expiresIn - 300, 0) * 1000;

const baseState = {
  appIsLoggedIn: false,
  appAccessToken: null,
  appAccessTokenExpired: null,
  appRefreshToken: null,
  appSession: null,
  appUser: null,
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
  appIsRefreshing: false,
  appSessionExpiredNotified: false,
};

const useAuthStore = create<AuthStoreStateType>()(
  devtools(
    persist(
      (set, get) => ({
        ...baseState,
        setHasHydrated: (state: AuthStoreStateType) =>
          set(() => ({
            _hasHydrated: state != undefined,
          })),
        setAppIsLoggedIn: (isLoggedIn: boolean) =>
          set(() => ({
            appIsLoggedIn: isLoggedIn,
          })),
        setAuthSession: ({ accessToken, refreshToken, expiresIn, user, session }) =>
          set(() => ({
            appIsLoggedIn: true,
            appAccessToken: accessToken,
            appAccessTokenExpired: getAccessTokenExpiredAt(expiresIn),
            appRefreshToken: refreshToken,
            appSession: session,
            appUser: user,
            appIsRefreshing: false,
            appSessionExpiredNotified: false,
          })),
        updateAccessToken: ({ accessToken, expiresIn, refreshToken, session }) =>
          set(() => ({
            appIsLoggedIn: true,
            appAccessToken: accessToken,
            appAccessTokenExpired: getAccessTokenExpiredAt(expiresIn),
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
            appUserRemember: {
              username,
              password,
              remember,
            },
          })),
        resetStore: () => {
          const rememberedUser = get().appUserRemember;
          set(() => ({
            ...clearSessionState,
            appUserRemember: rememberedUser,
            _hasHydrated: true,
          }));

          try {
            localStorage.removeItem("app-auth-storage");
          } catch {
            // ignore
          }
        },
      }),
      {
        name: "app-auth-storage",
        partialize: (state) => ({
          appIsLoggedIn: state.appIsLoggedIn,
          appAccessToken: state.appAccessToken,
          appAccessTokenExpired: state.appAccessTokenExpired,
          appRefreshToken: state.appRefreshToken,
          appSession: state.appSession,
          appUser: state.appUser,
          appSessionExpiredNotified: state.appSessionExpiredNotified,
          appUserRemember: state.appUserRemember,
        }),
        onRehydrateStorage: () => {
          return (state: AuthStoreStateType | undefined, error: unknown) => {
            if (error || state == undefined) return;
            state.setHasHydrated(state);
          };
        },
      },
    ),
  ),
);

export default useAuthStore;
