"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CardSection from "@/features/library/components/CardSection";
import { useMyMedia } from "@/hooks/useMedia";
import { useProject } from "@/hooks/useProjects";
import type { SavedMediaType } from "@/types/media.types";

type MediaFilter = "ALL" | SavedMediaType;

interface LibraryProjectViewProps {
  projectId: number;
}

function formatCreatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR");
}

/** 프로젝트별 저장 생성물 목록 */
export default function LibraryProjectView({ projectId }: LibraryProjectViewProps) {
  const [filter, setFilter] = useState<MediaFilter>("ALL");
  const projectQuery = useProject(projectId);
  const mediaQuery = useMyMedia({
    projectId,
    mediaType: filter === "ALL" ? undefined : filter,
  });

  const projectName =
    projectQuery.data?.success ? projectQuery.data.data.name : `프로젝트 ${projectId}`;

  const cardItems = useMemo(() => {
    const items = mediaQuery.data?.success ? mediaQuery.data.data : [];
    return items.map((item) => ({
      id: item.savedMediaId,
      title: item.displayName,
      caption: formatCreatedAt(item.createdAt),
      previewUrl: item.previewUrl,
      mediaType: item.mediaType,
    }));
  }, [mediaQuery.data]);

  const tabs: { label: string; value: MediaFilter }[] = [
    { label: "전체", value: "ALL" },
    { label: "이미지", value: "IMAGE" },
    { label: "비디오", value: "VIDEO" },
  ];

  return (
    <div className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-4">
        <Link href="/library" className="w-fit text-sm text-gray-400 hover:text-white">
          ← 내 라이브러리
        </Link>
        <h1 className="text-2xl font-semibold text-white">{projectName}</h1>
      </div>

      <div className="flex gap-2" role="tablist" aria-label="미디어 종류">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={filter === tab.value}
            onClick={() => setFilter(tab.value)}
            className={`h-10 rounded-lg px-4 text-sm ${
              filter === tab.value ? "bg-primary-500 text-white" : "bg-[#333] text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mediaQuery.isLoading ? (
        <p className="text-gray-400">저장된 생성물 불러오는 중…</p>
      ) : mediaQuery.data && !mediaQuery.data.success ? (
        <p className="text-red-400">{mediaQuery.data.error.message}</p>
      ) : cardItems.length > 0 ? (
        <CardSection heading="저장된 생성물" items={cardItems} />
      ) : null}
    </div>
  );
}
