/**
 * 생성(이미지/비디오/역프롬프트) 관련 API 호출
 *
 * 공통 응답 형식: 성공 { success: true, data }, 실패 { success: false, error: { code, message } }
 */

import type { ApiResponse } from "@/types/api.types";
import type { ClaudeVisionPayload, FalJobPayload, GenerationJob } from "@/types/generation.types";
import { authClient } from "./http";

/** 프롬프트 보정 (Claude) — POST /api/v1/generation/prompts */
export async function regeneratePrompt(
  payload: ClaudeVisionPayload,
): Promise<ApiResponse<GenerationJob>> {
  const { data } = await authClient.post<ApiResponse<GenerationJob>>(
    "/api/v1/generation/prompts",
    payload,
  );
  return data;
}

/** 이미지 역프롬프트 (GPT Vision) — POST /api/v1/generation/reverse-prompts */
export async function reversePrompt(
  payload: ClaudeVisionPayload,
): Promise<ApiResponse<GenerationJob>> {
  const { data } = await authClient.post<ApiResponse<GenerationJob>>(
    "/api/v1/generation/reverse-prompts",
    payload,
  );
  return data;
}

/** fal.ai 비동기 작업 제출 (이미지/영상 생성) — POST /api/v1/generation/fal-jobs */
export async function submitFalJob(payload: FalJobPayload): Promise<ApiResponse<GenerationJob>> {
  const { data } = await authClient.post<ApiResponse<GenerationJob>>(
    "/api/v1/generation/fal-jobs",
    payload,
  );
  return data;
}

/** fal.ai 작업 상태 폴링 — GET /api/v1/generation/fal-jobs/{jobId}/status */
export async function getFalJobStatus(jobId: number): Promise<ApiResponse<GenerationJob>> {
  const { data } = await authClient.get<ApiResponse<GenerationJob>>(
    `/api/v1/generation/fal-jobs/${jobId}/status`,
  );
  return data;
}

/** File → base64 문자열 (data: 접두사 제외) 변환 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** GenerationJob.responsePayload에서 최종 이미지 URL 추출  */
export function extractImageUrl(responsePayload: Record<string, unknown> | null): string | null {
  if (!responsePayload) {
    return null;
  }
  if (typeof responsePayload.s3Url === "string") {
    return responsePayload.s3Url;
  }
  const images = responsePayload.images;
  if (Array.isArray(images) && images[0] && typeof images[0].url === "string") {
    return images[0].url;
  }
  return null;
}
