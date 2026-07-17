/**
 * 관리자 페이지 API 호출
 *
 * 공통 응답 형식: 성공 { success: true, data }, 실패 { success: false, error: { code, message } }
 */

import type { ApiResponse } from "@/types/api.types";
import type { AccountStatus, AdminUser, AdminUsersQuery, Page, SignupRequest } from "@/types/admin.types";
import { authClient } from "./http";

interface StatusResult {
  userId: number;
  approvalStatus?: ApprovalStatusResult;
  accountStatus: AccountStatus;
}

type ApprovalStatusResult = "APPROVED" | "REJECTED";

/** 신규 회원가입 신청 목록 조회 — GET /api/admin/signup-requests */
export async function getSignupRequests(
  page = 0,
  size = 20,
): Promise<ApiResponse<Page<SignupRequest>>> {
  const { data } = await authClient.get<ApiResponse<Page<SignupRequest>>>(
    "/api/admin/signup-requests",
    { params: { page, size } },
  );
  return data;
}

/** 회원가입 승인 — PATCH /api/admin/users/{userId}/approve */
export async function approveSignup(userId: number): Promise<ApiResponse<StatusResult>> {
  const { data } = await authClient.patch<ApiResponse<StatusResult>>(
    `/api/admin/users/${userId}/approve`,
  );
  return data;
}

/** 회원가입 거절 — PATCH /api/admin/users/{userId}/reject */
export async function rejectSignup(
  userId: number,
  reason: string,
): Promise<ApiResponse<StatusResult>> {
  const { data } = await authClient.patch<ApiResponse<StatusResult>>(
    `/api/admin/users/${userId}/reject`,
    { reason },
  );
  return data;
}

/** 유저 목록 조회 — GET /api/admin/users */
export async function getUsers(
  query: AdminUsersQuery = {},
): Promise<ApiResponse<Page<AdminUser>>> {
  const { data } = await authClient.get<ApiResponse<Page<AdminUser>>>("/api/admin/users", {
    params: { page: 0, size: 20, ...query },
  });
  return data;
}

/** 유저 활성화/비활성화 — PATCH /api/admin/users/{userId}/status */
export async function updateUserStatus(
  userId: number,
  accountStatus: AccountStatus,
): Promise<ApiResponse<StatusResult>> {
  const { data } = await authClient.patch<ApiResponse<StatusResult>>(
    `/api/admin/users/${userId}/status`,
    { accountStatus },
  );
  return data;
}
