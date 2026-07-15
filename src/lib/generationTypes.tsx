import ImageIcon from "@/components/icons/ImageIcon";
import ReversePromptIcon from "@/components/icons/ReversePromptIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import type { DropdownOption } from "@/components/ui/OptionDropdown";

/** 이미지/비디오/역프롬프트 생성 페이지 공통 - 생성 타입 전환 드롭다운 옵션 */
export const GENERATION_TYPE_OPTIONS: DropdownOption[] = [
  { label: "이미지 생성", icon: <ImageIcon className="size-6 shrink-0 text-white" aria-hidden /> },
  { label: "비디오 생성", icon: <VideoIcon className="size-6 shrink-0 text-white" aria-hidden /> },
  {
    label: "역프롬프트",
    icon: <ReversePromptIcon className="size-6 shrink-0 text-white" aria-hidden />,
  },
];

/** 생성 타입 → 이동할 라우트 */
export const GENERATION_TYPE_ROUTES: Record<string, string> = {
  "이미지 생성": "/image",
  "비디오 생성": "/video",
  역프롬프트: "/reverse-prompt",
};
