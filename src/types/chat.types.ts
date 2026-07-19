/** 생성 요청/결과 자산 타입 */
export type AssetType = "IMAGE" | "VIDEO";

/** 이미지 카테고리 (assetType이 IMAGE일 때만) */
export type ImageCategory = "CHARACTER" | "BACKGROUND";

/** POST /api/chats, GET /api/chats 응답 항목 */
export interface Chat {
  chatId: number;
  projectId: number | null;
  title: string;
  isGenerating: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  /** 목록 조회 시 제공될 수 있는 미리보기 URL */
  previewUrl?: string | null;
}

/** GET /api/chats 쿼리 */
export interface ChatListParams {
  [key: string]: string | number | boolean | undefined;
  projectId?: number;
  outsideProject?: boolean;
}

/** 채팅 생성 요청 바디 */
export interface ChatPayload {
  projectId: number | null;
  title: string;
}

/** PATCH /api/chats/{chatId} 제목 수정 */
export interface UpdateChatPayload {
  title: string;
}

/** 채팅에 첨부된 파일 */
export interface ChatFile {
  fileId: number;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  url: string;
}

/** 채팅 메시지 */
export interface ChatMessage {
  messageId: number;
  chatId?: number;
  senderType: "USER" | "ASSISTANT";
  messageType: string;
  contentText: string | null;
  assetType: AssetType | null;
  imageCategory: ImageCategory | null;
  files: ChatFile[];
  createdAt: string;
}

/** AI 생성 결과 자산 */
export interface GeneratedAsset {
  assetId: number;
  assetType: AssetType;
  title: string;
  previewUrl: string;
  createdAt: string;
}

/** GET /api/chats/{chatId} 상세 응답 */
export interface ChatDetail {
  chatId: number;
  projectId: number | null;
  title: string;
  isGenerating: boolean;
  messages: ChatMessage[];
  generatedAssets: GeneratedAsset[];
}

/** POST /api/chats/{chatId}/messages 요청 (FormData로 전송) */
export interface SendChatMessagePayload {
  contentText?: string;
  assetType: AssetType;
  imageCategory?: ImageCategory;
  files?: File[];
}
