"use client";

import { useRouter } from "next/navigation";
import OptionDropdown from "@/components/ui/OptionDropdown";
import {
  GENERATION_TYPE_OPTIONS,
  GENERATION_TYPE_PROJECT_SEGMENTS,
  GENERATION_TYPE_ROUTES,
  type GenerationType,
} from "@/lib/generationTypes";

interface GenerationTypeDropdownProps {
  /** 현재 페이지의 생성 타입 */
  current: GenerationType;
  /** 프로젝트 안이면 이미지/비디오는 프로젝트 라우트로 유지 */
  projectId?: number;
  className?: string;
}

/** 이미지/비디오/역프롬프트 생성 페이지 공통 — 생성 타입 전환 드롭다운 */
export default function GenerationTypeDropdown({
  current,
  projectId,
  className = "w-[220px]",
}: GenerationTypeDropdownProps) {
  const router = useRouter();

  // 선택한 타입의 페이지로 이동.
  const handleChange = (next: string) => {
    if (next === current) {
      return;
    }
    const segment = GENERATION_TYPE_PROJECT_SEGMENTS[next as GenerationType];
    if (projectId && segment) {
      router.push(`/project/${projectId}/${segment}`);
      return;
    }
    const href = GENERATION_TYPE_ROUTES[next as GenerationType];
    if (href) {
      router.push(href);
    }
  };

  return (
    <OptionDropdown
      options={GENERATION_TYPE_OPTIONS}
      value={current}
      onChange={handleChange}
      variant="glass"
      size="lg"
      direction="up"
      className={className}
    />
  );
}
