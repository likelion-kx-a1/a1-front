import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveSignup, getUsers, rejectSignup, updateUserStatus } from "@/lib/admin";
import type { AccountStatus, AdminUsersQuery } from "@/types/admin.types";

/** 유저 목록 조회 (활성 회원 / 검색·필터) */
export function useAdminUsers(query: AdminUsersQuery, enabled = true) {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => getUsers(query),
    enabled,
  });
}

/** 신규 회원가입 승인 대기 목록 조회 — GET /api/admin/users?approvalStatus=PENDING */
export function useSignupRequests(page = 0, size = 20, enabled = true) {
  return useAdminUsers({ approvalStatus: "PENDING", page, size }, enabled);
}

/** 회원가입 승인 */
export function useApproveSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveSignup,
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
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
