"use client";

/** 비디오 생성 페이지 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import RatioIcon from "@/components/icons/RatioIcon";
import OptionDropdown, { type DropdownOption } from "@/components/ui/OptionDropdown";

const GENERATION_TYPES = ["이미지 생성", "비디오 생성", "역프롬프트"];
const TYPE_ROUTES: Record<string, string> = {
  "이미지 생성": "/image",
  "비디오 생성": "/video",
  역프롬프트: "/reverse-prompt",
};

const RATIO_OPTIONS: DropdownOption[] = ["16:9", "3:2", "1:1", "2:3", "4:5", "9:16"].map(
  (ratio) => ({ label: ratio, icon: <RatioIcon ratio={ratio} /> }),
);
const RESOLUTION_ICON = <span className="size-6 shrink-0 bg-[#6b6b6b]" aria-hidden />;
const RESOLUTION_OPTIONS: DropdownOption[] = ["1K", "2K", "4K"].map((label) => ({
  label,
  icon: RESOLUTION_ICON,
}));

export default function VideoGenerationPage() {
  const router = useRouter();
  const [type, setType] = useState("비디오 생성");
  const [ratio, setRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1K");

  // 생성 타입 전환 → 해당 페이지로 이동
  const handleTypeChange = (next: string) => {
    setType(next);
    const href = TYPE_ROUTES[next];
    if (href) {
      router.push(href);
    }
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
          options={GENERATION_TYPES}
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
              <div className="flex h-[120px] flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-[#555]">
                <span className="size-8 bg-[#6b6b6b]" aria-hidden />
                <p className="text-center text-base leading-[1.5] text-white">시작 프레임</p>
              </div>
              <div className="flex h-[120px] flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-[#555]">
                <span className="size-8 bg-[#6b6b6b]" aria-hidden />
                <p className="text-center text-base leading-[1.5] text-white">마지막 프레임</p>
              </div>
            </div>

            <button
              type="button"
              aria-label="프레임 추가"
              className="flex h-[120px] w-[135px] flex-col items-center justify-center gap-2 rounded-lg bg-[#444]"
            >
              <span className="text-2xl leading-none text-[#6b6b6b]" aria-hidden>
                +
              </span>
              <span className="text-center text-base leading-[1.5] text-[#6b6b6b]">
                프레임 추가
              </span>
            </button>

            <button
              type="button"
              aria-label="스토리보드 불러오기"
              className="flex h-[120px] w-[280px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#444] p-6"
            >
              <span className="size-8 bg-[#6b6b6b]" aria-hidden />
              <span className="text-center text-base leading-[1.5] text-[#6b6b6b]">
                스토리보드 불러오기
              </span>
            </button>
          </div>

          <p className="max-h-[90px] text-xl leading-[1.5] text-[#999]">
            이미지를 설명해주세요
            <br />
            참고 이미지를 추가해 완성도를 높여보세요
          </p>
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

            <span aria-hidden className="h-6 w-px bg-gray-600" />

            <label className="flex h-12 items-center gap-2 rounded-lg px-4 py-3">
              <span className="size-6 bg-[#6b6b6b]" aria-hidden />
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
            <span className="size-10 bg-[#6b6b6b]" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
