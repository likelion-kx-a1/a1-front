import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginResult } from "@/types/auth.types";

type User = LoginResult["user"];

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

/**
 * 로그인 사용자 전역 상태.
 * localStorage에 저장
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "auth-user", skipHydration: true },
  ),
);