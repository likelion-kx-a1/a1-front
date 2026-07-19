/** POST /api/chats 응답 항목 */
export interface Chat {
  chatId: number;
  projectId: number | null;
  title: string;
  isGenerating: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** 채팅 생성 요청 바디 */
export interface ChatPayload {
  projectId: number | null;
  title: string;
}
