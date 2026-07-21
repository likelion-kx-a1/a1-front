"use client";

import { useMemo, useState, type ComponentType, type SVGProps } from "react";
import ClockArrowIcon from "@/components/icons/ClockArrowIcon";
import ImageIcon from "@/components/icons/ImageIcon";
import ImagePlayIcon from "@/components/icons/ImagePlayIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import CardSection from "@/features/library/components/CardSection";
import OptionDropdown, { type DropdownOption } from "@/components/ui/OptionDropdown";
import { useMyMedia } from "@/hooks/useMedia";
import type { SavedMediaType } from "@/types/media.types";

type MediaTypeFilter = "ALL" | SavedMediaType;
type SortOrder = "latest" | "oldest";

// 표시 문구(label)와 로직이 쓰는 값(value)을 분리해, 문구를 바꿔도 동작이 안 깨지게 한다
/**
 * 시안은 24px 자리 안에 16px 글리프 + 2px 선.
 */
function FilterIcon({ icon: Icon }: { icon: ComponentType<SVGProps<SVGSVGElement>> }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center" aria-hidden>
      <Icon className="size-4" strokeWidth={2.5} />
    </span>
  );
}

const MEDIA_TYPE_OPTIONS: DropdownOption[] = [
  { value: "ALL", label: "전체", icon: <FilterIcon icon={ImagePlayIcon} /> },
  { value: "IMAGE", label: "이미지", icon: <FilterIcon icon={ImageIcon} /> },
  { value: "VIDEO", label: "비디오", icon: <FilterIcon icon={VideoIcon} /> },
];

const TIME_OPTIONS: DropdownOption[] = [
  {
    value: "latest",
    label: "최신 순",
    icon: <ClockArrowIcon direction="down" className="size-6 shrink-0" />,
  },
  {
    value: "oldest",
    label: "오래된 순",
    icon: <ClockArrowIcon direction="up" className="size-6 shrink-0" />,
  },
];

interface ProjectStorageViewProps {
  projectId: number;
}

function formatCreatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR");
}

/** 프로젝트 보관함 — 저장된 생성물 그리드 */
export default function ProjectStorageView({ projectId }: ProjectStorageViewProps) {
  const [mediaFilter, setMediaFilter] = useState<MediaTypeFilter>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");

  const mediaQuery = useMyMedia({
    projectId,
    mediaType: mediaFilter === "ALL" ? undefined : mediaFilter,
  });

  const cardItems = useMemo(() => {
    const items = mediaQuery.data?.success ? (mediaQuery.data.data ?? []) : [];
    const sorted = [...items].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === "latest" ? -diff : diff;
    });

    return sorted.map((item) => ({
      id: item.savedMediaId,
      title: item.displayName,
      mediaType: item.mediaType,
      mediaTypeLabel: item.mediaType === "VIDEO" ? "비디오" : "이미지",
      metaLine:
        item.mediaType === "VIDEO"
          ? "0.00B · 00:00"
          : "0.00B · 1920*1080",
      previewUrl: item.previewUrl,
      caption: formatCreatedAt(item.createdAt),
    }));
  }, [mediaQuery.data, sortOrder]);

  return (
    <section aria-labelledby="project-storage-heading" className="flex flex-col gap-6">
      <h2 id="project-storage-heading" className="sr-only">
        보관함
      </h2>

      <div className="flex flex-wrap gap-4" role="group" aria-label="보관함 필터">
        <OptionDropdown
          label="미디어 종류"
          options={MEDIA_TYPE_OPTIONS}
          value={mediaFilter}
          onChange={(next) => setMediaFilter(next as MediaTypeFilter)}
          variant="sort"
          size="xl"
          labelWidth="w-12"
          direction="down"
        />
        <OptionDropdown
          label="정렬 순서"
          options={TIME_OPTIONS}
          value={sortOrder}
          onChange={(next) => setSortOrder(next as SortOrder)}
          variant="sort"
          size="xl"
          direction="down"
        />
      </div>

      {mediaQuery.isLoading ? (
        <p className="text-gray-400">저장된 생성물 불러오는 중…</p>
      ) : mediaQuery.data && !mediaQuery.data.success ? (
        <p role="alert" className="text-red-400">
          {mediaQuery.data.error.message}
        </p>
      ) : cardItems.length === 0 ? (
        <p className="text-gray-400">아직 보관함에 저장된 생성물이 없습니다.</p>
      ) : (
        <CardSection heading="저장된 생성물" items={cardItems} />
      )}
    </section>
  );
}
