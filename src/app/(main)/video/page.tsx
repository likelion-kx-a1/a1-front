"use client";

/** 비디오 생성 페이지 */

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import GenerateIcon from "@/components/icons/GenerateIcon";
import ImagePlusIcon from "@/components/icons/ImagePlusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import TimerIcon from "@/components/icons/TimerIcon";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import AuthModal from "@/features/auth/components/AuthModal";
import OptionDropdown from "@/components/ui/OptionDropdown";
import {
  GENERATION_TYPE_OPTIONS,
  GENERATION_TYPE_ROUTES,
  RATIO_OPTIONS,
  RESOLUTION_OPTIONS,
} from "@/lib/generationTypes";
import { useAuthStore } from "@/stores/authStore";

export default function VideoGenerationPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [type, setType] = useState("비디오 생성");
  const [ratio, setRatio] = useState("1:1");
  const [resolution, setResolution] = useState("480p");
  const [prompt, setPrompt] = useState("");

  const [frameModalOpen, setFrameModalOpen] = useState(false);
  const [frames, setFrames] = useState<File[]>([]);
  /** 모달 안에서만 편집 — "완료" 눌러야 frames에 반영 */
  const [draftFrames, setDraftFrames] = useState<File[]>([]);
  const [visibleSlots, setVisibleSlots] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** 파일 선택창을 연 슬롯 인덱스 — null이면 새로 추가, 값이 있으면 해당 프레임 교체 */
  const replaceIndexRef = useRef<number | null>(null);

  const MAX_FRAMES = 9;

  // 확정된 프레임들의 미리보기 URL 계산
  const framePreviews = useMemo(() => frames.map((file) => URL.createObjectURL(file)), [frames]);
  // 모달 편집 중인 프레임들의 미리보기 URL 계산
  const draftPreviews = useMemo(
    () => draftFrames.map((file) => URL.createObjectURL(file)),
    [draftFrames],
  );

  // 미리보기 URL 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      framePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [framePreviews]);

  useEffect(() => {
    return () => {
      draftPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [draftPreviews]);

  // 생성 타입 전환 → 해당 페이지로 이동
  const handleTypeChange = (next: string) => {
    setType(next);
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

  const handlePromptClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const replaceIndex = replaceIndexRef.current;
      setDraftFrames((prev) => {
        if (replaceIndex !== null) {
          return prev.map((f, i) => (i === replaceIndex ? file : f));
        }
        return prev.length < MAX_FRAMES ? [...prev, file] : prev;
      });
    }
    replaceIndexRef.current = null;
    e.target.value = "";
  };

  const openFilePicker = (index: number | null) => {
    replaceIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleRemoveFrame = (index: number) => {
    setFrames((prev) => prev.filter((_, i) => i !== index));
  };

  // 프레임 추가 모달 열기 — 현재 확정된 프레임을 임시본으로 복사
  const handleOpenFrameModal = () =>
    requireAuth(() => {
      setDraftFrames(frames);
      setFrameModalOpen(true);
    });

  // "완료" — 임시본을 확정본에 반영
  const handleConfirmFrames = () => {
    setFrames(draftFrames);
    setFrameModalOpen(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-end gap-6 py-10">
      {/* 캔버스 */}
      <section
        aria-label="비디오 생성 캔버스"
        className="-mx-8 flex min-h-[300px] w-full flex-1 items-center justify-center overflow-hidden bg-[#222]"
      >
        <p className="text-[40px] font-semibold text-white/10">튜토리얼</p>
      </section>

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

        {/* 프레임 + 설명 */}
        <div className="flex w-full flex-col gap-6 rounded-2xl bg-[#333] p-6">
          <div className="flex w-full items-center gap-4">
            <div className="flex flex-1 items-center gap-4">
              {framePreviews.length === 0 ? (
                <>
                  <div className="flex h-[120px] flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-[#555]">
                    <ImagePlusIcon className="size-6 text-white" aria-hidden />
                    <p className="text-center text-base leading-[1.5] text-[#bfc7d6]">시작 프레임</p>
                  </div>
                  <div className="flex h-[120px] flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-[#555]">
                    <ImagePlusIcon className="size-6 text-white" aria-hidden />
                    <p className="text-center text-base leading-[1.5] text-[#bfc7d6]">마지막 프레임</p>
                  </div>
                </>
              ) : (
                framePreviews.map((src, i) => (
                  <div
                    key={src}
                    className="group relative h-[120px] flex-1 overflow-hidden rounded-lg bg-[#555]"
                  >
                    <img
                      src={src}
                      alt={
                        i === 0
                          ? "시작 프레임"
                          : i === framePreviews.length - 1
                            ? "마지막 프레임"
                            : `프레임 ${i + 1}`
                      }
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label="프레임 삭제"
                      onClick={() => handleRemoveFrame(i)}
                      className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <CloseIcon className="size-4" aria-hidden />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              aria-label="프레임 추가"
              onClick={handleOpenFrameModal}
              className="flex h-[120px] w-[135px] flex-col items-center justify-center gap-2 rounded-lg bg-[#444]"
            >
              <PlusIcon className="size-6 text-[#6b6b6b]" aria-hidden />
              <span className="text-center text-base leading-[1.5] text-[#6b6b6b]">
                프레임 추가
              </span>
            </button>

            <button
              type="button"
              disabled
              aria-label="스토리보드 불러오기 (준비 중)"
              title="준비 중인 기능입니다"
              className="flex h-[120px] w-[280px] cursor-not-allowed flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#444] p-6 opacity-50"
            >
              <PlusIcon className="size-6 text-[#6b6b6b]" aria-hidden />
              <span className="text-center text-base leading-[1.5] text-[#6b6b6b]">
                스토리보드 불러오기
              </span>
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onClick={handlePromptClick}
            readOnly={!user}
            placeholder={"이미지를 설명해주세요\n참고 이미지를 추가해 완성도를 높여보세요"}
            aria-label="비디오 생성 프롬프트"
            className="h-[90px] w-full resize-none text-xl leading-[1.5] text-white placeholder:text-[#999] focus:placeholder:text-transparent focus:outline-none"
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

            <span aria-hidden className="h-6 w-px bg-gray-600" />

            <label className="flex h-12 items-center gap-2 rounded-lg px-4 py-3">
              <TimerIcon className="size-6 text-white" aria-hidden />
              <span className="sr-only">영상 길이(초)</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="초 입력..."
                className="h-9 w-20 rounded-lg bg-[#2b2b2b] p-2 text-center text-base text-white placeholder:text-[#999] focus:outline-none"
              />
            </label>
          </div>

          <button
            type="button"
            aria-label="비디오 생성"
            className="bg-primary-500 flex h-12 w-[120px] items-center justify-center rounded-lg"
          >
            <GenerateIcon className="size-8 text-white" aria-hidden />
          </button>
        </div>
      </div>

      {/* 프레임 추가 팝업 */}
      <Modal
        open={frameModalOpen}
        onClose={() => setFrameModalOpen(false)}
        label="프레임 추가"
        className="max-w-[735px] border-2 border-[#394257] bg-[#1c1f2a]"
      >
        <div className="flex flex-col gap-6 p-6">
          <h2 className="text-xl font-semibold text-white">프레임 추가</h2>

          <div className="flex flex-wrap gap-4">
            {Array.from({ length: visibleSlots }, (_, i) => (
              <div key={draftPreviews[i] ?? `empty-${i}`} className="relative shrink-0">
                {draftPreviews[i] ? (
                  <button
                    type="button"
                    aria-label="프레임 이미지 변경"
                    onClick={() => openFilePicker(i)}
                    className="group relative block h-[120px] w-[213px] overflow-hidden rounded-lg"
                  >
                    <img
                      src={draftPreviews[i]}
                      alt={`추가한 프레임 ${i + 1}`}
                      className="size-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-base text-white opacity-0 transition-opacity group-hover:opacity-100">
                      변경
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="프레임 이미지 선택"
                    onClick={() => openFilePicker(null)}
                    className="flex h-[120px] w-[213px] flex-col items-center justify-center gap-2 rounded-lg bg-[#555] text-[#bfc7d6]"
                  >
                    <ImagePlusIcon className="size-6" aria-hidden />
                    <span className="text-base">프레임 추가</span>
                  </button>
                )}

                {i === visibleSlots - 1 && visibleSlots < MAX_FRAMES && (
                  <button
                    type="button"
                    aria-label="프레임 슬롯 추가"
                    onClick={() => setVisibleSlots((prev) => Math.min(MAX_FRAMES, prev + 1))}
                    className="absolute top-1/2 -right-5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#444] text-[#bfc7d6]"
                  >
                    <PlusIcon className="size-5" aria-hidden />
                  </button>
                )}
              </div>
            ))}

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

          <Button type="button" onClick={handleConfirmFrames} className="h-12 w-full text-lg">
            완료
          </Button>
        </div>
      </Modal>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
