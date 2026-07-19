/** GenerationJob.jobType 값 */
export type GenerationType =
  | "IMAGE_GENERATION"
  | "VIDEO_GENERATION"
  | "REVERSE_PROMPT"
  | "IMAGE_VARIATION"
  | "PROMPT_REGENERATION";

/** GenerationJob.status 값 */
export type GenerationStatus =
  | "PENDING"
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELED"
  | "EXPIRED";

/** 4개 생성 API가 공통으로 반환하는 작업 상태 객체 */
export interface GenerationJob {
  id: number;
  userId: number;
  chatId: number;
  aiModelId: number | null;
  requestMessageId: number | null;
  jobType: GenerationType;
  prompt: string | null;
  responsePayload: Record<string, unknown> | null;
  status: GenerationStatus;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
}

/** POST /api/v1/generation/prompts, /reverse-prompts 공통 요청 바디 */
export interface ClaudeVisionPayload {
  userId: number;
  chatId: number;
  imageBase64: string;
  mimeType: string;
  instruction: string;
}

/** POST /api/v1/generation/fal-jobs 요청 바디 */
export interface FalJobPayload {
  userId: number;
  chatId: number;
  jobType: GenerationType;
  modelCode: string;
  input: Record<string, unknown>;
}
