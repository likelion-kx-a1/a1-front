"use client";

/** 역프롬프트 페이지 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import GenerationWorkspaceLayout from "@/components/layout/GenerationWorkspaceLayout";
import OptionDropdown from "@/components/ui/OptionDropdown";
import AuthModal from "@/features/auth/components/AuthModal";
import { useGenerationHistory } from "@/hooks/useGenerationHistory";
import { GENERATION_TYPE_OPTIONS, GENERATION_TYPE_ROUTES } from "@/lib/generationTypes";
import { appendReversePromptHistory, getHistoryScopeKey } from "@/lib/generationHistoryStorage";
import { useAuthStore } from "@/stores/authStore";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function ReversePromptPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [type, setType] = useState("역프롬프트");
  const { refreshReversePromptHistory } = useGenerationHistory(null);

  const handleTypeChange = (next: string) => {
    setType(next);
    const href = GENERATION_TYPE_ROUTES[next];
    if (href) {
      router.push(href);
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) {
      return;
    }

    try {
      const previewUrl = await readFileAsDataUrl(file);
      appendReversePromptHistory(getHistoryScopeKey(null), {
        id: crypto.randomUUID(),
        prompt: file.name,
        previewUrl,
        createdAt: new Date().toISOString(),
      });
      refreshReversePromptHistory();
    } catch {
      // 미리보기 저장 실패는 업로드 흐름을 막지 않음
    }
  };

  return (
    <GenerationWorkspaceLayout>
      <div className="flex h-full min-h-0 flex-col items-center justify-end gap-6 py-10">
        <div aria-hidden className="min-h-[300px] w-full flex-1" />

        <div className="flex h-[430px] w-full max-w-[1200px] shrink-0 flex-col items-start gap-4 p-6">
          <OptionDropdown
            options={GENERATION_TYPE_OPTIONS}
            value={type}
            onChange={handleTypeChange}
            variant="primary"
            size="lg"
            direction="up"
            className="w-[220px]"
          />

          <div className="flex w-full flex-1 flex-col items-start rounded-2xl bg-[#333] p-6">
            <div className="flex w-full flex-1 flex-col items-start rounded-lg border-2 border-dashed border-[#444] bg-[#222] p-4">
              <label
                htmlFor="reverse-prompt-upload"
                onClick={handleUploadClick}
                className="flex w-full flex-1 cursor-pointer items-center justify-center text-center text-xl leading-[1.5] text-[#999]"
              >
                이미지를 드래그 하거나 추가하세요
                <input
                  id="reverse-prompt-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>

        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </GenerationWorkspaceLayout>
  );
}
