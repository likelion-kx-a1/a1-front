import { twMerge } from "tailwind-merge";
import StarIcon from "@/components/icons/StarIcon";

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/** 이미지/비디오 생성 페이지 공통 — 하단 "생성하기" 버튼 */
export default function GenerateButton({ onClick, disabled, className }: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        "bg-primary-500 flex h-12 w-28 items-center justify-center gap-2 overflow-hidden rounded-lg text-base text-white disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <StarIcon className="size-6 shrink-0" aria-hidden />
      생성하기
    </button>
  );
}
