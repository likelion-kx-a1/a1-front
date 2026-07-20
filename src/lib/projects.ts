/**
 * 프로젝트 관련 API 호출
 *
 * 공통 응답 형식: 성공 { success: true, data }, 실패 { success: false, error: { code, message } }
 */

import type { ApiResponse } from "@/types/api.types";
import type { Project, ProjectPayload } from "@/types/project.types";
import { authClient } from "./http";

/** 프로젝트 생성 — POST /api/projects */
export async function createProject(payload: ProjectPayload): Promise<ApiResponse<Project>> {
  const { data } = await authClient.post<ApiResponse<Project>>("/api/projects", payload);
  return data;
}

/** 프로젝트 목록 조회 — GET /api/projects */
export async function getProjects(): Promise<ApiResponse<Project[]>> {
  const { data } = await authClient.get<ApiResponse<Project[]>>("/api/projects");
  return data;
}

/** 프로젝트 상세 조회 — GET /api/projects/{projectId} */
export async function getProject(projectId: number): Promise<ApiResponse<Project>> {
  const { data } = await authClient.get<ApiResponse<Project>>(`/api/projects/${projectId}`);
  return data;
}

/** 프로젝트 수정 — PATCH /api/projects/{projectId} */
export async function updateProject(
  projectId: number,
  payload: ProjectPayload,
): Promise<ApiResponse<Project>> {
  const { data } = await authClient.patch<ApiResponse<Project>>(
    `/api/projects/${projectId}`,
    payload,
  );
  return data;
}

/** 프로젝트 삭제 — DELETE /api/projects/{projectId} */
export async function deleteProject(projectId: number): Promise<ApiResponse<null>> {
  const { data } = await authClient.delete<ApiResponse<null>>(`/api/projects/${projectId}`);
  return data;
}
