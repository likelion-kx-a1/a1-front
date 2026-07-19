/**
 * fetch 기반 API 클라이언트
 */

import { useAuthStore } from "@/stores/authStore";
import type { ApiResponse } from "@/types/api.types";
import type { RefreshResult } from "@/types/auth.types";
import { clearRefreshToken, getRefreshToken } from "./tokenStorage";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface RequestConfig {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: RequestConfig["params"]): string {
  const url = path.startsWith("http") ? path : `${baseURL}${path}`;
  if (!params) {
    return url;
  }
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

/**
 * 인증이 필요 없는 공개 API용 클라이언트.
 * HTTP 상태코드와 무관하게 응답 바디의 success 플래그로 성공/실패를 판단(절대 throw하지 않음).
 */
export const publicClient = {
  async get<T>(path: string, config: RequestConfig = {}): Promise<{ data: T }> {
    const res = await fetch(buildUrl(path, config.params));
    return { data: await parseJson<T>(res) };
  },

  async post<T>(path: string, body?: unknown): Promise<{ data: T }> {
    const res = await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return { data: await parseJson<T>(res) };
  },
};

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

/**
 * 로그인 토큰이 자동으로 실리는 인증 전용 요청.
 * 401을 받으면 refreshToken으로 재발급 후 원요청을 1회만 재시도하고,
 * 재발급도 실패하면 세션을 정리(자동 로그아웃)한 뒤 에러를 던진다.
 */
async function authRequest<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body: unknown,
  config: RequestConfig,
  isRetry = false,
): Promise<{ data: T }> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, config.params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !isRetry) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      return authRequest<T>(method, path, body, config, true);
    }

    // 재발급 실패 = 세션 종료 → 자동 로그아웃
    clearRefreshToken();
    useAuthStore.getState().clearUser();
    throw new Error("Request failed with status code 401");
  }

  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }

  return { data: await parseJson<T>(res) };
}

export const authClient = {
  get: <T>(path: string, config: RequestConfig = {}) =>
    authRequest<T>("GET", path, undefined, config),
  post: <T>(path: string, body?: unknown, config: RequestConfig = {}) =>
    authRequest<T>("POST", path, body, config),
  patch: <T>(path: string, body?: unknown, config: RequestConfig = {}) =>
    authRequest<T>("PATCH", path, body, config),
  delete: <T>(path: string, config: RequestConfig = {}) =>
    authRequest<T>("DELETE", path, undefined, config),
};
