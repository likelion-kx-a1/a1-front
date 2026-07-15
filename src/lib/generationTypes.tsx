import type { ComponentType, SVGProps } from "react";
import ImageIcon from "@/components/icons/ImageIcon";
import ReversePromptIcon from "@/components/icons/ReversePromptIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import type { DropdownOption } from "@/components/ui/OptionDropdown";

/** 생성 타입 드롭다운에서 쓰는 아이콘 */
function BoxedIcon({ icon: Icon }: { icon: ComponentType<SVGProps<SVGSVGElement>> }) {
  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded border-2 border-white"
    >
      <Icon className="size-5 text-white" />
    </span>
  );
}

/** 이미지/비디오/역프롬프트 생성 페이지 공통 - 생성 타입 전환 드롭다운 옵션 */
export const GENERATION_TYPE_OPTIONS: DropdownOption[] = [
  { label: "이미지 생성", icon: <BoxedIcon icon={ImageIcon} /> },
  { label: "비디오 생성", icon: <BoxedIcon icon={VideoIcon} /> },
  { label: "역프롬프트", icon: <BoxedIcon icon={ReversePromptIcon} /> },
];

/** 생성 타입 → 이동할 라우트 */
export const GENERATION_TYPE_ROUTES: Record<string, string> = {
  "이미지 생성": "/image",
  "비디오 생성": "/video",
  역프롬프트: "/reverse-prompt",
};
