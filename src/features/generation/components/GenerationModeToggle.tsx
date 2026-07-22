"use client";

interface GenerationModeToggleProps<T extends string> {
  /** 선택지 목록 (예: ["기본", "캐릭터"]) */
  options: readonly T[];
  /** 현재 선택된 값 */
  value: T;
  onChange: (value: T) => void;
  /** 스크린리더용 그룹 이름 (예: "이미지 생성 모드") */
  label: string;
}

/**
 * 이미지(기본/캐릭터)·비디오(고품질/빠른) 등에서 공용으로 사용
 */
export default function GenerationModeToggle<T extends string>({
  options,
  value,
  onChange,
  label,
}: GenerationModeToggleProps<T>) {
  return (
    // 라디오 그룹
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-2xl bg-[#1c1f2a] p-2"
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={`flex w-40 items-center justify-center rounded-lg py-3 text-base ${
              active
                ? "border border-[#394257] bg-[#262c3b] font-medium text-white"
                : "font-normal text-[#bfc7d6]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
