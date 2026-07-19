/**
 * 채팅 관련 API 호출
 */

import type { ApiResponse } from "@/types/api.types";
import type { Chat, ChatPayload } from "@/types/chat.types";
import { authClient } from "./http";

/** 채팅 생성 — POST /api/chats */
export async function createChat(payload: ChatPayload): Promise<ApiResponse<Chat>> {
  const { data } = await authClient.post<ApiResponse<Chat>>("/api/chats", payload);
  return data;
}
