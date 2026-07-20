"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { useRequestEmailCode } from "@/hooks/useEmailVerification";
import { useResetPassword } from "@/hooks/usePasswordReset";

const CODE_LENGTH = 6;

const inputStyle =
  "bg-surface border-border focus:border-primary-500 h-12 rounded-lg border px-4 text-base text-white placeholder:text-muted focus:outline-none";

interface ResetPasswordFormProps {
  /** 로그인 화면으로 전환 */
  onSwitchToLogin: () => void;
  /** 모달 닫기 (홈으로 돌아가기 시 호출) */
  onClose: () => void;
}

export default function ResetPasswordForm({ onSwitchToLogin, onClose }: ResetPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitError, setSubmitError] = useState("");
  const [resetDone, setResetDone] = useState(false);

  const codeInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const headingId = useId();
  const emailInputId = useId();
  const newPasswordInputId = useId();
  const confirmPasswordInputId = useId();

  const { mutate: requestCode, isPending: sending } = useRequestEmailCode();
  const { mutate: resetPasswordMutate, isPending: submitting } = useResetPassword();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const verificationCode = code.join("");
  const isCodeComplete = verificationCode.length === CODE_LENGTH;
  const expired = sent && seconds === 0;
  const isPasswordValid =
    newPassword.length >= 8 &&
    /[A-Za-z]/.test(newPassword) &&
    /\d/.test(newPassword) &&
    /[^A-Za-z0-9\s]/.test(newPassword);
  const isMatch = confirmPassword !== "" && newPassword === confirmPassword;
  const canSubmit =
    sent && !expired && isCodeComplete && isPasswordValid && isMatch && !submitting;

  // 인증코드 유효시간 카운트다운
  useEffect(() => {
    if (!sent || seconds <= 0) {
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [sent, seconds]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // 인증코드 발송
  const handleSendCode = () => {
    setSubmitError("");
    requestCode(
      { email, purpose: "PASSWORD_RESET" },
      {
        onSuccess: (expiredAt) => {
          const remaining = Math.max(
            0,
            Math.ceil((new Date(expiredAt).getTime() - Date.now()) / 1000),
          );
          setSent(true);
          setSeconds(remaining);
          setCode(Array(CODE_LENGTH).fill(""));
          codeInputsRef.current[0]?.focus();
        },
        onError: () => setSubmitError("인증코드 발송에 실패했습니다. 다시 시도해 주세요."),
      },
    );
  };

  // 인증코드 입력 시 다음 칸으로 이동
  const handleCodeChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < CODE_LENGTH - 1) {
      codeInputsRef.current[index + 1]?.focus();
    }
  };

  // 백스페이스로 이전 칸 이동
  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  // 인증코드 붙여넣기
  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) {
      return;
    }
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i += 1) {
      next[i] = pasted[i];
    }
    setCode(next);
    codeInputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  // 비밀번호 재설정 신청
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    resetPasswordMutate(
      { email, verificationCode, newPassword },
      {
        onSuccess: (res) => {
          if (res.success) {
            setResetDone(true);
          } else {
            setSubmitError(res.error.message);
          }
        },
        onError: () => setSubmitError("비밀번호 재설정에 실패했습니다. 다시 시도해 주세요."),
      },
    );
  };

  return (
    <section
      aria-labelledby={headingId}
      className="grid overflow-hidden rounded-2xl md:min-h-[828px] md:grid-cols-2"
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
      <div className="bg-surface flex flex-col justify-center gap-10 px-[100px] py-10">
        <div className="flex flex-col gap-4">
          <h2 id={headingId} className="text-[32px] font-semibold text-white">
            비밀번호 재설정
          </h2>
          {resetDone ? (
            <p role="status" aria-live="polite" className="text-base tracking-[-0.32px] text-muted">
              비밀번호가 재설정 되었습니다
              <br />
              다시 로그인 해주세요
            </p>
          ) : (
            <p className="text-base tracking-[-0.32px] text-muted">
              이메일 인증 후 비밀번호를 재 설정해 주세요
            </p>
          )}
        </div>

        {resetDone ? (
          <div className="flex flex-col items-center gap-6">
            <Button type="button" onClick={onSwitchToLogin} className="h-12 w-full text-xl">
              로그인 하기
            </Button>
            <Link
              href="/"
              onClick={onClose}
              className="text-base text-muted underline hover:text-white"
            >
              홈으로 돌아가기
            </Link>
          </div>
        ) : (
          <form className="flex flex-col gap-10" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-4">
              {/* 이메일 인증 */}
              <div className="flex flex-col gap-2">
                <label htmlFor={emailInputId} className="text-xl text-white">
                  이메일 인증
                </label>
                <div className="flex gap-2">
                  <input
                    id={emailInputId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSent(false);
                    }}
                    placeholder="example@gmail.com"
                    className={`min-w-0 flex-1 ${inputStyle}`}
                  />
                  <Button
                    type="button"
                    onClick={handleSendCode}
                    disabled={!isEmailValid || sending}
                    className="h-12 w-[120px] shrink-0 text-base"
                  >
                    {sending ? "발송 중…" : sent ? "재발송" : "인증"}
                  </Button>
                </div>
                {sent && (
                  <div className="flex items-center justify-between text-base">
                    <span className="text-muted">
                      {expired
                        ? "인증 시간이 만료되었습니다. 재발송해 주세요"
                        : "인증 이메일이 전송되었습니다"}
                    </span>
                    <span
                      className={`font-medium ${expired ? "text-red-500" : "text-primary-500"}`}
                    >
                      {formatTime(seconds)}
                    </span>
                  </div>
                )}
              </div>

              {/* 인증코드 */}
              <div className="flex flex-col gap-2">
                <label className="text-xl text-white">인증코드</label>
                <div className="flex gap-2" onPaste={handleCodePaste}>
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        codeInputsRef.current[i] = el;
                      }}
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      disabled={!sent || expired}
                      className="bg-surface border-border focus:border-primary-500 h-[65px] min-w-0 flex-1 rounded-lg border text-center text-lg text-white focus:outline-none disabled:opacity-50"
                    />
                  ))}
                </div>
              </div>

              {/* 새 비밀번호 */}
              <div className="flex flex-col gap-2">
                <label htmlFor={newPasswordInputId} className="text-xl text-white">
                  새 비밀번호
                </label>
                <input
                  id={newPasswordInputId}
                  name="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                  className={inputStyle}
                />
                {newPassword && !isPasswordValid && (
                  <span className="text-xs font-normal text-red-500">
                    영문·숫자·특수문자 포함 8자 이상
                  </span>
                )}
              </div>

              {/* 새 비밀번호 확인 */}
              <div className="flex flex-col gap-2">
                <label htmlFor={confirmPasswordInputId} className="text-xl text-white">
                  새 비밀번호 확인
                </label>
                <input
                  id={confirmPasswordInputId}
                  name="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 재입력해주세요"
                  className={inputStyle}
                />
                {confirmPassword && !isMatch && (
                  <span role="alert" className="text-xs font-normal text-red-500">
                    비밀번호가 일치하지 않습니다
                  </span>
                )}
              </div>

              {submitError && (
                <p role="alert" aria-live="polite" className="text-sm text-red-500">
                  {submitError}
                </p>
              )}
            </div>

            <Button type="submit" disabled={!canSubmit} className="h-12 w-full text-xl">
              {submitting ? "재설정 중…" : "비밀번호 재설정"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
