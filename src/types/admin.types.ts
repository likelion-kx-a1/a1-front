export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AccountStatus = "ACTIVE" | "INACTIVE";

/** GET /api/admin/users 목록 항목 (승인 대기 목록은 approvalStatus=PENDING 필터로 조회) */
export interface AdminUser {
  id: number;
  loginId: string;
  name: string;
  email: string;
  role: string;
  accountStatus: AccountStatus;
  approvalStatus: ApprovalStatus;
  loginCount: number;
  lastLoginAt: string | null;
  createdAt: string;
}

/** 페이지네이션 공통 응답 (data 필드) */
export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** GET /api/admin/users 쿼리 파라미터 */
export interface AdminUsersQuery {
  keyword?: string;
  accountStatus?: AccountStatus;
  approvalStatus?: ApprovalStatus;
  page?: number;
  size?: number;
}
