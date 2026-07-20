/** GET /api/projects, POST /api/projects 등의 응답 항목 */
export interface Project {
  projectId: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** 프로젝트 생성/수정 요청 바디 */
export interface ProjectPayload {
  name: string;
  description: string;
}
