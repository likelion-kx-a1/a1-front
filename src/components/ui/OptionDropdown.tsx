"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface OptionDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  /** 목록이 트리거 위/아래 중 어디로 펼쳐질지 (하단 생성 바에서는 "up") */
  direction?: "up" | "down";
  className?: string;
}

/** 버튼 클릭 → 세로 목록 펼침 → 선택 시 닫힘, 단일 선택 드롭다운 */
export default function OptionDropdown({
  options,
  value,
  onChange,
  direction = "up",
  className = "",
}: OptionDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={twMerge("relative inline-block", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
      >
        <span className="size-4 shrink-0 rounded bg-gray-400" aria-hidden />
        {value}
      </button>

      {open && (
        <ul
          role="listbox"
          className={`modal-scroll absolute left-0 z-10 max-h-64 w-44 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-lg ${
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-900 ${
                  option === value ? "text-primary-300" : "text-gray-200"
                }`}
              >
                <span className="size-4 shrink-0 rounded bg-gray-400" aria-hidden />
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
