"use client";

import { twMerge } from "tailwind-merge";
import TimerIcon from "@/components/icons/TimerIcon";

interface DurationInputProps {
  /** 초 단위 숫자 문자열 (빈 문자열이면 미입력) */
  value: string;
  onChange: (seconds: string) => void;
  className?: string;
}

/** 생성 바 공통 — 영상 길이(초) 입력 */
export default function DurationInput({ value, onChange, className }: DurationInputProps) {
  return (
    <label
      className={twMerge(
        "flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1c1f2a] px-4 py-3",
        className,
      )}
    >
      {/* 시계 아이콘은 장식 — 실제 이름은 아래 sr-only 텍스트가 담당 */}
      <TimerIcon className="size-6 shrink-0 text-white" aria-hidden />
      <span className="sr-only">영상 길이(초)</span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        // type="number"의 스피너·소수점 입력을 피하려고 text로 받는다
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder="초 입력..."
        className="h-9 w-24 rounded-lg bg-[#111119] p-2 text-center text-base text-white placeholder:text-[#bfc7d6] focus:outline-none"
      />
    </label>
  );
}
