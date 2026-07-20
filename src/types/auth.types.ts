/** 회원가입 요청 payload */
export interface SignupPayload {
  loginId: string;
  email: string;
  password: string;
  name: string;
  birthDate: string; 
  phoneNumber: string;
}

/** 회원가입 응답 data */
export interface SignupResult {
  userId: number;
  approvalStatus: string; 
  accountStatus: string; 
}

/** 로그인 요청 payload */
export interface LoginPayload {
  loginId: string;
  password: string;
}

/** 로그인 응답 data */
export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    loginId: string;
    name: string;
    role: string;
  };
}

/** 토큰 재발급 응답 data (accessToken만 갱신) */
export interface RefreshResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

/** 이메일 인증 목적 */
export type EmailVerificationPurpose = "SIGNUP" | "PASSWORD_RESET";

/** 비밀번호 재설정 요청 payload */
export interface ResetPasswordPayload {
  email: string;
  verificationCode: string;
  newPassword: string;
}