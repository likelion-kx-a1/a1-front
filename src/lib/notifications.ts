/**
 * 알림 관련 API 호출
 *
 * 공통 응답 형식: 성공 { success: true, data }, 실패 { success: false, error: { code, message } }
 */

import type { ApiResponse } from "@/types/api.types";
import type { AppNotification } from "@/types/notification.types";
import { authClient } from "./http";

/** 내 알림 목록 조회 — GET /api/notifications */
export async function getNotifications(): Promise<ApiResponse<AppNotification[]>> {
  const { data } = await authClient.get<ApiResponse<AppNotification[]>>("/api/notifications");
  return data;
}

interface MarkReadResult {
  notificationId: number;
  isRead: boolean;
  readAt: string;
}

/** 알림 읽음 처리 — PATCH /api/notifications/{notificationId}/read */
export async function markNotificationRead(
  notificationId: number,
): Promise<ApiResponse<MarkReadResult>> {
  const { data } = await authClient.patch<ApiResponse<MarkReadResult>>(
    `/api/notifications/${notificationId}/read`,
  );
  return data;
}
