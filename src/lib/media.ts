/**
 * 생성물 저장·조회 API
 */

import type { ApiResponse } from "@/types/api.types";
import type {
  MyMediaParams,
  SaveMediaPayload,
  SavedMedia,
  SavedMediaResult,
} from "@/types/media.types";
import { authClient } from "./http";

/** 생성물 저장 — POST /api/media/{mediaId}/save */
export async function saveMedia(
  mediaId: number,
  payload: SaveMediaPayload,
): Promise<ApiResponse<SavedMediaResult>> {
  const { data } = await authClient.post<ApiResponse<SavedMediaResult>>(
    `/api/media/${mediaId}/save`,
    payload,
  );
  return data;
}

/** 마이페이지 저장 생성물 조회 — GET /api/my/media */
export async function getMyMedia(params?: MyMediaParams): Promise<ApiResponse<SavedMedia[]>> {
  const { data } = await authClient.get<ApiResponse<SavedMedia[]>>("/api/my/media", { params });
  return data;
}

/** 저장용 표시 이름 — 프롬프트 앞 40자 */
export function buildSaveDisplayName(prompt: string, fallback: string): string {
  const trimmed = prompt.trim().slice(0, 40);
  return trimmed || fallback;
}
