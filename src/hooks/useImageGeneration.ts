import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { createChat } from "@/lib/chats";
import {
  extractImageUrl,
  fileToBase64,
  getFalJobStatus,
  regeneratePrompt,
  submitFalJob,
} from "@/lib/generation";
import { useAuthStore } from "@/stores/authStore";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface GenerateImageParams {
  prompt: string;
  referenceImage?: File;
}

interface GenerateImageResult {
  imageUrl: string;
  prompt: string;
}

export function useImageGeneration(projectId?: number | null) {
  const userId = useAuthStore((s) => s.user?.id);
  // 이 훅이 마운트된 동안(같은 세션)에는 최초 생성 시 만든 채팅을 재사용
  const chatIdRef = useRef<number | null>(null);

  useEffect(() => {
    chatIdRef.current = null;
  }, [projectId]);

  return useMutation({
    mutationFn: async ({ prompt, referenceImage }: GenerateImageParams) => {
      if (!userId) {
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

      let finalPrompt = prompt;

      if (referenceImage) {
        const imageBase64 = await fileToBase64(referenceImage);
        const promptRes = await regeneratePrompt({
          userId,
          chatId,
          imageBase64,
          mimeType: referenceImage.type,
          instruction: prompt,
        });
        if (!promptRes.success) {
          throw new Error(promptRes.error.message);
        }
        const refined = promptRes.data.responsePayload?.text;
        if (typeof refined === "string" && refined.trim()) {
          finalPrompt = refined;
        }
      }

      const submitRes = await submitFalJob({
        userId,
        chatId,
        jobType: "IMAGE_GENERATION",
        modelCode: "openai/gpt-image-2",
        input: { prompt: finalPrompt },
      });
      if (!submitRes.success) {
        throw new Error(submitRes.error.message);
      }
      const jobId = submitRes.data.id;

      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        await sleep(POLL_INTERVAL_MS);
        const statusRes = await getFalJobStatus(jobId);
        if (!statusRes.success) {
          throw new Error(statusRes.error.message);
        }
        const job = statusRes.data;

        if (job.status === "COMPLETED") {
          const imageUrl = extractImageUrl(job.responsePayload);
          if (!imageUrl) {
            throw new Error("생성된 이미지 URL을 찾을 수 없습니다.");
          }
    
          return { imageUrl, prompt: finalPrompt } satisfies GenerateImageResult;
        }
        if (job.status === "FAILED" || job.status === "CANCELED" || job.status === "EXPIRED") {
          throw new Error(job.errorMessage ?? "이미지 생성에 실패했습니다.");
        }
      }

      throw new Error("이미지 생성 대기 시간이 초과되었습니다.");
    },
  });
}
