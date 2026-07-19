"use client";

import Link from "next/link";
import { useState } from "react";
import LibraryIcon from "@/components/icons/LibraryIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import IconBadge from "@/components/layout/IconBadge";
import AuthModal from "@/features/auth/components/AuthModal";
import { useCreateProject, useProjects } from "@/hooks/useProjects";
import { useAuthStore } from "@/stores/authStore";

const DEFAULT_PROJECT_NAME = "Untitled";

/** 내 라이브러리 홈 — 프로젝트 목록 */
export default function LibraryHomeView() {
  const user = useAuthStore((s) => s.user);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const projectsQuery = useProjects();
  const createMutation = useCreateProject();

  const projects = projectsQuery.data?.success ? projectsQuery.data.data : [];

  const handleCreateProject = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    createMutation.mutate({ name: DEFAULT_PROJECT_NAME, description: "" });
  };

  if (!user) {
    return (
      <div className="flex flex-col gap-6 py-10">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
          <IconBadge icon={LibraryIcon} />
          내 라이브러리
        </h1>
        <p className="text-gray-400">로그인하면 프로젝트와 저장된 생성물을 볼 수 있습니다.</p>
        <button
          type="button"
          onClick={() => setAuthModalOpen(true)}
          className="bg-primary-500 h-12 w-fit rounded-lg px-6 text-white"
        >
          로그인
        </button>
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
        <IconBadge icon={LibraryIcon} />
        내 라이브러리
      </h1>

      <ul aria-busy={projectsQuery.isLoading} className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        <li>
          <button
            type="button"
            onClick={handleCreateProject}
            disabled={createMutation.isPending}
            aria-label="새 프로젝트 추가"
            className="flex h-[160px] w-full flex-col items-center justify-center gap-2 rounded-lg bg-[#626262] p-4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusIcon className="size-8 text-[#999]" aria-hidden />
            <span className="text-xl text-[#999]">프로젝트 추가</span>
          </button>
        </li>
        {projects.map((project) => (
          <li key={project.projectId}>
            <Link
              href={`/library/${project.projectId}`}
              className="bg-surface flex h-[160px] flex-col justify-end rounded-2xl p-6 hover:bg-gray-900"
            >
              <span className="truncate text-xl text-white">{project.name}</span>
              <span className="text-sm text-gray-500">저장된 생성물 보기</span>
            </Link>
          </li>
        ))}
      </ul>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
