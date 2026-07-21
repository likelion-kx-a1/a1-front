"use client";

import { useId } from "react";
import { twMerge } from "tailwind-merge";
import CircleQuestionIcon from "@/components/icons/CircleQuestionIcon";

interface PromptRefineToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 물음표 아이콘에 붙일 설명주면 스크린리더에 전달 */
  hint?: string;
  className?: string;
}

/**
 * 이미지/비디오 생성 페이지 공통 — "프롬프트 보정" 켜기/끄기.
 */
export default function PromptRefineToggle({
  checked,
  onChange,
  hint,
  className,
}: PromptRefineToggleProps) {
  const hintId = useId();

  return (
    <label
      className={twMerge(
        "flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#1c1f2a] px-4 py-3",
        className,
      )}
    >
      <span className="text-base text-[#bfc7d6]">프롬프트 보정</span>

      <CircleQuestionIcon className="size-4 shrink-0 text-[#bfc7d6]" aria-hidden />
      {hint && (
        <span id={hintId} className="sr-only">
          {hint}
        </span>
      )}

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={hint ? hintId : undefined}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="peer-checked:border-primary-500 peer-checked:bg-primary-500 peer-focus-visible:outline-primary-500 size-8 shrink-0 rounded border border-[#394257] bg-[#262c3b] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
      />
    </label>
  );
}
