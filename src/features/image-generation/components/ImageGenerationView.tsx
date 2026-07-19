"use client";

/** 이미지 생성 화면 — 독립 라우트(/image)와 프로젝트 라우트(/project/[projectId]/image) 양쪽에서 재사용 */

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import CopyIcon from "@/components/icons/CopyIcon";
import DownloadIcon from "@/components/icons/DownloadIcon";
import GenerateIcon from "@/components/icons/GenerateIcon";
import GeneratingSpinner from "@/components/ui/GeneratingSpinner";
import AuthModal from "@/features/auth/components/AuthModal";
import OptionDropdown from "@/components/ui/OptionDropdown";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import {
  GENERATION_TYPE_OPTIONS,
  GENERATION_TYPE_ROUTES,
  RATIO_OPTIONS,
  RESOLUTION_OPTIONS,
} from "@/lib/generationTypes";
import { useAuthStore } from "@/stores/authStore";

interface ImageGenerationViewProps {
  /** 이 화면이 속한 프로젝트 ID. 없으면(undefined) 프로젝트와 무관한 독립 채팅으로 생성 */
  projectId?: number;
}

export default function ImageGenerationView({ projectId }: ImageGenerationViewProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [type, setType] = useState("이미지 생성");
  const [ratio, setRatio] = useState("1:1");
  const [resolution, setResolution] = useState("480p");

  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const generation = useImageGeneration(projectId);

  // 선택한 참고 이미지들의 미리보기 URL
  const referencePreviews = useMemo(
    () => referenceImages.map((file) => URL.createObjectURL(file)),
    [referenceImages],
  );

  // 미리보기 URL 정리
  useEffect(() => {
    return () => {
      referencePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [referencePreviews]);

  // 생성 타입 전환 → 해당 페이지로 이동. 비디오/역프롬프트는 아직 프로젝트 개념이 없어 플랫 라우트로 이동
  const handleTypeChange = (next: string) => {
    setType(next);
    if (projectId && next === "이미지 생성") {
      return;
    }
    const href = GENERATION_TYPE_ROUTES[next];
    if (href) {
      router.push(href);
    }
  };

  // 로그인 상태에서만 실행
  const requireAuth = (action: () => void) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    action();
  };

  const handleAddImageClick = () => requireAuth(() => fileInputRef.current?.click());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImages((prev) => [...prev, file]);
    }
    e.target.value = "";
  };

  const handleRemoveReferenceImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePromptClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    }
  };

  // 이미지 생성 요청
  const handleGenerate = () => {
    requireAuth(() => {
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) {
        return;
      }
      setSubmittedPrompt(trimmedPrompt);
      setPrompt("");
      generation.mutate({ prompt: trimmedPrompt, referenceImage: referenceImages[0] });
    });
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(submittedPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-end gap-6 py-10">
      {/* 캔버스 / 생성 결과 */}
      {submittedPrompt ? (
        <div
          aria-live="polite"
          className="-mx-8 flex w-full flex-1 flex-col items-end justify-end gap-4 overflow-y-auto px-10"
        >
          {/* 생성 중/완료된 이미지 */}
          {generation.isSuccess ? (
            <div className="group relative h-[450px] w-full max-w-[800px]">
              <img
                src={generation.data.imageUrl}
                alt={submittedPrompt}
                className="size-full rounded-2xl bg-[#222] object-contain p-[10px]"
              />
              <div
                role="toolbar"
                aria-label="이미지 액션"
                className="absolute right-4 bottom-4 flex gap-4 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <button
                  type="button"
                  disabled
                  aria-label="이미지 저장 (준비 중)"
                  title="준비 중인 기능입니다"
                  className="flex h-12 cursor-not-allowed items-center justify-center rounded-lg bg-[#333] px-6 text-base text-white opacity-50"
                >
                  저장
                </button>
                <button
                  type="button"
                  disabled
                  aria-label="이미지 링크 복사 (준비 중)"
                  title="준비 중인 기능입니다"
                  className="flex size-12 cursor-not-allowed items-center justify-center rounded-lg bg-[#333] text-white opacity-50"
                >
                  <CopyIcon className="size-6" aria-hidden />
                </button>
                <button
                  type="button"
                  disabled
                  aria-label="이미지 다운로드 (준비 중)"
                  title="준비 중인 기능입니다"
                  className="flex size-12 cursor-not-allowed items-center justify-center rounded-lg bg-[#333] text-white opacity-50"
                >
                  <DownloadIcon className="size-6" aria-hidden />
                </button>
              </div>
            </div>
          ) : generation.isError ? (
            <div className="flex h-[450px] w-full max-w-[800px] items-center justify-center rounded-2xl bg-[#222] p-6 text-center text-red-400">
              {generation.error.message}
            </div>
          ) : (
            <GeneratingSpinner isGenerating={generation.isPending} label="이미지" />
          )}

          {/* 보낸 프롬프트 */}
          <div className="flex w-full max-w-[1000px] flex-col items-end gap-6 rounded-lg bg-[#222] p-6">
            <p className="w-full text-xl leading-[1.5] tracking-[-0.4px] text-white">
              {submittedPrompt}
            </p>
            <button
              type="button"
              aria-label={copied ? "복사됨" : "프롬프트 복사"}
              onClick={handleCopyPrompt}
              className="flex size-12 items-center justify-center rounded-lg bg-[#333] text-white"
            >
              <CopyIcon className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      ) : (
        <section
          aria-label="이미지 생성 캔버스"
          className="-mx-8 flex min-h-[300px] w-full flex-1 items-center justify-center overflow-hidden bg-[#222]"
        >
          <p className="text-[40px] font-semibold text-white/10">튜토리얼</p>
        </section>
      )}

      {/* 설정 패널 */}
      <div className="flex w-full max-w-[1200px] shrink-0 flex-col items-start gap-4 p-6">
        {/* 생성 타입 전환 */}
        <OptionDropdown
          options={GENERATION_TYPE_OPTIONS}
          value={type}
          onChange={handleTypeChange}
          variant="primary"
          size="lg"
          direction="up"
          className="w-[220px]"
        />

        {/* 프롬프트 입력 */}
        <div className="flex w-full flex-col gap-6 rounded-2xl bg-[#333] p-6">
          <div className="flex flex-wrap items-center gap-4">
            {referencePreviews.length === 0 ? (
              <span className="size-25 rounded-lg bg-[#444]" aria-hidden />
            ) : (
              referencePreviews.map((src, i) => (
                <div key={src} className="group relative size-25 shrink-0">
                  <img
                    src={src}
                    alt={`선택한 참고 이미지 ${i + 1}`}
                    className="size-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    aria-label="참고 이미지 삭제"
                    onClick={() => handleRemoveReferenceImage(i)}
                    className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <CloseIcon className="size-4" aria-hidden />
                  </button>
                </div>
              ))
            )}
            <button
              type="button"
              aria-label="참고 이미지 추가"
              onClick={handleAddImageClick}
              className="flex size-25 items-center justify-center rounded-lg bg-[#444] text-2xl text-gray-300"
            >
              +
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              aria-hidden
              tabIndex={-1}
            />
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onClick={handlePromptClick}
            readOnly={!user}
            placeholder={"이미지를 설명해주세요\n참고 이미지를 추가해 완성도를 높여보세요"}
            aria-label="이미지 생성 프롬프트"
            className="h-[90px] w-full resize-none text-xl leading-[1.5] text-white placeholder:text-[#999] focus:outline-none focus:placeholder:text-transparent"
          />
        </div>

        {/* 옵션 + 생성 버튼 */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4 rounded-lg bg-[#333] px-4 py-2">
            <OptionDropdown
              options={RATIO_OPTIONS}
              value={ratio}
              onChange={setRatio}
              variant="ghost"
              chevron={false}
              direction="up"
              className="w-24"
            />
            <OptionDropdown
              options={RESOLUTION_OPTIONS}
              value={resolution}
              onChange={setResolution}
              variant="ghost"
              chevron={false}
              listIcon={false}
              direction="up"
              className="w-24"
            />
          </div>

          <button
            type="button"
            aria-label="이미지 생성"
            onClick={handleGenerate}
            disabled={!prompt.trim() || generation.isPending}
            className="bg-primary-500 flex h-12 w-[120px] items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GenerateIcon className="size-8 text-white" aria-hidden />
          </button>
        </div>
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
