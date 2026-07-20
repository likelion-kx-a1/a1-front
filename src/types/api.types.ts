/** 성공 응답 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/** 실패 응답 — 에러 정보가 error 객체 안에 중첩됨 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

/** 응답 형식 (성공/실패 구분된 유니온) */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;