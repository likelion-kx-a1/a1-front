/** 생성 기록 항목 종류 */
export type GenerationKind = "IMAGE" | "VIDEO" | "REVERSE_PROMPT";

/** 사이드바 생성 기록 항목 */
export interface GenerationHistoryEntry {
  id: string;
  kind: GenerationKind;
  prompt: string;
  previewUrl: string | null;
  createdAt: string;
  chatId?: number;
  assetId?: number;
  status: "completed" | "generating";
}

/** 역프롬프트 로컬 저장 항목 */
export interface ReversePromptHistoryRecord {
  id: string;
  prompt: string;
  previewUrl: string | null;
  createdAt: string;
}
