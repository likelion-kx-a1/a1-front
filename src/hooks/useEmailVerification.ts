import { useMutation } from "@tanstack/react-query";
import { requestEmailCode, verifyEmailCode } from "@/lib/auth";
import type { EmailVerificationPurpose } from "@/types/auth.types";

export function useRequestEmailCode() {
  return useMutation({
    mutationFn: ({
      email,
      purpose = "SIGNUP",
    }: {
      email: string;
      purpose?: EmailVerificationPurpose;
    }) => requestEmailCode(email, purpose),
  });
}

export function useVerifyEmailCode() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => verifyEmailCode(email, code),
  });
}
