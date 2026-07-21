import type {
  GenerationHistoryEntry,
  ReversePromptHistoryRecord,
} from "@/types/generationHistory.types";

const STORAGE_PREFIX = "a1-reverse-prompt-history";

export function getHistoryScopeKey(projectId?: number | null): string {
  return projectId !== null && projectId !== undefined && !Number.isNaN(projectId)
    ? `project-${projectId}`
    : "outside-project";
}

function getStorageKey(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`;
}

/** 역프롬프트 로컬 기록 조회 */
export function readReversePromptHistory(scope: string): ReversePromptHistoryRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(scope));
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as ReversePromptHistoryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 역프롬프트 로컬 기록 추가 */
export function appendReversePromptHistory(
  scope: string,
  record: ReversePromptHistoryRecord,
): ReversePromptHistoryRecord[] {
  const next = [record, ...readReversePromptHistory(scope)].slice(0, 50);
  window.localStorage.setItem(getStorageKey(scope), JSON.stringify(next));
  return next;
}

/** 역프롬프트 로컬 기록을 사이드바 항목으로 변환 */
export function mapReversePromptRecords(
  records: ReversePromptHistoryRecord[],
): GenerationHistoryEntry[] {
  return records.map((record) => ({
    id: `reverse-${record.id}`,
    kind: "REVERSE_PROMPT",
    prompt: record.prompt,
    previewUrl: record.previewUrl,
    createdAt: record.createdAt,
    status: "completed",
  }));
}
