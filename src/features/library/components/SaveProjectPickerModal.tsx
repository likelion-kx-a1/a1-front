"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useProjects } from "@/hooks/useProjects";

interface SaveProjectPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (projectId: number) => void;
  pending?: boolean;
}

/** 프로젝트 없이 생성한 경우 저장할 프로젝트 선택 */
export default function SaveProjectPickerModal({
  open,
  onClose,
  onSelect,
  pending = false,
}: SaveProjectPickerModalProps) {
  const projectsQuery = useProjects();
  const projects = projectsQuery.data?.success ? projectsQuery.data.data : [];

  return (
    <Modal open={open} onClose={onClose} label="저장할 프로젝트 선택" className="max-w-md">
      <div className="flex flex-col gap-4 p-6">
        <h2 className="text-xl font-semibold text-white">어느 프로젝트에 저장할까요?</h2>
        <p className="text-sm text-gray-400">선택한 프로젝트의 라이브러리에 생성물이 저장됩니다.</p>

        {projectsQuery.isLoading ? (
          <p className="text-sm text-gray-400">프로젝트 불러오는 중…</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-gray-400">사이드바에서 새 프로젝트를 만든 뒤 다시 시도해 주세요.</p>
        ) : (
          <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
            {projects.map((project) => (
              <li key={project.projectId}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onSelect(project.projectId)}
                  className="bg-surface flex h-12 w-full items-center rounded-lg px-4 text-left text-base text-white hover:bg-gray-900 disabled:opacity-50"
                >
                  <span className="truncate">{project.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <Button type="button" variant="outline" onClick={onClose} className="h-12 w-full">
          취소
        </Button>
      </div>
    </Modal>
  );
}
