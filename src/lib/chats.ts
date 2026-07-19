/**
 * 채팅 관련 API 호출
 */

import type { ApiResponse } from "@/types/api.types";
import type {
  Chat,
  ChatDetail,
  ChatListParams,
  ChatMessage,
  ChatPayload,
  SendChatMessagePayload,
  UpdateChatPayload,
} from "@/types/chat.types";
import { authClient } from "./http";

/** 채팅 생성 — POST /api/chats */
export async function createChat(payload: ChatPayload): Promise<ApiResponse<Chat>> {
  const { data } = await authClient.post<ApiResponse<Chat>>("/api/chats", payload);
  return data;
}

/** 채팅 목록 조회 — GET /api/chats */
export async function getChats(params: ChatListParams = {}): Promise<ApiResponse<Chat[]>> {
  const { data } = await authClient.get<ApiResponse<Chat[]>>("/api/chats", { params });
  return data;
}

/** 채팅 상세 조회 — GET /api/chats/{chatId} */
export async function getChatDetail(chatId: number): Promise<ApiResponse<ChatDetail>> {
  const { data } = await authClient.get<ApiResponse<ChatDetail>>(`/api/chats/${chatId}`);
  return data;
}

/** 채팅 제목 수정 — PATCH /api/chats/{chatId} */
export async function updateChat(
  chatId: number,
  payload: UpdateChatPayload,
): Promise<ApiResponse<Chat>> {
  const { data } = await authClient.patch<ApiResponse<Chat>>(`/api/chats/${chatId}`, payload);
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

/** 채팅 순번 제목 */
export function formatChatSequenceTitle(index: number): string {
  return `채팅${String(index).padStart(2, "0")}`;
}

/** Untitled 등 기본/잘못된 제목인지 */
export function isPlaceholderChatTitle(title: string | null | undefined): boolean {
  const t = title?.trim().toLowerCase() ?? "";
  return !t || t === "untitled" || t === "untitled chat";
}

/**
 * 프로젝트(또는 독립) 채팅을 준비하고 chatId를 반환.
 * - 기존 채팅이 있으면 재사용 (제목이 Untitled면 채팅NN으로 PATCH)
 * - 없으면 채팅NN 제목으로 새로 생성
 */
export async function ensureChatForGeneration(
  projectId: number | null,
): Promise<{ chatId: number }> {
  const listParams = projectId !== null ? { projectId } : { outsideProject: true };
  const listRes = await getChats(listParams);
  const chats = listRes.success ? listRes.data : [];

  if (chats.length > 0) {
    const latest = [...chats].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];

    if (isPlaceholderChatTitle(latest.title)) {
      const nextTitle = formatChatSequenceTitle(chats.length);
      const updateRes = await updateChat(latest.chatId, { title: nextTitle });
      if (!updateRes.success) {
        throw new Error(updateRes.error.message);
      }
    }

    return { chatId: latest.chatId };
  }

  const title = formatChatSequenceTitle(1);
  const createRes = await createChat({ projectId, title });
  if (!createRes.success) {
    throw new Error(createRes.error.message);
  }
  return { chatId: createRes.data.chatId };
}
