"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import AuthModal from "./AuthModal";

export default function LoginButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // 관리자 계정으로 로그인하면 관리자 페이지로 이동
  const handleLoginSuccess = () => {
    if (useAuthStore.getState().user?.role === "ADMIN") {
      router.push("/admin");
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        로그인
      </Button>
      <AuthModal open={open} onClose={() => setOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}
