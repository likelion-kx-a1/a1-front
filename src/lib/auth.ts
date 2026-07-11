/**
 * 인증 관련 API 호출
 *
 * 공통 응답 형식: 성공 { success: true, data }, 실패 { success: false, error: { code, message } }
 */

import type { ApiResponse } from "@/types/api.types";
import type { LoginPayload, LoginResult, SignupPayload, SignupResult } from "@/types/auth.types";
import { publicClient } from "./http";
import { clearRefreshToken } from "./tokenStorage";

/** 아이디 중복 확인 — GET /api/auth/check-login-id (available: true면 사용 가능) */
export async function checkLoginId(loginId: string): Promise<boolean> {
  const { data } = await publicClient.get<ApiResponse<{ available: boolean }>>(
    "/api/auth/check-login-id",
    { params: { loginId } },
  );
  return data.success && data.data?.available === true;
}

/** 이메일 인증번호 발송 — POST /api/auth/email/send (만료 시각 반환) */
export async function requestEmailCode(email: string): Promise<string> {
  const { data } = await publicClient.post<ApiResponse<{ expiredAt: string }>>(
    "/api/auth/email/send",
    { email, purpose: "SIGNUP" },
  );
  if (!data.success) {
    throw new Error(data.error.message);
  }
  return data.data.expiredAt;
}

/** 이메일 인증번호 확인 — POST /api/auth/email/verify (verified: true면 성공) */
export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const { data } = await publicClient.post<ApiResponse<{ verified: boolean }>>(
    "/api/auth/email/verify",
    { email, code, purpose: "SIGNUP" },
  );
  return data.success && data.data?.verified === true;
}

/** 회원가입 신청 — POST /api/auth/signup */
export async function signup(payload: SignupPayload): Promise<ApiResponse<SignupResult>> {
  const { data } = await publicClient.post<ApiResponse<SignupResult>>("/api/auth/signup", payload);
  return data;
}

/** 로그인 — POST /api/auth/login */
export async function login(payload: LoginPayload): Promise<ApiResponse<LoginResult>> {
  const { data } = await publicClient.post<ApiResponse<LoginResult>>("/api/auth/login", payload);
  return data;
}

export { saveRefreshToken, getRefreshToken } from "./tokenStorage";

/** 로그아웃 (refreshToken 삭제 — accessToken은 authStore.clearUser()가 처리) */
export function logout(): void {
  clearRefreshToken();
}
