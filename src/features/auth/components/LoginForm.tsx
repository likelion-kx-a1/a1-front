"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useLogin } from "@/hooks/useLogin";
import { saveTokens } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";

const socialProviders = ["카카오", "구글", "네이버"];

// 로그인 실패 코드별 안내 메시지 (명세 기준)
const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  LOGIN_ID_NOT_FOUND: "아이디가 일치하지 않습니다.",
  PASSWORD_NOT_MATCH: "비밀번호가 일치하지 않습니다.",
  SIGNUP_PENDING: "관리자 승인 후 이용 가능합니다.",
  SIGNUP_REJECTED: "회원가입 신청이 거절되었습니다.",
  ACCOUNT_INACTIVE: "계정 상태가 비활성화입니다. 활성화를 위해 관리자에게 문의하세요.",
};

interface LoginFormProps {
  /** 회원가입 화면으로 전환 */
  onSwitchToSignup: () => void;
  /** 로그인 성공 시 호출 (모달 닫기 등) */
  onSuccess: () => void;
}

export default function LoginForm({ onSwitchToSignup, onSuccess }: LoginFormProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const setUser = useAuthStore((s) => s.setUser);
  const { mutate: loginMutate, isPending: submitting } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutate(
      { loginId: userId, password },
      {
        onSuccess: (res) => {
          if (res.success) {
            saveTokens(res.data.accessToken, res.data.refreshToken);
            setUser(res.data.user); // 전역 로그인 상태 저장
            onSuccess();
          } else {
            setError(LOGIN_ERROR_MESSAGES[res.code] ?? res.message);
          }
        },
        onError: () => setError("로그인에 실패했습니다. 다시 시도해 주세요."),
      },
    );
  };

  // 아이디·비밀번호 입력 여부만 확인
  const isValid = userId.trim() !== "" && password.trim() !== "";

  return (
    <>
      {/* 로고 자리표시자 */}
      <span className="size-10 rounded-md bg-gray-300" aria-hidden />

      <h2 className="mt-2 text-2xl font-bold text-white">어서오세요</h2>
      <p className="mt-2 text-sm text-gray-400">계정을 액세스 하고 원하는 결과물을 창작하세요</p>

      <form className="mt-4 flex flex-col gap-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          아이디
          <input
            type="text"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setError("");
            }}
            className="focus:border-primary-500 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="focus:border-primary-500 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
        </label>

        {/* 로그인 실패 에러 메시지 */}
        {error && <p className="mt-1 text-sm whitespace-pre-line text-red-500">{error}</p>}

        <Button type="submit" disabled={!isValid || submitting} className="mt-2 w-full">
          {submitting ? "로그인 중…" : "로그인"}
        </Button>
      </form>

      {/* 구분선 */}
      <div className="my-3 flex items-center gap-3 text-xs text-gray-500">
        <span className="h-px flex-1 bg-gray-700" />
        소셜 계정으로 로그인
        <span className="h-px flex-1 bg-gray-700" />
      </div>

      {/* 소셜 로그인 버튼 */}
      <div className="flex justify-center gap-3">
        {socialProviders.map((name) => (
          <button
            key={name}
            type="button"
            aria-label={`${name} 계정으로 로그인`}
            className="flex size-14 items-center justify-center rounded-xl border border-gray-700 bg-gray-900 hover:bg-gray-700"
          >
            <span className="size-7 rounded-full bg-gray-300" aria-hidden />
          </button>
        ))}
      </div>

      {/* 회원가입 전환 */}
      <p className="mt-6 text-center text-sm text-gray-400">
        계정이 없으신가요?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-primary-300 font-medium hover:underline"
        >
          회원가입
        </button>
      </p>
    </>
  );
}
