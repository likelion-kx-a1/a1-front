import { twMerge } from "tailwind-merge";

interface GeneratingSpinnerProps {
  isGenerating: boolean;
  /** 생성 중/완료 상태를 스크린리더에 알릴 때 쓸 대상 이름 */
  label?: string;
  className?: string;
}

/** 생성 결과가 나올 자리 — 생성 중엔 스피너 */
export default function GeneratingSpinner({
  isGenerating,
  label = "생성",
  className = "",
}: GeneratingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={isGenerating ? `${label} 생성 중` : `${label} 생성 완료`}
      className={twMerge(
        "flex h-[450px] w-full max-w-[800px] items-center justify-center overflow-hidden rounded-2xl bg-[#222] p-[10px]",
        className,
      )}
    >
      {isGenerating && (
        <span
          aria-hidden
          className="size-20 animate-spin rounded-full border-4 border-white/20 border-t-white"
        />
      )}
    </div>
  );
}
