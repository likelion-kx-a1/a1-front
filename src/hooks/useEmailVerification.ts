import { useMutation } from "@tanstack/react-query";
import { requestEmailCode, verifyEmailCode } from "@/lib/auth";

export function useRequestEmailCode() {
  return useMutation({ mutationFn: requestEmailCode });
}

export function useVerifyEmailCode() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => verifyEmailCode(email, code),
  });
}
