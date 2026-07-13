import { useMutation } from "@tanstack/react-query";
import { checkLoginId, signup } from "@/lib/auth";
import type { SignupPayload } from "@/types/auth.types";

/** 아이디 중복 확인 */
export function useCheckLoginId() {
  return useMutation({
    mutationFn: (loginId: string) => checkLoginId(loginId),
  });
}

/** 회원가입 신청 */
export function useSignup() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
  });
}
