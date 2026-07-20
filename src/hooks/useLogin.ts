import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/auth";

export function useLogin() {
  return useMutation({ mutationFn: login });
}
