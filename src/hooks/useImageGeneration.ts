import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { createChat, getChatDetail, sendChatMessage } from "@/lib/chats";
import { useAuthStore } from "@/stores/authStore";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface GenerateImageParams {
  prompt: string;
  /** 참고 이미지 — multipart files로 함께 전송 */
  referenceImages?: File[];
}

interface GenerateImageResult {
  imageUrl: string;
  prompt: string;
}

/**
 * 이미지 생성 훅.
 * 채팅 메시지 API(POST /api/chats/{chatId}/messages, assetType=IMAGE)로 요청하고
 * 채팅 상세 조회로 생성 완료를 폴링.
 */
export function useImageGeneration(projectId?: number | null) {
  const user = useAuthStore((s) => s.user);
  // 이 훅이 마운트된 동안(같은 세션)에는 최초 생성 시 만든 채팅을 재사용
  const chatIdRef = useRef<number | null>(null);

  useEffect(() => {
    chatIdRef.current = null;
  }, [projectId]);

  return useMutation({
    mutationFn: async ({ prompt, referenceImages }: GenerateImageParams) => {
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      if (chatIdRef.current === null) {
        const chatRes = await createChat({ projectId: projectId ?? null, title: prompt });
        if (!chatRes.success) {
          throw new Error(chatRes.error.message);
        }
        chatIdRef.current = chatRes.data.chatId;
      }
      const chatId = chatIdRef.current;

      // 요청 전에 이미 있던 자산 ID — 새로 생긴 IMAGE만 결과로 사용
      const beforeRes = await getChatDetail(chatId);
      const knownAssetIds = new Set(
        beforeRes.success
          ? beforeRes.data.generatedAssets.map((asset) => asset.assetId)
          : [],
      );

      const messageRes = await sendChatMessage(chatId, {
        contentText: prompt,
        assetType: "IMAGE",
        files: referenceImages?.length ? referenceImages : undefined,
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

        const newImage = generatedAssets.find(
          (asset) =>
            asset.assetType === "IMAGE" &&
            !knownAssetIds.has(asset.assetId) &&
            Boolean(asset.previewUrl),
        );

        if (newImage) {
          return { imageUrl: newImage.previewUrl, prompt } satisfies GenerateImageResult;
        }

        // 생성이 한 번이라도 시작된 뒤 종료됐는데 결과가 없으면 실패
        if (sawGenerating && !isGenerating) {
          throw new Error("이미지 생성에 실패했습니다.");
        }
      }

      throw new Error("이미지 생성 대기 시간이 초과되었습니다.");
    },
  });
}
