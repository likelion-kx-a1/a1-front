export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AccountStatus = "ACTIVE" | "INACTIVE";

/** GET /api/admin/signup-requests 목록 항목 */
export interface SignupRequest {
  userId: number;
  loginId: string;
  name: string;
  email: string;
  phoneNumber: string;
  approvalStatus: ApprovalStatus;
  accountStatus: AccountStatus;
  createdAt: string;
}

/** GET /api/admin/users 목록 항목 */
export interface AdminUser {
  userId: number;
  loginId: string;
  name: string;
  email: string;
  role: string;
  accountStatus: AccountStatus;
  approvalStatus: ApprovalStatus;
  lastLoginAt: string | null;
}

/** 페이지네이션 공통 응답 (data 필드) */
export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
}

/** GET /api/admin/users 쿼리 파라미터 */
export interface AdminUsersQuery {
  keyword?: string;
  accountStatus?: AccountStatus;
  approvalStatus?: ApprovalStatus;
  page?: number;
  size?: number;
}
