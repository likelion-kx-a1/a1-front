"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/Button";
import { useLogin } from "@/hooks/useLogin";
import { saveRefreshToken } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";

// 로그인 실패 코드별 안내 메시지
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
  /** 비밀번호 재설정 화면으로 전환 */
  onSwitchToResetPassword: () => void;
  /** 로그인 성공 시 호출*/
  onSuccess: () => void;
}

export default function LoginForm({
  onSwitchToSignup,
  onSwitchToResetPassword,
  onSuccess,
}: LoginFormProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const headingId = useId();
  const userIdInputId = useId();
  const passwordInputId = useId();

  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const { mutate: loginMutate, isPending: submitting } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutate(
      { loginId: userId, password },
      {
        onSuccess: (res) => {
          if (res.success) {
            saveRefreshToken(res.data.refreshToken);
            setAccessToken(res.data.accessToken); // 메모리에만 저장
            setUser(res.data.user); // 전역 로그인 상태 저장
            onSuccess();
          } else {
            setError(LOGIN_ERROR_MESSAGES[res.error.code] ?? res.error.message);
          }
        },
        onError: () => setError("로그인에 실패했습니다. 다시 시도해 주세요."),
      },
    );
  };

  // 아이디·비밀번호 입력 여부만 확인
  const isValid = userId.trim() !== "" && password.trim() !== "";

  return (
    <section
      aria-labelledby={headingId}
      className="grid overflow-hidden rounded-2xl md:grid-cols-2"
    >
      {/* 왼쪽 비주얼 패널 (모바일에선 숨김) */}
      <div aria-hidden className="bg-card relative hidden min-h-[480px] overflow-hidden md:block">
        <div className="absolute top-[41.667%] left-[-33.333%] h-[57.971%] w-[166.667%]">
          <div className="absolute inset-[-50%_-24%]">
            <img src="/images/auth/gradient-purple.svg" alt="" className="block size-full max-w-none" />
          </div>
        </div>
        <div className="absolute top-[-7.269%] left-[17%] h-[24.155%] w-[66.667%] rotate-180">
          <div className="absolute inset-[-120%_-60%]">
            <img src="/images/auth/gradient-yellow.svg" alt="" className="block size-full max-w-none" />
          </div>
        </div>
      </div>

      {/* 오른쪽 폼 */}
      <div className="bg-surface flex flex-col justify-center gap-10 px-[100px] py-[158px]">
        <div className="flex flex-col gap-4">
          <span className="size-15 bg-[#6b6b6b]" aria-hidden />

          <h2 id={headingId} className="text-[32px] font-semibold text-white">
            올인원 콘텐츠 생성의 시작
          </h2>
          <p className="text-base text-[#999]">계정을 액세스 하고 원하는 결과물을 창작하세요</p>
        </div>

        <form className="flex flex-col gap-10" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor={userIdInputId} className="text-xl text-white">
                아이디
              </label>
              <input
                id={userIdInputId}
                name="loginId"
                type="text"
                autoComplete="username"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError("");
                }}
                className="focus:border-primary-500 h-12 rounded-lg border-2 border-[#707070] px-4 text-base text-white placeholder:text-[#999] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={passwordInputId} className="text-xl text-white">
                비밀번호
              </label>
              <input
                id={passwordInputId}
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="focus:border-primary-500 h-12 rounded-lg border-2 border-[#707070] px-4 text-base text-white placeholder:text-[#999] focus:outline-none"
              />
            </div>

            {/* 로그인 실패 에러 메시지 */}
            {error && (
              <p role="alert" aria-live="polite" className="text-sm whitespace-pre-line text-red-500">
                {error}
              </p>
            )}
          </div>

          <Button type="submit" disabled={!isValid || submitting} className="h-12 w-full text-xl">
            {submitting ? "로그인 중…" : "로그인"}
          </Button>
        </form>

        {/* 회원가입 / 계정 찾기 */}
        <div className="flex items-center justify-center gap-10 text-base text-[#999]">
          <button type="button" onClick={onSwitchToSignup} className="underline hover:text-white">
            회원가입
          </button>
          <button
            type="button"
            onClick={onSwitchToResetPassword}
            className="underline hover:text-white"
          >
            아이디/비밀번호를 잊었어요
          </button>
        </div>
      </div>
    </section>
  );
}
