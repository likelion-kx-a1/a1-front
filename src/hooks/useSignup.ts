import { useMutation } from "@tanstack/react-query";
import { checkLoginId, signup } from "@/lib/auth";

export function useSignup() {
  return useMutation({ mutationFn: signup });
}

/** 아이디 중복확인 */
export function useCheckLoginId() {
  return useMutation({ mutationFn: checkLoginId });
}
