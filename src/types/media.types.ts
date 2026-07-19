/** 저장된 미디어 타입 */
export type SavedMediaType = "IMAGE" | "VIDEO";

/** POST /api/media/{mediaId}/save 요청 바디 */
export interface SaveMediaPayload {
  projectId: number;
  folderId?: number;
  displayName: string;
}

/** POST /api/media/{mediaId}/save 응답 data */
export interface SavedMediaResult {
  savedMediaId: number;
  mediaId: number;
  displayName: string;
}

/** GET /api/my/media 응답 항목 */
export interface SavedMedia {
  savedMediaId: number;
  mediaId: number;
  displayName: string;
  mediaType: SavedMediaType;
  previewUrl: string;
  projectId: number;
  folderId: number | null;
  createdAt: string;
}

/** GET /api/my/media 쿼리 */
export interface MyMediaParams {
  [key: string]: string | number | boolean | undefined;
  projectId?: number;
  folderId?: number;
  mediaType?: SavedMediaType;
}
