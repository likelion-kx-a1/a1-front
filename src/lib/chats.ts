/**
 * 채팅 관련 API 호출
 */

import type { ApiResponse } from "@/types/api.types";
import type {
  Chat,
  ChatDetail,
  ChatMessage,
  ChatPayload,
  SendChatMessagePayload,
} from "@/types/chat.types";
import { authClient } from "./http";

/** 채팅 생성 — POST /api/chats */
export async function createChat(payload: ChatPayload): Promise<ApiResponse<Chat>> {
  const { data } = await authClient.post<ApiResponse<Chat>>("/api/chats", payload);
  return data;
}

/** 채팅 상세 조회 — GET /api/chats/{chatId} */
export async function getChatDetail(chatId: number): Promise<ApiResponse<ChatDetail>> {
  const { data } = await authClient.get<ApiResponse<ChatDetail>>(`/api/chats/${chatId}`);
  return data;
}

/**
 * 채팅 메시지 생성 + 파일 업로드 — POST /api/chats/{chatId}/messages
 * multipart/form-data. files는 같은 키로 여러 번 append.
 */
export async function sendChatMessage(
  chatId: number,
  payload: SendChatMessagePayload,
): Promise<ApiResponse<ChatMessage>> {
  const formData = new FormData();
  if (payload.contentText !== undefined) {
    formData.append("contentText", payload.contentText);
  }
  formData.append("assetType", payload.assetType);
  if (payload.imageCategory) {
    formData.append("imageCategory", payload.imageCategory);
  }
  payload.files?.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await authClient.post<ApiResponse<ChatMessage>>(
    `/api/chats/${chatId}/messages`,
    formData,
  );
  return data;
}
