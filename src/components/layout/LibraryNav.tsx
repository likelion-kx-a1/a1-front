"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import LibraryIcon from "@/components/icons/LibraryIcon";
import IconBadge from "@/components/layout/IconBadge";

interface Project {
  id: string;
  name: string;
}

const itemStyle =
  "bg-surface flex h-12 w-full items-center justify-between rounded-lg px-4 text-base text-white hover:bg-gray-900";

/** 새 프로젝트 기본 이름 */
const DEFAULT_PROJECT_NAME = "Untitled";

export default function LibraryNav() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // "새 프로젝트" 클릭 → 기본 이름(Untitled)으로 새 프로젝트 생성
  const handleCreateProject = () => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `project-${Date.now()}`;
    setProjects((prev) => [...prev, { id, name: DEFAULT_PROJECT_NAME }]);
  };

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditingName(project.name);
  };

  // 이름 수정 확정 — 빈 문자열이면 기본 이름으로 되돌림
  const commitEditing = () => {
    if (editingId === null) {
      return;
    }
    const trimmed = editingName.trim();
    setProjects((prev) =>
      prev.map((project) =>
        project.id === editingId
          ? { ...project, name: trimmed || DEFAULT_PROJECT_NAME }
          : project,
      ),
    );
    setEditingId(null);
  };

  const cancelEditing = () => setEditingId(null);

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitEditing();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <nav aria-label="내 라이브러리" className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 px-4 py-3 text-xl text-white">
        <IconBadge icon={LibraryIcon} />
        내 라이브러리
      </h3>

      <ul className="flex flex-col gap-2 pl-10">
        {projects.map((project) =>
          editingId === project.id ? (
            <li key={project.id}>
              <label className="sr-only" htmlFor={`project-name-${project.id}`}>
                프로젝트 이름 수정
              </label>
              <input
                id={`project-name-${project.id}`}
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={commitEditing}
                onKeyDown={handleEditKeyDown}
                autoFocus
                className={`${itemStyle} border-primary-500 border`}
              />
            </li>
          ) : (
            <li key={project.id}>
              <button
                type="button"
                onDoubleClick={() => startEditing(project)}
                aria-label={`${project.name} (더블클릭하여 이름 수정)`}
                className={itemStyle}
              >
                <span>{project.name}</span>
                <span className="text-xs text-gray-500" aria-hidden>
                  ▸
                </span>
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            onClick={handleCreateProject}
            aria-label="새 프로젝트 추가"
            className={`${itemStyle} text-[#999]`}
          >
            <span>새 프로젝트</span>
            <span className="text-base text-gray-500" aria-hidden>
              +
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
