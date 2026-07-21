import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import CircleQuestionIcon from "@/components/icons/CircleQuestionIcon";

interface FrameCardProps {
  label: string;
  icon: ReactNode;
  /** 라벨 옆에 물음표 아이콘을 붙일지 */
  hint?: boolean;
  /** 누를 수 있는 카드면 버튼으로, 없으면 자리만 잡는 장식으로 렌더링 */
  onClick?: () => void;
  disabled?: boolean;
  /** 채워진 카드(회색 배경) / 비어 있는 카드(점선 테두리) */
  filled?: boolean;
  /** 마우스 올렸을 때 뜨는 설명 */
  title?: string;
  className?: string;
}

const BASE =
  "flex h-20 w-[120px] shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg";
const LABEL = "text-center text-[13px] leading-[1.5] tracking-[-0.26px] text-[#bfc7d6]";

/** 비디오 생성 페이지 공통 — 프레임·참조 이미지 슬롯 카드 */
export default function FrameCard({
  label,
  icon,
  hint = false,
  onClick,
  disabled,
  filled = false,
  title,
  className,
}: FrameCardProps) {
  const style = twMerge(
    BASE,
    filled ? "bg-[#262c3b]" : "border border-dashed border-[#394257]",
    disabled && "cursor-not-allowed opacity-50",
    className,
  );

  const body = (
    <>
      {icon}
      <span className="flex items-center gap-1">
        <span className={LABEL}>{label}</span>
        {hint && <CircleQuestionIcon className="size-4 shrink-0 text-[#bfc7d6]" aria-hidden />}
      </span>
    </>
  );

  // 누를 수 없는 카드는 빈 자리
  if (!onClick) {
    return (
      <div aria-hidden className={style}>
        {body}
      </div>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title} className={style}>
      {body}
    </button>
  );
}
