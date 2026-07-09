/** 응답 형식 */
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}