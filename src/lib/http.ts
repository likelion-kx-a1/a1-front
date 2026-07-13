import axios, { type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api.types";

/** 인증이 필요 없는 API 호출용 axios 클라이언트 */
export const publicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * 에러 응답이 `{ error: { code, message } }` 형태(HTTP 4xx)로 오기 때문에,
 * 성공/실패 모두 `{ success, code, message, data }` 형태로 맞춰서 반환한다.
 */
export async function unwrapApiResponse<T>(
  request: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<ApiResponse<T>> {
  try {
    const { data } = await request;
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) {
      const body = err.response.data as {
        error?: { code?: string; message?: string };
        code?: string;
        message?: string;
      };
      return {
        success: false,
        code: body.error?.code ?? body.code ?? "UNKNOWN_ERROR",
        message: body.error?.message ?? body.message ?? "요청 처리 중 오류가 발생했습니다.",
        data: undefined as unknown as T,
      };
    }
    throw err;
  }
}
