"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SignupPendingStatus from "./SignupPendingStatus";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "signup" | "pending";

const MODAL_LABEL: Record<AuthMode, string> = {
  login: "로그인",
  signup: "회원가입",
  pending: "가입 승인 대기",
};

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [appliedAt, setAppliedAt] = useState("");

  // 닫을 때 로그인 모드로 초기화
  const handleClose = () => {
    setMode("login");
    onClose();
  };

  // 회원가입 신청 완료 → 승인 대기 화면으로 전환
  const handleSignupSubmitted = (submittedAt: string) => {
    setAppliedAt(submittedAt);
    setMode("pending");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      label={MODAL_LABEL[mode]}
      className={
        mode === "pending"
          ? "modal-scroll max-h-[90vh] max-w-lg overflow-y-auto"
          : "modal-scroll max-h-[90vh] max-w-4xl overflow-y-auto"
      }
    >
      {mode === "pending" ? (
        <SignupPendingStatus appliedAt={appliedAt} />
      ) : (
        <div className="grid gap-23 p-6 md:grid-cols-2">
          {/* 왼쪽 비주얼 패널 (모바일에선 숨김) */}
          <div className="bg-primary-500 hidden min-h-[440px] rounded-2xl md:block" />

          {/* 오른쪽 폼 (로그인 / 회원가입 전환) */}
          <div className="flex flex-col justify-center py-10 md:pr-15">
            {mode === "login" ? (
              <LoginForm
                onSwitchToSignup={() => setMode("signup")}
                onSuccess={handleClose}
              />
            ) : (
              <SignupForm
                onSwitchToLogin={() => setMode("login")}
                onSubmitted={handleSignupSubmitted}
              />
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
