"use client";

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { AdminNewsFormValues } from "@/mockdata/admin-news";

const DRAFT_STORAGE_KEY = "vcci-news.admin-news-draft.v1";
const MAX_DRAFT_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 ngày

export interface NewsDraftData {
  form: AdminNewsFormValues;
  useEventDates: boolean;
  savedAt: string; // ISO timestamp
}

export interface NewsDraftStoreState {
  draft: NewsDraftData | null;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated?: boolean) => void;
  saveDraft: (data: Omit<NewsDraftData, "savedAt">) => void;
  clearDraft: () => void;
  getDraftIfFresh: () => NewsDraftData | null;
}

function isDraftFresh(draft: NewsDraftData | null): boolean {
  if (!draft?.savedAt) return false;
  const age = Date.now() - new Date(draft.savedAt).getTime();
  return age >= 0 && age < MAX_DRAFT_AGE_MS;
}

const useNewsDraftStore = create<NewsDraftStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        draft: null,
        _hasHydrated: false,
        setHasHydrated: (hasHydrated = true) =>
          set(() => ({ _hasHydrated: hasHydrated })),
        saveDraft: (data) =>
          set(() => ({
            draft: {
              ...data,
              savedAt: new Date().toISOString(),
            },
          })),
        clearDraft: () => set(() => ({ draft: null })),
        getDraftIfFresh: () => {
          const { draft } = get();
          return isDraftFresh(draft) ? draft : null;
        },
      }),
      {
        name: DRAFT_STORAGE_KEY,
        storage: createJSONStorage(() => ({
          getItem: (name) => {
            if (typeof window === "undefined") return null;
            return localStorage.getItem(name);
          },
          setItem: (name, value) => {
            if (typeof window === "undefined") return;
            try {
              localStorage.setItem(name, value);
            } catch {
              // Storage đầy hoặc bị chặn — bỏ qua
            }
          },
          removeItem: (name) => {
            if (typeof window === "undefined") return;
            localStorage.removeItem(name);
          },
        })),
        partialize: (state) => ({ draft: state.draft }),
        onRehydrateStorage: () => {
          return (state: NewsDraftStoreState | undefined, error: unknown) => {
            if (error) {
              useNewsDraftStore.persist.clearStorage();
            }
            // Tự dọn dẹp draft hết hạn khi hydrate
            const current = state ?? useNewsDraftStore.getState();
            if (!isDraftFresh(current.draft)) {
              current.clearDraft();
            }
            current.setHasHydrated(true);
          };
        },
      },
    ),
  ),
);

export default useNewsDraftStore;
