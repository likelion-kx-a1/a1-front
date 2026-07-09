"use client";

import { useState } from "react";

const libraryProjects = ["프로젝트1", "프로젝트2", "프로젝트3", "프로젝트4"];

export default function LibraryNav() {
  // 처음엔 접혀 있고, 클릭 시 프로젝트 목록 펼침
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-900"
      >
        <span className="size-6 shrink-0 rounded-md bg-gray-400" aria-hidden />
        <span className="flex-1">OO님의 라이브러리</span>
        <span
          className={`text-xs text-gray-500 transition-transform ${
            open ? "rotate-0" : "-rotate-90"
          }`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <ul className="mb-2 flex flex-col">
          {libraryProjects.map((project) => (
            <li key={project}>
              <button className="w-full rounded-lg px-2 py-2 pl-12 text-left text-gray-300 hover:bg-gray-900">
                {project}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
