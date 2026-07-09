"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { logout } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";
import LoginButton from "./LoginButton";

export default function AuthStatus() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);

  // 새로고침 시 localStorage에서 로그인 상태 복원
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  const handleLogout = () => {
    logout(); // 토큰 삭제
    clearUser(); // 전역 상태 초기화
  };

  // 비로그인 → 로그인 버튼(모달)
  if (!user) {
    return <LoginButton />;
  }

  // 로그인 → 사용자 표시 + 로그아웃
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white">{user.name}님</span>
      <Button variant="outline" onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
}