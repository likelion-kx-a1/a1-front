"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPasswordForm";
import SignupForm from "./SignupForm";
import SignupPendingStatus from "./SignupPendingStatus";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "signup" | "pending" | "resetPassword";

const MODAL_LABEL: Record<AuthMode, string> = {
  login: "로그인",
  signup: "회원가입",
  pending: "가입 승인 대기",
  resetPassword: "비밀번호 재설정",
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
        mode === "signup"
          ? "modal-scroll max-h-[90vh] max-w-[1200px] overflow-y-auto"
          : "modal-scroll max-h-[90vh] max-w-[1200px] overflow-hidden"
      }
    >
      {mode === "pending" ? (
        <SignupPendingStatus appliedAt={appliedAt} />
      ) : mode === "login" ? (
        <LoginForm
          onSwitchToSignup={() => setMode("signup")}
          onSwitchToResetPassword={() => setMode("resetPassword")}
          onSuccess={handleClose}
        />
      ) : mode === "resetPassword" ? (
        <ResetPasswordForm onSwitchToLogin={() => setMode("login")} onClose={handleClose} />
      ) : (
        <SignupForm
          onSwitchToLogin={() => setMode("login")}
          onSubmitted={handleSignupSubmitted}
        />
      )}
    </Modal>
  );
}
