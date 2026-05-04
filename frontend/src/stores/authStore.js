import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isInitializing: true,
      setAuth: (token, user, refresh = null) =>
        set({
          accessToken: token,
          user,
          isInitializing: false,
          refreshToken: refresh,
        }),
      setUser: (user) => set({ user }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isInitializing: false,
        }),
      setInitializing: (v) => set({ isInitializing: v }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
