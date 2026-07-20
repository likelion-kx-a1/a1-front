"use client";

import { use } from "react";
import ProjectWorkspaceTabs from "@/features/library/components/ProjectWorkspaceTabs";
import { useProject } from "@/hooks/useProjects";

interface ProjectLibraryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

/** 프로젝트 보관함/채팅 공통 레이아웃 */
export default function ProjectLibraryLayout({ children, params }: ProjectLibraryLayoutProps) {
  const { projectId: projectIdParam } = use(params);
  const projectId = Number(projectIdParam);
  const projectQuery = useProject(projectId);

  const projectName =
    projectQuery.data?.success ? projectQuery.data.data.name : `프로젝트 ${projectId}`;

  return (
    <div className="flex flex-col gap-8 py-10">
      <header className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-white">{projectName}</h1>
        <ProjectWorkspaceTabs projectId={projectId} />
      </header>
      <main>{children}</main>
    </div>
  );
}
