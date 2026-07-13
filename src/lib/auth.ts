/**
 * 인증 관련 API 호출
 *
 * 공통 응답 형식: { success, code, message, data }
 */

import type { ApiResponse } from "@/types/api.types";
import type { LoginPayload, LoginResult, SignupPayload, SignupResult } from "@/types/auth.types";
import { publicClient, unwrapApiResponse } from "./http";
import { clearTokens } from "./tokenStorage";

/** 아이디 중복 확인 — GET /api/auth/check-login-id (available: true면 사용 가능) */
export async function checkLoginId(loginId: string): Promise<boolean> {
  const data = await unwrapApiResponse<{ available: boolean }>(
    publicClient.get("/api/auth/check-login-id", { params: { loginId } }),
  );
  return data.success && data.data?.available === true;
}

/** 이메일 인증번호 발송 — POST /api/auth/email/send (만료 시각 반환) */
export async function requestEmailCode(email: string): Promise<string> {
  const data = await unwrapApiResponse<{ expiredAt: string }>(
    publicClient.post("/api/auth/email/send", { email, purpose: "SIGNUP" }),
  );
  if (!data.success) {
    throw new Error(data.message);
  }
  return data.data.expiredAt;
}

/** 이메일 인증번호 확인 — POST /api/auth/email/verify (verified: true면 성공) */
export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const data = await unwrapApiResponse<{ verified: boolean }>(
    publicClient.post("/api/auth/email/verify", { email, code, purpose: "SIGNUP" }),
  );
  return data.success && data.data?.verified === true;
}

/** 회원가입 신청 — POST /api/auth/signup */
export async function signup(payload: SignupPayload): Promise<ApiResponse<SignupResult>> {
  return unwrapApiResponse<SignupResult>(publicClient.post("/api/auth/signup", payload));
}

/** 로그인 — POST /api/auth/login */
export async function login(payload: LoginPayload): Promise<ApiResponse<LoginResult>> {
  return unwrapApiResponse<LoginResult>(publicClient.post("/api/auth/login", payload));
}

/* ------------------------------ 토큰 ------------------------------ */

export { saveTokens, saveAccessToken, getAccessToken, getRefreshToken } from "./tokenStorage";

/** 로그아웃 (토큰 삭제 — 별도 API 없음) */
export function logout(): void {
  clearTokens();
}
