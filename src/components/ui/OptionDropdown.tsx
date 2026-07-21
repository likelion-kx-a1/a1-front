"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import CaretIcon from "@/components/icons/CaretIcon";

export interface DropdownOption {
  label: string;
  icon?: ReactNode;
  /** 목록에서 라벨 옆 설명 텍스트 (예: "1:1" 옆의 "정방형") */
  description?: string;
}

interface OptionDropdownProps {
  options: string[] | DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  /** 목록이 트리거 위/아래 중 어디로 펼쳐질지 (하단 생성 바에서는 "up") */
  direction?: "up" | "down";
  /** 트리거 버튼 색상: 회색 / 어두운 카드+보라 글로우 / 어두운 카드 / 배경 없는 투명 */
  variant?: "gray" | "glass" | "card" | "ghost";
  /** 트리거 버튼 크기 (기본 sm / 생성 바 md / 강조용 lg) */
  size?: "sm" | "md" | "lg";
  /** 트리거에 펼침 화살표를 보일지 (기본 true) */
  chevron?: boolean;
  /** 펼친 목록에서도 아이콘을 보일지 (기본 true) */
  listIcon?: boolean;
  /** 트리거 버튼에 표시할 고정 라벨 (없으면 value 표시) */
  triggerLabel?: string;
  className?: string;
}

const TRIGGER_VARIANT = {
  gray: "bg-gray-800 text-gray-200 hover:bg-gray-700",
  glass:
    "border border-[#5f6a85]/60 bg-gradient-to-b from-[rgba(28,31,42,0.8)] to-[rgba(17,17,25,0.8)] to-64% text-white",
  card: "justify-center bg-[#1c1f2a] text-white hover:bg-[#252939]",
  ghost: "text-white hover:bg-white/10",
};

/** 트리거 화살표 색 — card는 본문 흰색보다 연한 회청색 */
const CHEVRON_VARIANT = {
  gray: "",
  glass: "",
  card: "text-[#bfc7d6]",
  ghost: "",
};

/** 트리거 라벨 — card는 값이 바뀌어도 화살표가 밀리지 않게 폭 고정 */
const TRIGGER_LABEL = {
  gray: "",
  glass: "",
  card: "w-10 text-center",
  ghost: "",
};


const GLASS_GLOW_SHAPES = {
  /** 트리거용*/
  sm: {
    viewBox: "0 0 320 120",
    box: "bottom-[-50px] h-[120px]",
    domes: [
      "M160 40C93.73 40 40 57.91 40 80H280C280 57.91 226.28 40 160 40Z",
      "M160 46.7C93.73 46.7 40 61.61 40 80H280C280 61.61 226.28 46.7 160 46.7Z",
      "M160 57.34C93.73 57.34 40 67.49 40 80H280C280 67.49 226.28 57.34 160 57.34Z",
    ],
  },
  /** 펼친 목록용*/
  lg: {
    viewBox: "0 0 320 160",
    box: "bottom-[-59px] h-[160px]",
    domes: [
      "M160 40C93.73 40 40 75.82 40 120H280C280 75.82 226.28 40 160 40Z",
      "M160 53.4C93.73 53.4 40 83.22 40 120H280C280 83.22 226.28 53.4 160 53.4Z",
      "M160 74.68C93.73 74.68 40 94.97 40 120H280C280 94.97 226.28 74.68 160 74.68Z",
    ],
  },
};

const GLASS_GLOW_FILLS = [
  "var(--color-primary-900)",
  "var(--color-primary-600)",
  "var(--color-primary-400)",
];

function GlassGlow({ size }: { size: "sm" | "lg" }) {
  const { viewBox, box, domes } = GLASS_GLOW_SHAPES[size];
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={twMerge("pointer-events-none absolute left-[-23%] w-[146%] blur-[20px]", box)}
    >
      {domes.map((d, i) => (
        <path key={d} d={d} fill={GLASS_GLOW_FILLS[i]} className={i === 0 ? "blur-[20px]" : ""} />
      ))}
    </svg>
  );
}

const TRIGGER_SIZE = {
  sm: "px-3 py-2 text-sm",
  md: "h-12 px-4 py-3 text-base",
  lg: "px-4 py-3 text-xl font-medium",
};

const TRIGGER_INNER = {
  sm: "gap-2",
  md: "gap-2",
  lg: "gap-2 p-2",
};

const ICON_SIZE = {
  sm: "size-6 bg-gray-400",
  md: "size-6 bg-gray-400",
  lg: "size-8 bg-[#6b6b6b]",
};

/** 펼친 목록 바깥 상자 — 배경·테두리·여백 */
const LIST_VARIANT = {
  gray: "border border-gray-700 bg-gray-800 py-1",
  glass:
    "border border-[#5f6a85]/60 bg-gradient-to-b from-[rgba(28,31,42,0.8)] to-[rgba(17,17,25,0.8)] to-64% px-4 py-3",
  card: "border border-[#394257] bg-[#1c1f2a] p-2",
  ghost: "border border-gray-700 bg-gray-800 py-1",
};

/** 펼친 목록 안쪽 ul — 항목 배치 */
const LIST_INNER = {
  gray: "",
  glass: "flex flex-col gap-2",
  card: "flex flex-col gap-2",
  ghost: "",
};

/** 목록 항목의 라벨 — card는 트리거와 같은 고정 폭 */
const ITEM_LABEL = {
  gray: "",
  glass: "",
  card: "w-10 text-center",
  ghost: "",
};

/** 목록 항목의 설명 — card는 라벨 옆에 고정 폭으로 붙고, 나머지는 오른쪽 끝으로 민다 */
const ITEM_DESC = {
  gray: "ml-auto pl-4 text-sm text-gray-400",
  glass: "ml-auto pl-4 text-sm text-gray-400",
  card: "w-[60px] text-left text-base text-[#bfc7d6]",
  ghost: "ml-auto pl-4 text-sm text-gray-400",
};

const CHEVRON_SIZE = {
  sm: "size-4",
  md: "size-6",
  lg: "size-6",
};

const ITEM_SIZE = {
  sm: "gap-2 px-3 py-2 text-sm",
  md: "h-12 gap-2 rounded-lg px-4 py-3 text-base",
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
  triggerLabel,
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
        aria-label={triggerLabel ? `${triggerLabel}: ${value}` : undefined}
        className={twMerge(
          "relative flex w-full items-center justify-between overflow-hidden rounded-lg",
          TRIGGER_SIZE[size],
          TRIGGER_VARIANT[variant],
        )}
      >
        {variant === "glass" && <GlassGlow size="sm" />}
        <span className={twMerge("relative flex items-center", TRIGGER_INNER[size])}>
          {!triggerLabel &&
            (selected?.icon ?? <span className={twMerge("shrink-0", ICON_SIZE[size])} aria-hidden />)}
          <span className={TRIGGER_LABEL[variant]}>{triggerLabel ?? value}</span>
        </span>
        {chevron && (
          <CaretIcon
            aria-hidden
            className={twMerge(
              "relative shrink-0 transition-transform",
              CHEVRON_SIZE[size],
              CHEVRON_VARIANT[variant],
              chevronPointsDown && "rotate-180",
            )}
          />
        )}
      </button>

      {open && (
        <div
          className={twMerge(
            "absolute left-0 z-10 w-max min-w-full overflow-hidden rounded-lg shadow-lg",
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2",
            LIST_VARIANT[variant],
          )}
        >
          {variant === "glass" && <GlassGlow size="lg" />}
          <ul
            role="listbox"
            className={twMerge("modal-scroll relative max-h-64 overflow-y-auto", LIST_INNER[variant])}
          >
            {normalized.map((option) => (
              <li key={option.label} role="presentation">
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
                    variant === "glass"
                      ? "text-white hover:bg-white/10"
                      : variant === "card"
                        ? "justify-center text-white hover:bg-white/10"
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
                    <span className={ITEM_LABEL[variant]}>{option.label}</span>
                  </span>
                  {option.description && (
                    <span className={ITEM_DESC[variant]}>{option.description}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
