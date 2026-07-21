import type { SVGProps } from "react";
import ImageIcon from "@/components/icons/ImageIcon";
import ReversePromptIcon from "@/components/icons/ReversePromptIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import type { GenerationKind } from "@/types/generationHistory.types";

interface MediaKindIconProps extends SVGProps<SVGSVGElement> {
  kind: GenerationKind;
}

/** 이미지/비디오/역프롬프트 종류별 아이콘 — 생성 기록 패널, 라이브러리 카드 공용 */
export default function MediaKindIcon({ kind, ...props }: MediaKindIconProps) {
  if (kind === "VIDEO") {
    return <VideoIcon {...props} />;
  }
  if (kind === "REVERSE_PROMPT") {
    return <ReversePromptIcon {...props} />;
  }
  return <ImageIcon {...props} />;
}
