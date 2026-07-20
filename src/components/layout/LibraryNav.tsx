"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import LibraryIcon from "@/components/icons/LibraryIcon";
import IconBadge from "@/components/layout/IconBadge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import AuthModal from "@/features/auth/components/AuthModal";
import ProjectNavSubmenu from "@/features/library/components/ProjectNavSubmenu";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/hooks/useProjects";
import { useAuthStore } from "@/stores/authStore";
import type { Project } from "@/types/project.types";

/** 클릭·더블클릭 구분을 위한 대기 시간(ms) */
const CLICK_DELAY_MS = 250;

const itemStyle =
  "bg-surface flex h-12 w-full items-center justify-between rounded-lg px-4 text-base text-white hover:bg-gray-900";

/** 새 프로젝트 기본 이름 */
const DEFAULT_PROJECT_NAME = "Untitled";

function getProjectIdFromPath(pathname: string): number | null {
  const match = pathname.match(/^\/(?:library|project)\/(\d+)/);
  if (!match) {
    return null;
  }
  const id = Number(match[1]);
  return Number.isNaN(id) ? null : id;
}

export default function LibraryNav() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const projectsQuery = useProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const projects = projectsQuery.data?.success ? projectsQuery.data.data : [];

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeProjectId = getProjectIdFromPath(pathname);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleCreateProject = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setActionError("");
    createMutation.mutate(
      { name: DEFAULT_PROJECT_NAME, description: "" },
      {
        onSuccess: (res) => {
          if (res.success) {
            setExpandedIds((prev) => new Set(prev).add(res.data.projectId));
            router.push(`/library/${res.data.projectId}`);
          } else {
            setActionError(res.error.message);
          }
        },
        onError: () => setActionError("프로젝트 생성에 실패했습니다. 다시 시도해 주세요."),
      },
    );
  };

  const startEditing = (project: Project) => {
    setEditingId(project.projectId);
    setEditingName(project.name);
  };

  const toggleExpanded = (projectId: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  // 클릭 → 펼침/접힘 토글 (더블클릭과 구분)
  const handleProjectClick = (projectId: number) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      toggleExpanded(projectId);
    }, CLICK_DELAY_MS);
  };

  const handleProjectDoubleClick = (project: Project) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    startEditing(project);
  };

  const commitEditing = () => {
    if (editingId === null) {
      return;
    }
    const project = projects.find((p) => p.projectId === editingId);
    setEditingId(null);
    if (!project) {
      return;
    }
    const trimmed = editingName.trim();
    const newName = trimmed || DEFAULT_PROJECT_NAME;
    if (newName === project.name) {
      return;
    }
    setActionError("");
    updateMutation.mutate(
      {
        projectId: project.projectId,
        payload: { name: newName, description: project.description },
      },
      {
        onSuccess: (res) => {
          if (!res.success) {
            setActionError(res.error.message);
          }
        },
        onError: () => setActionError("이름 수정에 실패했습니다. 다시 시도해 주세요."),
      },
    );
  };

  const cancelEditing = () => setEditingId(null);

  const openDeleteModal = (project: Project) => {
    setDeleteTarget(project);
    setDeleteError("");
  };

  const closeDeleteModal = () => setDeleteTarget(null);

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    setDeleteError("");
    deleteMutation.mutate(deleteTarget.projectId, {
      onSuccess: (res) => {
        if (res.success) {
          setDeleteTarget(null);
        } else {
          setDeleteError(res.error.message);
        }
      },
      onError: () => setDeleteError("삭제에 실패했습니다. 다시 시도해 주세요."),
    });
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitEditing();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <nav aria-label="내 라이브러리" className="flex flex-col gap-4">
      <Link
        href="/library"
        className="flex items-center gap-2 px-4 py-3 text-xl text-white hover:text-gray-200"
      >
        <IconBadge icon={LibraryIcon} />내 라이브러리
      </Link>

      <ul className="flex flex-col gap-2 pl-10" aria-label="프로젝트 목록">
        {projects.map((project) => {
          if (editingId === project.projectId) {
            return (
              <li key={project.projectId}>
                <label className="sr-only" htmlFor={`project-name-${project.projectId}`}>
                  프로젝트 이름 수정
                </label>
                <input
                  id={`project-name-${project.projectId}`}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={commitEditing}
                  onKeyDown={handleEditKeyDown}
                  autoFocus
                  className={`${itemStyle} border-primary-500 border`}
                />
              </li>
            );
          }

          const isExpanded = expandedIds.has(project.projectId);
          const isActive = activeProjectId === project.projectId;

          return (
            <li key={project.projectId} className="group">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => handleProjectClick(project.projectId)}
                  onDoubleClick={() => handleProjectDoubleClick(project)}
                  aria-expanded={isExpanded}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`${project.name} (클릭하여 펼치기 또는 접기, 더블클릭하여 이름 수정)`}
                  className={`${itemStyle} gap-2 pr-10 ${isActive ? "ring-1 ring-gray-600" : ""}`}
                >
                  <span className="min-w-0 flex-1 truncate text-left">{project.name}</span>
                  <span
                    aria-hidden
                    className={`shrink-0 text-base text-gray-400 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  >
                    ▸
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => openDeleteModal(project)}
                  aria-label={`${project.name} 삭제`}
                  className="absolute top-1/2 right-2 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 group-hover:flex hover:text-white"
                >
                  <CloseIcon className="size-4" aria-hidden />
                </button>
              </div>

              {isExpanded && <ProjectNavSubmenu projectId={project.projectId} />}
            </li>
          );
        })}

        <li>
          <button
            type="button"
            onClick={handleCreateProject}
            disabled={createMutation.isPending}
            aria-label="새 프로젝트 추가"
            className={`${itemStyle} text-[#999] disabled:opacity-50`}
          >
            <span>새 프로젝트</span>
            <span className="text-base text-gray-500" aria-hidden>
              +
            </span>
          </button>
        </li>

        {actionError && (
          <li>
            <p role="alert" className="px-4 text-xs text-red-500">
              {actionError}
            </p>
          </li>
        )}
      </ul>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <Modal open={!!deleteTarget} onClose={closeDeleteModal} label="프로젝트 삭제">
        <div className="flex flex-col gap-6 p-6">
          <h2 className="text-xl font-semibold text-white">프로젝트 삭제</h2>
          <p className="text-muted">
            <span className="text-white">{deleteTarget?.name}</span> 프로젝트를 삭제할까요? 안의
            채팅 내역도 함께 삭제되며, 되돌릴 수 없습니다.
          </p>
          {deleteError && (
            <p role="alert" className="text-sm text-red-500">
              {deleteError}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteModal}
              className="h-12 flex-1"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="h-12 flex-1 bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "삭제 중…" : "삭제하기"}
            </Button>
          </div>
        </div>
      </Modal>
    </nav>
  );
}
