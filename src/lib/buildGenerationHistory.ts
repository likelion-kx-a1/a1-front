import type { Chat, ChatDetail, ChatMessage, GeneratedAsset } from "@/types/chat.types";
import type { GenerationHistoryEntry } from "@/types/generationHistory.types";
import { getChatMessages, getGeneratedAssets } from "./chats";

function findPromptForAsset(messages: ChatMessage[], asset: GeneratedAsset): string {
  const assetTime = new Date(asset.createdAt).getTime();
  const userMessages = messages.filter(
    (m) => m.senderType === "USER" && m.assetType === asset.assetType && m.contentText?.trim(),
  );

  if (userMessages.length === 0) {
    return asset.title || "생성 결과";
  }

  const closest = userMessages.reduce((best, current) => {
    const bestDiff = Math.abs(new Date(best.createdAt).getTime() - assetTime);
    const currentDiff = Math.abs(new Date(current.createdAt).getTime() - assetTime);
    return currentDiff < bestDiff ? current : best;
  });

  return closest.contentText?.trim() ?? asset.title ?? "생성 결과";
}

function buildPendingEntry(detail: ChatDetail, messages: ChatMessage[]): GenerationHistoryEntry | null {
  const latestUserMessage = [...messages]
    .filter((m) => m.senderType === "USER" && m.assetType)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (!latestUserMessage?.assetType) {
    return null;
  }

  return {
    id: `chat-${detail.chatId}-pending-${latestUserMessage.messageId}`,
    kind: latestUserMessage.assetType,
    prompt: latestUserMessage.contentText?.trim() || "생성 중…",
    previewUrl: latestUserMessage.files[0]?.url ?? null,
    createdAt: latestUserMessage.createdAt,
    chatId: detail.chatId,
    status: "generating",
  };
}

/** 채팅 상세에서 생성 기록 항목 추출 */
export function buildHistoryFromChatDetail(detail: ChatDetail): GenerationHistoryEntry[] {
  const messages = getChatMessages(detail);
  const assets = getGeneratedAssets(detail);

  const entries: GenerationHistoryEntry[] = assets.map((asset) => ({
    id: `chat-${detail.chatId}-asset-${asset.assetId}`,
    kind: asset.assetType,
    prompt: findPromptForAsset(messages, asset),
    previewUrl: asset.previewUrl,
    createdAt: asset.createdAt,
    chatId: detail.chatId,
    assetId: asset.assetId,
    status: "completed",
  }));

  if (detail.isGenerating) {
    const pending = buildPendingEntry(detail, messages);
    if (pending && !entries.some((entry) => entry.id === pending.id)) {
      entries.unshift(pending);
    }
  }

  return entries;
}

/** 여러 채팅 목록·상세를 하나의 기록 목록으로 병합 */
export function buildHistoryFromChats(
  chats: Chat[],
  detailsByChatId: Map<number, ChatDetail>,
): GenerationHistoryEntry[] {
  const entries: GenerationHistoryEntry[] = [];

  for (const chat of chats) {
    const detail = detailsByChatId.get(chat.chatId);
    if (detail) {
      entries.push(...buildHistoryFromChatDetail(detail));
      continue;
    }

    if (chat.previewUrl) {
      entries.push({
        id: `chat-${chat.chatId}-preview`,
        kind: "IMAGE",
        prompt: chat.title,
        previewUrl: chat.previewUrl,
        createdAt: chat.updatedAt,
        chatId: chat.chatId,
        status: chat.isGenerating ? "generating" : "completed",
      });
    }
  }

  return entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
