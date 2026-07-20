import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "@/lib/projects";
import { useAuthStore } from "@/stores/authStore";
import type { ProjectPayload } from "@/types/project.types";

/** 로그인 상태에서만 조회하는 내 프로젝트 목록 */
export function useProjects() {
  const isLoggedIn = useAuthStore((s) => !!s.user);
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: isLoggedIn,
  });
}

/** 프로젝트 상세 조회 */
export function useProject(projectId?: number | null) {
  const isLoggedIn = useAuthStore((s) => !!s.user);
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProject(projectId!),
    enabled: isLoggedIn && typeof projectId === "number" && !Number.isNaN(projectId),
  });
}

/** 프로젝트 생성 */
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProjectPayload) => createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

/** 프로젝트 수정(이름/설명) */
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: number; payload: ProjectPayload }) =>
      updateProject(projectId, payload),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
}

/** 프로젝트 삭제 */
export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
