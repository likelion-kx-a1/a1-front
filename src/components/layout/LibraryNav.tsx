"use client";

import { useState } from "react";

export default function LibraryNav() {
  // 클릭 시 프로젝트 목록 펼침
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
          className={`text-xs text-gray-500 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <ul className="mb-2 flex flex-col">
          {/* 프로젝트 만들기 (생성 액션) */}
          <li>
            <button className="flex w-full items-center justify-between rounded-lg py-2 pr-3 pl-12 text-left text-gray-500 hover:bg-gray-900">
              프로젝트 만들기(생성)
              <span className="text-xs" aria-hidden>
                ▶
              </span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
