import { useMutation } from "@tanstack/react-query";
import { requestEmailCode, verifyEmailCode } from "@/lib/auth";

/** 이메일 인증번호 발송 mutation */
export function useRequestEmailCode() {
  return useMutation({
    mutationFn: (email: string) => requestEmailCode(email),
  });
}

/** 이메일 인증번호 확인 mutation */
export function useVerifyEmailCode() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => verifyEmailCode(email, code),
  });
}
