import { create } from "zustand";

export type AuthStoreState = {
  isAuthenticated: boolean;
  fullName: string | null;
};

export type AuthStoreActions = {
  setAuthenticated(isAuthenticated: boolean, fullName?: string | null): void;
  setFullName(fullName: string): void;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>(
  (set) => ({
    isAuthenticated: false,
    fullName: null,
    setAuthenticated(isAuthenticated, fullName) {
      set(() => ({ isAuthenticated, fullName: fullName ?? null }));
    },
    setFullName(fullName) {
      set(() => ({ fullName }));
    },
  })
);

export default useAuthStore;
