"use client";

import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  label?: string;
  className?: string;
  children: React.ReactNode;
}

/** 공통 모달*/
export default function Modal({
  open,
  onClose,
  label,
  className = "max-w-md",
  children,
}: ModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    // 바깥 클릭 시 닫힘
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      // onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {/* 내부 클릭은 전파 차단 */}
      <div
        className={twMerge("w-full rounded-2xl border border-gray-700 bg-gray-800", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}