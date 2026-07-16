"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import CaretIcon from "@/components/icons/CaretIcon";

export interface DropdownOption {
  label: string;
  icon?: ReactNode;
  /** 목록에서 라벨 옆 설명 텍스트 (예: "1:1" 옆의 "정사각형") */
  description?: string;
}

interface OptionDropdownProps {
  options: string[] | DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  /** 목록이 트리거 위/아래 중 어디로 펼쳐질지 (하단 생성 바에서는 "up") */
  direction?: "up" | "down";
  /** 트리거 버튼 색상: 회색 / 강조용 보라 / 배경 없는 투명 */
  variant?: "gray" | "primary" | "ghost";
  /** 트리거 버튼 크기 (기본 sm / 강조용 lg) */
  size?: "sm" | "lg";
  /** 트리거에 펼침 화살표를 보일지 (기본 true) */
  chevron?: boolean;
  /** 펼친 목록에서도 아이콘을 보일지 (기본 true) */
  listIcon?: boolean;
  className?: string;
}

const TRIGGER_VARIANT = {
  gray: "bg-gray-800 text-gray-200 hover:bg-gray-700",
  primary: "bg-primary-500 text-white hover:bg-primary-600",
  ghost: "text-white hover:bg-white/10",
};

const TRIGGER_SIZE = {
  sm: "px-3 py-2 text-sm",
  lg: "px-4 py-2 text-xl font-medium",
};

const TRIGGER_INNER = {
  sm: "gap-2",
  lg: "gap-2 p-2",
};

const ICON_SIZE = {
  sm: "size-6 bg-gray-400",
  lg: "size-8 bg-[#6b6b6b]",
};

const CHEVRON_SIZE = {
  sm: "size-4",
  lg: "size-6",
};

const LIST_VARIANT = {
  gray: "border border-gray-700 bg-gray-800 py-1",
  primary: "flex flex-col gap-2 bg-primary-500 px-4 py-2",
  ghost: "border border-gray-700 bg-gray-800 py-1",
};

const ITEM_SIZE = {
  sm: "gap-2 px-3 py-2 text-sm",
  lg: "gap-2 rounded-lg p-2 text-xl font-medium",
};

function normalize(options: string[] | DropdownOption[]): DropdownOption[] {
  return options.map((option) => (typeof option === "string" ? { label: option } : option));
}

/** 버튼 클릭 → 세로 목록 펼침 → 선택 시 닫힘, 단일 선택 드롭다운 */
export default function OptionDropdown({
  options,
  value,
  onChange,
  direction = "up",
  variant = "gray",
  size = "sm",
  chevron = true,
  listIcon = true,
  className = "",
}: OptionDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const normalized = normalize(options);
  const selected = normalized.find((option) => option.label === value);

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

  const chevronPointsDown = direction === "down" ? !open : open;

  return (
    <div className={twMerge("relative inline-block", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={twMerge(
          "flex w-full items-center justify-between rounded-lg",
          TRIGGER_SIZE[size],
          TRIGGER_VARIANT[variant],
        )}
      >
        <span className={twMerge("flex items-center", TRIGGER_INNER[size])}>
          {selected?.icon ?? <span className={twMerge("shrink-0", ICON_SIZE[size])} aria-hidden />}
          {value}
        </span>
        {chevron && (
          <CaretIcon
            aria-hidden
            className={twMerge(
              "shrink-0 transition-transform",
              CHEVRON_SIZE[size],
              chevronPointsDown && "rotate-180",
            )}
          />
        )}
      </button>

      {open && (
        <ul
          role="listbox"
          className={twMerge(
            "modal-scroll absolute left-0 z-10 max-h-64 w-max min-w-full overflow-y-auto rounded-lg shadow-lg",
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2",
            LIST_VARIANT[variant],
          )}
        >
          {normalized.map((option) => (
            <li key={option.label}>
              <button
                type="button"
                role="option"
                aria-selected={option.label === value}
                onClick={() => {
                  onChange(option.label);
                  setOpen(false);
                }}
                className={twMerge(
                  "flex w-full items-center whitespace-nowrap text-left",
                  ITEM_SIZE[size],
                  variant === "primary"
                    ? "text-white hover:bg-white/10"
                    : twMerge(
                        "hover:bg-gray-900",
                        option.label === value ? "text-primary-300" : "text-gray-200",
                      ),
                )}
              >
                <span className="flex items-center gap-2">
                  {listIcon &&
                    (option.icon ?? (
                      <span className={twMerge("shrink-0", ICON_SIZE[size])} aria-hidden />
                    ))}
                  {option.label}
                </span>
                {option.description && (
                  <span className="ml-auto pl-4 text-sm text-gray-400">{option.description}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
