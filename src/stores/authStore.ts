import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginResult } from "@/types/auth.types";

type User = LoginResult["user"];

interface AuthState {
  user: User | null;
  /** API 인증용 accessToken — XSS 노출 방지를 위해 메모리에만 두고 저장소엔 안 남김 */
  accessToken: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setAccessToken: (accessToken: string | null) => void;
}

/**
 * 로그인 사용자 전역 상태.
 * user만 localStorage에 저장, accessToken은 메모리 전용(새로고침 시 refreshToken으로 재발급)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null, accessToken: null }),
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "auth-user",
      skipHydration: true,
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
