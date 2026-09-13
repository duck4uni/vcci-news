import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import useAuthStore from "@/store/useAuthStore";

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
  must_change_password?: boolean;
}

export interface UserStoreStateType {
  appUser: AuthenticatedAdminUser | null;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated?: boolean) => void;
  setAppUser: (user: AuthenticatedAdminUser | null) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStoreStateType>()(
  devtools(
    persist(
      (set) => ({
        appUser: null,
        _hasHydrated: false,
        setHasHydrated: (hasHydrated = true) =>
          set(() => ({ _hasHydrated: hasHydrated })),
        setAppUser: (user: AuthenticatedAdminUser | null) =>
          set(() => ({ appUser: user })),
        clearUser: () =>
          set(() => ({ appUser: null })),
      }),
      {
        name: "app-user-storage",
        storage: createJSONStorage(() => ({
          getItem: (name) => {
            if (typeof window === "undefined") return null;
            return localStorage.getItem(name) ?? sessionStorage.getItem(name);
          },
          setItem: (name, value) => {
            if (typeof window === "undefined") return;
            try {
              if (useAuthStore.getState().appPersistSession === true) {
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
        partialize: (state) => ({ appUser: state.appUser }),
        onRehydrateStorage: () => {
          return (state: UserStoreStateType | undefined, error: unknown) => {
            if (error) {
              useUserStore.persist.clearStorage();
            }
            (state ?? useUserStore.getState()).setHasHydrated(true);
          };
        },
      },
    ),
  ),
);

export default useUserStore;
