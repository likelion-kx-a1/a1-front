import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { ensureChatForGeneration, getChatDetail, sendChatMessage } from "@/lib/chats";
import { useAuthStore } from "@/stores/authStore";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface GenerateVideoParams {
  prompt: string;
  /** 시작/추가 프레임 — multipart files로 함께 전송 */
  frames?: File[];
}

interface GenerateVideoResult {
  videoUrl: string;
  prompt: string;
}

/**
 * 비디오 생성 훅.
 * 채팅 메시지 API(POST /api/chats/{chatId}/messages, assetType=VIDEO)로 요청
 * 채팅 상세 조회로 생성 완료를 폴링한다.
 */
export function useVideoGeneration(projectId?: number | null) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const chatIdRef = useRef<number | null>(null);

  useEffect(() => {
    chatIdRef.current = null;
  }, [projectId]);

  return useMutation({
    mutationFn: async ({ prompt, frames }: GenerateVideoParams) => {
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      if (chatIdRef.current === null) {
        const { chatId } = await ensureChatForGeneration(projectId ?? null);
        chatIdRef.current = chatId;
        void queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
      const chatId = chatIdRef.current;

      // 요청 전에 이미 있던 자산 ID — 새로 생긴 VIDEO만 결과로 사용
      const beforeRes = await getChatDetail(chatId);
      const knownAssetIds = new Set(
        beforeRes.success
          ? beforeRes.data.generatedAssets.map((asset) => asset.assetId)
          : [],
      );

      const messageRes = await sendChatMessage(chatId, {
        contentText: prompt,
        assetType: "VIDEO",
        files: frames?.length ? frames : undefined,
      });
      if (!messageRes.success) {
        throw new Error(messageRes.error.message);
      }

      let sawGenerating = false;

      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        await sleep(POLL_INTERVAL_MS);
        const detailRes = await getChatDetail(chatId);
        if (!detailRes.success) {
          throw new Error(detailRes.error.message);
        }

        const { isGenerating, generatedAssets } = detailRes.data;
        if (isGenerating) {
          sawGenerating = true;
        }

        const newVideo = generatedAssets.find(
          (asset) =>
            asset.assetType === "VIDEO" &&
            !knownAssetIds.has(asset.assetId) &&
            Boolean(asset.previewUrl),
        );

        if (newVideo) {
          return { videoUrl: newVideo.previewUrl, prompt } satisfies GenerateVideoResult;
        }

        // 생성이 한 번이라도 시작된 뒤 종료됐는데 결과가 없으면 실패
        if (sawGenerating && !isGenerating) {
          throw new Error("비디오 생성에 실패했습니다.");
        }
      }

      throw new Error("비디오 생성 대기 시간이 초과되었습니다.");
    },
  });
}
