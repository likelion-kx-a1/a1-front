"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "signup";

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  // 닫을 때 로그인 모드로 초기화
  const handleClose = () => {
    setMode("login");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      label={mode === "login" ? "로그인" : "회원가입"}
      className="modal-scroll max-h-[90vh] max-w-4xl overflow-y-auto"
    >
      <div className="grid gap-23 p-6 md:grid-cols-2">
        {/* 왼쪽 비주얼 패널 (모바일에선 숨김) */}
        <div className="bg-primary-500 hidden min-h-[440px] rounded-2xl md:block" />

        {/* 오른쪽 폼 (로그인 / 회원가입 전환) */}
        <div className="flex flex-col justify-center py-10 md:pr-15">
          {mode === "login" ? (
            <LoginForm onSwitchToSignup={() => setMode("signup")} />
          ) : (
            <SignupForm onSwitchToLogin={() => setMode("login")} />
          )}
        </div>
      </div>
    </Modal>
  );
}
