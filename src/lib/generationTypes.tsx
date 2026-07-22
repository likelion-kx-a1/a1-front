import ImageIcon from "@/components/icons/ImageIcon";
import RatioIcon from "@/components/icons/RatioIcon";
import ResolutionIcon from "@/components/icons/ResolutionIcon";
import ReversePromptIcon from "@/components/icons/ReversePromptIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import type { DropdownOption } from "@/components/ui/OptionDropdown";

/** 생성 타입 */
export type GenerationType = "이미지 생성" | "비디오 생성" | "역프롬프트";

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
export const GENERATION_TYPE_ROUTES: Record<GenerationType, string> = {
  "이미지 생성": "/image",
  "비디오 생성": "/video",
  역프롬프트: "/reverse-prompt",
};

/** 프로젝트 안에서 유지되는 생성 타입 → /project/[projectId]/{세그먼트} */
export const GENERATION_TYPE_PROJECT_SEGMENTS: Partial<Record<GenerationType, string>> = {
  "이미지 생성": "image",
  "비디오 생성": "video",
};

/** 비율별 설명 라벨 */
const RATIO_DESCRIPTIONS: Record<string, string> = {
  "16:9": "일반",
  "9:16": "릴스",
  "1:1": "정방형",
};

/** 이미지/비디오 생성 페이지 공통 - 비율 드롭다운 옵션 */
export const RATIO_OPTIONS: DropdownOption[] = Object.keys(RATIO_DESCRIPTIONS).map((ratio) => ({
  label: ratio,
  icon: <RatioIcon ratio={ratio} />,
  description: RATIO_DESCRIPTIONS[ratio],
}));

const RESOLUTION_ICON = <ResolutionIcon className="size-6 shrink-0 text-white" aria-hidden />;

/** 해상도별 설명 라벨 */
const RESOLUTION_DESCRIPTIONS: Record<string, string> = {
  "720p": "HD",
  "1080p": "FHD",
};

/** 이미지/비디오 생성 페이지 공통 - 해상도 드롭다운 옵션 */
export const RESOLUTION_OPTIONS: DropdownOption[] = Object.keys(RESOLUTION_DESCRIPTIONS).map(
  (label) => ({
    label,
    icon: RESOLUTION_ICON,
    description: RESOLUTION_DESCRIPTIONS[label],
  }),
);
