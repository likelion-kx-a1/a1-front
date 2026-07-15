"use client";

/** 이미지 생성 페이지 */

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import GenerateIcon from "@/components/icons/GenerateIcon";
import RatioIcon from "@/components/icons/RatioIcon";
import AuthModal from "@/features/auth/components/AuthModal";
import OptionDropdown, { type DropdownOption } from "@/components/ui/OptionDropdown";
import { GENERATION_TYPE_OPTIONS, GENERATION_TYPE_ROUTES } from "@/lib/generationTypes";
import { useAuthStore } from "@/stores/authStore";

const RATIO_OPTIONS: DropdownOption[] = ["16:9", "3:2", "1:1", "2:3", "4:5", "9:16"].map(
  (ratio) => ({ label: ratio, icon: <RatioIcon ratio={ratio} /> }),
);
const RESOLUTION_ICON = <span className="size-6 shrink-0 bg-[#6b6b6b]" aria-hidden />;
const RESOLUTION_OPTIONS: DropdownOption[] = ["1K", "2K", "4K"].map((label) => ({
  label,
  icon: RESOLUTION_ICON,
}));

export default function ImageGenerationPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [type, setType] = useState("이미지 생성");
  const [ratio, setRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1K");

  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddImageClick = () => requireAuth(() => fileInputRef.current?.click());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImages((prev) => [...prev, file]);
    }
    e.target.value = "";
  };

  const handlePromptClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-end gap-6 py-10">
      {/* 캔버스 */}
      <section
        aria-label="이미지 생성 캔버스"
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

        {/* 프롬프트 입력 */}
        <div className="flex w-full flex-col gap-6 rounded-2xl bg-[#333] p-6">
          <div className="flex flex-wrap items-center gap-4">
            {referencePreviews.length === 0 ? (
              <span className="size-25 rounded-lg bg-[#444]" aria-hidden />
            ) : (
              referencePreviews.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`선택한 참고 이미지 ${i + 1}`}
                  className="size-25 rounded-lg object-cover"
                />
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
              direction="up"
              className="w-24"
            />
          </div>

          <button
            type="button"
            aria-label="이미지 생성"
            className="bg-primary-500 flex h-12 w-[120px] items-center justify-center rounded-lg"
          >
            <GenerateIcon className="size-8 text-white" aria-hidden />
          </button>
        </div>
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
