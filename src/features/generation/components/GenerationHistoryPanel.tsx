"use client";

import { useState } from "react";
import CaretIcon from "@/components/icons/CaretIcon";
import MediaKindIcon from "@/components/ui/MediaKindIcon";
import { useGenerationHistory } from "@/hooks/useGenerationHistory";
import type { GenerationHistoryEntry, GenerationKind } from "@/types/generationHistory.types";

interface GenerationHistoryPanelProps {
  projectId?: number;
  className?: string;
}

const PANEL_WIDTH = 220;

const KIND_LABELS: Record<GenerationKind, string> = {
  IMAGE: "이미지 생성",
  VIDEO: "비디오 생성",
  REVERSE_PROMPT: "역프롬프트",
};

function HistoryCard({ entry }: { entry: GenerationHistoryEntry }) {
  const label = entry.prompt.trim() || KIND_LABELS[entry.kind];

  return (
    <article
      aria-label={label}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-[#222]/90 p-3 shadow-lg backdrop-blur-sm"
    >
      <figure className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#333]">
        {entry.previewUrl ? (
          entry.kind === "VIDEO" ? (
            <video
              src={entry.previewUrl}
              muted
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          ) : (
            <img src={entry.previewUrl} alt="" className="size-full object-cover" />
          )
        ) : null}
        {entry.status === "generating" && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40"
            aria-hidden
          >
            <span className="size-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
        <span
          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md bg-black/50"
          aria-hidden
        >
          <MediaKindIcon kind={entry.kind} className="size-4 text-white" />
        </span>
        <figcaption className="sr-only">{label}</figcaption>
      </figure>
      <time dateTime={entry.createdAt} className="sr-only">
        {new Date(entry.createdAt).toLocaleString("ko-KR")}
      </time>
    </article>
  );
}

export default function GenerationHistoryPanel({
  projectId,
  className = "",
}: GenerationHistoryPanelProps) {
  const { entries, isLoading, isEmpty } = useGenerationHistory(projectId);
  const [isOpen, setIsOpen] = useState(false);
  const panelId = "generation-history-panel";

  return (
    <aside
      aria-label="생성 기록"
      className={`pointer-events-none absolute top-20 bottom-24 z-30 ${isOpen ? "right-0" : "-right-4"} ${className}`}
    >
      <div className="pointer-events-auto flex h-full items-center">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={isOpen ? "생성 기록 접기" : "생성 기록 펼치기"}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-20 w-9 shrink-0 self-center items-center justify-center rounded-lg border-2 border-[#394257] bg-[#1c1f2a]/60 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-[#2a2e3d]/80"
        >
          <CaretIcon
            className={`size-6 transition-transform duration-300 ${isOpen ? "rotate-90" : "-rotate-90"}`}
            aria-hidden
          />
        </button>

        <div
          id={panelId}
          aria-hidden={!isOpen}
          className="h-full self-stretch overflow-hidden transition-[width,opacity] duration-300 ease-in-out"
          style={{
            width: isOpen ? PANEL_WIDTH : 0,
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div
            className="flex h-full flex-col rounded-l-2xl border border-white/10 border-r-0 bg-black/45 backdrop-blur-md"
            style={{ width: PANEL_WIDTH }}
          >
            <nav
              aria-label="생성 기록 목록"
              className="min-h-0 flex-1 overflow-y-auto p-3"
            >
              {isLoading && isEmpty ? (
                <div className="flex justify-center py-8" role="status" aria-label="기록을 불러오는 중">
                  <span className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                </div>
              ) : !isEmpty ? (
                <ol className="flex flex-col gap-3">
                  {entries.map((entry) => (
                    <li key={entry.id}>
                      <HistoryCard entry={entry} />
                    </li>
                  ))}
                </ol>
              ) : null}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
