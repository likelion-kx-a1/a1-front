"use client";

import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** 접근성 라벨 (모달 제목) */
  label?: string;
  /** 모달 본문 너비/여백 (기본: max-w-md) */
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
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {/* 내부 클릭은 전파 차단 */}
      <div
        className={`w-full rounded-2xl border border-gray-700 bg-gray-800 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
