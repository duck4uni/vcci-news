import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface AuthSessionPayload {
  accessToken: string;
  refreshToken: string;
  persistSession?: boolean;
}

export interface AuthStoreStateType {
  appIsLoggedIn: boolean;
  appAccessToken: string | null;
  appRefreshToken: string | null;
  appPersistSession: boolean;
  appUserRemember: {
    username: string;
    password: string;
    remember: boolean;
  } | null;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated?: boolean) => void;
  setAuthSession: (payload: AuthSessionPayload) => void;
  setAppUserRemember: (username: string, password: string, remember: boolean) => void;
  resetStore: () => void;
}

const baseState = {
  appIsLoggedIn: false,
  appAccessToken: null,
  appRefreshToken: null,
  appPersistSession: false,
  appUserRemember: null,
  _hasHydrated: false,
};

const clearSessionState = {
  appIsLoggedIn: false,
  appAccessToken: null,
  appRefreshToken: null,
  appPersistSession: false,
  appUserRemember: null,
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
        setAuthSession: ({ accessToken, refreshToken, persistSession = false }) =>
          set(() => ({
            appIsLoggedIn: true,
            appAccessToken: accessToken,
            appRefreshToken: refreshToken,
            appPersistSession: persistSession,
          })),
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
          appRefreshToken: state.appRefreshToken,
          appUserRemember: state.appUserRemember,
        }),
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
