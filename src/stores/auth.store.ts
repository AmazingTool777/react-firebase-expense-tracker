import { create } from "zustand";

export type AuthStoreState = {
  isAuthenticated: boolean;
  fullName: string | null;
  userId: string | null;
};

export type AuthStoreActions = {
  setAuthenticated(
    isAuthenticated: boolean,
    fullName?: string | null,
    userId?: string | null
  ): void;
  setFullName(fullName: string): void;
  setUserId(id: string): void;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>(
  (set) => ({
    isAuthenticated: false,
    fullName: null,
    userId: null,
    setAuthenticated(isAuthenticated, fullName, userId) {
      set(() => ({
        isAuthenticated,
        fullName: fullName ?? null,
        userId: userId ?? null,
      }));
    },
    setFullName(fullName) {
      set(() => ({ fullName }));
    },
    setUserId(id: string) {
      set(() => ({ userId: id }));
    },
  })
);

export default useAuthStore;
