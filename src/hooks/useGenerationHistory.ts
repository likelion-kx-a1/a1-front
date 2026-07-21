"use client";

import { useQueries } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildHistoryFromChats } from "@/lib/buildGenerationHistory";
import { getChatDetail } from "@/lib/chats";
import {
  getHistoryScopeKey,
  mapReversePromptRecords,
  readReversePromptHistory,
} from "@/lib/generationHistoryStorage";
import { chatDetailQueryKey } from "@/hooks/useChatDetail";
import { useChats } from "@/hooks/useChats";
import type { GenerationHistoryEntry } from "@/types/generationHistory.types";
import { useAuthStore } from "@/stores/authStore";

export const generationHistoryQueryKey = (projectId?: number | null) =>
  ["generationHistory", getHistoryScopeKey(projectId ?? null)] as const;

/** 이미지·비디오·역프롬프트 생성 기록 */
export function useGenerationHistory(projectId?: number | null) {
  const isLoggedIn = useAuthStore((s) => !!s.user);
  const scope = getHistoryScopeKey(projectId ?? null);
  const listParams =
    projectId !== null && projectId !== undefined && !Number.isNaN(projectId)
      ? { projectId }
      : { outsideProject: true };

  const chatsQuery = useChats(listParams, isLoggedIn);

  const sortedChats = useMemo(() => {
    const chats = chatsQuery.data?.success ? (chatsQuery.data.data ?? []) : [];
    return [...chats].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [chatsQuery.data]);

  const hasGeneratingChat = sortedChats.some((chat) => chat.isGenerating);

  const detailQueries = useQueries({
    queries: sortedChats.map((chat) => ({
      queryKey: chatDetailQueryKey(chat.chatId),
      queryFn: async () => {
        const res = await getChatDetail(chat.chatId);
        if (!res.success) {
          throw new Error(res.error.message);
        }
        return res.data;
      },
      enabled: isLoggedIn && chatsQuery.isSuccess,
      refetchInterval: hasGeneratingChat ? 3000 : false,
    })),
  });

  const [reversePromptRefreshKey, setReversePromptRefreshKey] = useState(0);

  const reversePromptRecords = useMemo(
    () => readReversePromptHistory(scope),
    [scope, reversePromptRefreshKey],
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key?.startsWith("a1-reverse-prompt-history:")) {
        setReversePromptRefreshKey((key) => key + 1);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const entries = useMemo(() => {
    const detailsByChatId = new Map<number, NonNullable<(typeof detailQueries)[number]["data"]>>();
    sortedChats.forEach((chat, index) => {
      const detail = detailQueries[index]?.data;
      if (detail) {
        detailsByChatId.set(chat.chatId, detail);
      }
    });

    const chatEntries: GenerationHistoryEntry[] = isLoggedIn
      ? buildHistoryFromChats(sortedChats, detailsByChatId)
      : [];

    const reverseEntries = mapReversePromptRecords(reversePromptRecords);

    return [...chatEntries, ...reverseEntries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [detailQueries, isLoggedIn, reversePromptRecords, sortedChats]);

  const isLoading =
    isLoggedIn && (chatsQuery.isLoading || detailQueries.some((query) => query.isLoading));

  const refreshReversePromptHistory = useCallback(() => {
    setReversePromptRefreshKey((key) => key + 1);
  }, []);

  return {
    entries,
    isLoading,
    isEmpty: entries.length === 0,
    refreshReversePromptHistory,
  };
}
