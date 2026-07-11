/**
 * axios 인스턴스
 */

import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";
import type { ApiResponse } from "@/types/api.types";
import type { RefreshResult } from "@/types/auth.types";
import { clearRefreshToken, getRefreshToken } from "./tokenStorage";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const publicClient = axios.create({
  baseURL,
  // HTTP 상태코드와 무관하게 응답 바디의 success 플래그로 성공/실패를 판단
  validateStatus: () => true,
});

export const authClient = axios.create({ baseURL });

/**
 * refreshToken으로 새 accessToken을 받아 authStore(메모리)에 반영.
 * 401 재시도와 새로고침 시 세션 복원 양쪽에서 재사용.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  try {
    const { data } = await publicClient.post<ApiResponse<RefreshResult>>("/api/auth/refresh", {
      refreshToken,
    });
    if (data.success) {
      useAuthStore.getState().setAccessToken(data.data.accessToken);
      return data.data.accessToken;
    }
  } catch {
    // 재발급 실패 → null 반환, 호출부에서 처리
  }
  return null;
}

authClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

authClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return authClient(original);
    }

    // 재발급 실패 = 세션 종료 → 자동 로그아웃
    clearRefreshToken();
    useAuthStore.getState().clearUser();
    return Promise.reject(error);
  },
);
