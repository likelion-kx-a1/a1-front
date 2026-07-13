import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/auth";
import type { LoginPayload } from "@/types/auth.types";

/** 로그인 */
export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}
