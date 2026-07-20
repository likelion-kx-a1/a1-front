"use client";

import { useMemo, useState } from "react";
import CardSection from "@/features/library/components/CardSection";
import OptionDropdown from "@/components/ui/OptionDropdown";
import { useMyMedia } from "@/hooks/useMedia";
import type { SavedMediaType } from "@/types/media.types";

type MediaTypeFilter = "ALL" | SavedMediaType;

const MEDIA_TYPE_OPTIONS = ["전체", "이미지", "비디오"];
const TIME_OPTIONS = ["최신순", "오래된순"];

interface ProjectStorageViewProps {
  projectId: number;
}

function mapMediaFilter(label: string): MediaTypeFilter {
  if (label === "이미지") {
    return "IMAGE";
  }
  if (label === "비디오") {
    return "VIDEO";
  }
  return "ALL";
}

function formatCreatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR");
}

/** 프로젝트 보관함 — 저장된 생성물 그리드 */
export default function ProjectStorageView({ projectId }: ProjectStorageViewProps) {
  const [mediaTypeLabel, setMediaTypeLabel] = useState("전체");
  const [timeLabel, setTimeLabel] = useState("최신순");

  const mediaFilter = mapMediaFilter(mediaTypeLabel);
  const mediaQuery = useMyMedia({
    projectId,
    mediaType: mediaFilter === "ALL" ? undefined : mediaFilter,
  });

  const cardItems = useMemo(() => {
    const items = mediaQuery.data?.success ? (mediaQuery.data.data ?? []) : [];
    const sorted = [...items].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return timeLabel === "최신순" ? -diff : diff;
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
  }, [mediaQuery.data, timeLabel]);

  return (
    <section aria-labelledby="project-storage-heading" className="flex flex-col gap-6">
      <h2 id="project-storage-heading" className="sr-only">
        보관함
      </h2>

      <div className="flex flex-wrap gap-4" role="group" aria-label="보관함 필터">
        <OptionDropdown
          triggerLabel="미디어 종류"
          options={MEDIA_TYPE_OPTIONS}
          value={mediaTypeLabel}
          onChange={setMediaTypeLabel}
          variant="ghost"
          direction="down"
          listIcon={false}
          className="w-36 bg-[#333]"
        />
        <OptionDropdown
          triggerLabel="시간"
          options={TIME_OPTIONS}
          value={timeLabel}
          onChange={setTimeLabel}
          variant="ghost"
          direction="down"
          listIcon={false}
          className="w-36 bg-[#333]"
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
