"use client";

import { useEffect, useRef, useState } from "react";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { logout } from "@/lib/auth";
import { refreshAccessToken } from "@/lib/http";
import { useAuthStore } from "@/stores/authStore";
import LoginButton from "./LoginButton";

export default function AuthStatus() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 새로고침 시 user는 localStorage에서, accessToken은 refreshToken으로 재발급받아 복원
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    refreshAccessToken();
  }, []);

  // 메뉴 바깥 클릭 시 닫기
  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    logout(); // 토큰 삭제
    clearUser(); // 전역 상태 초기화
    setMenuOpen(false);
  };

  // 비로그인 → 로그인 버튼(모달)
  if (!user) {
    return <LoginButton />;
  }

  // 로그인 → 알림 + 프로필 메뉴(클릭 시 로그아웃 표시)
  return (
    <div className="flex items-center gap-3">
      {/* 알림 (로그인 상태에서만 렌더되는 이 컴포넌트 안에 있으므로 비로그인 사용자에겐 노출되지 않음) */}
      <NotificationBell />

      {/* 프로필 메뉴 */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-gray-900"
        >
          <span className="size-8 shrink-0 rounded-full bg-gray-300" aria-hidden />
          <span className="text-sm text-white">{user.name}님</span>
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute top-full right-0 mt-2 w-36 rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-900"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
