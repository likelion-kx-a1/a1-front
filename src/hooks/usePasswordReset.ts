import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/lib/auth";

/** 비밀번호 재설정 */
export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}
