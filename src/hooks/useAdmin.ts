import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveSignup,
  getSignupRequests,
  getUsers,
  rejectSignup,
  updateUserStatus,
} from "@/lib/admin";
import type { AccountStatus, AdminUsersQuery } from "@/types/admin.types";

/** 신규 회원가입 신청 목록 조회 (ADMIN 권한 확인 전에는 enabled=false로 호출 자체를 막을 것) */
export function useSignupRequests(page = 0, size = 20, enabled = true) {
  return useQuery({
    queryKey: ["admin", "signup-requests", page, size],
    queryFn: () => getSignupRequests(page, size),
    enabled,
  });
}

/** 유저 목록 조회 (활성 회원 / 검색·필터) */
export function useAdminUsers(query: AdminUsersQuery, enabled = true) {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => getUsers(query),
    enabled,
  });
}

/** 회원가입 승인 */
export function useApproveSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveSignup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "signup-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

/** 회원가입 거절 */
export function useRejectSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      rejectSignup(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "signup-requests"] });
    },
  });
}

/** 유저 활성화/비활성화 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, accountStatus }: { userId: number; accountStatus: AccountStatus }) =>
      updateUserStatus(userId, accountStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
