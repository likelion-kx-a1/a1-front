"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { useRequestEmailCode, useVerifyEmailCode } from "@/hooks/useEmailVerification";

const CODE_LENGTH = 6;

interface EmailVerificationProps {
  /** 인증 성공 시 인증된 이메일 전달 */
  onVerified?: (email: string) => void;
}

export default function EmailVerification({ onVerified }: EmailVerificationProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false); // 코드 발송 여부
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const { mutateAsync: requestEmailCode, isPending: sending } = useRequestEmailCode();
  const { mutateAsync: verifyEmailCode, isPending: verifying } = useVerifyEmailCode();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const codeString = code.join("");
  const isCodeComplete = codeString.length === CODE_LENGTH;
  const expired = sent && seconds === 0;

  // 인증코드 유효시간 카운트다운
  useEffect(() => {
    if (!sent || seconds <= 0) {
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [sent, seconds]);

  // 인증코드 발송
  const handleSend = async () => {
    setError("");
    try {
      // 발송 응답의 만료 시각으로 남은 시간 계산
      const expiredAt = await requestEmailCode({ email, purpose: "SIGNUP" });
      const remaining = Math.max(0, Math.ceil((new Date(expiredAt).getTime() - Date.now()) / 1000));
      setSent(true);
      setVerified(false);
      setSeconds(remaining);
      setCode(Array(CODE_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } catch {
      setError("인증코드 발송에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 인증코드 확인
  const handleVerify = async () => {
    setError("");
    try {
      const ok = await verifyEmailCode({ email, code: codeString });
      if (ok) {
        setVerified(true);
        onVerified?.(email);
      } else {
        setError("인증코드가 올바르지 않습니다.");
      }
    } catch {
      setError("인증 확인에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 숫자 입력 시 다음으로 이동
  const handleCodeChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setError("");
    if (digit && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // 백스페이스
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // 붙여넣기
  const handlePaste = (e: React.ClipboardEvent) => {
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
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* 이메일 + 인증코드 발송 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-200">이메일</label>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            disabled={verified}
            placeholder="you@example.com"
            className="focus:border-primary-500 min-w-0 flex-1 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none disabled:opacity-60"
          />
          <Button
            type="button"
            onClick={handleSend}
            disabled={!isEmailValid || sending || verified}
            className="shrink-0 px-4"
          >
            {sending ? "발송 중…" : sent ? "재발송" : "인증코드 발송"}
          </Button>
        </div>
      </div>

      {/* 인증코드 입력 (발송 후 표시) */}
      {sent && !verified && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-200">인증코드</label>
            <span className={`text-xs ${expired ? "text-red-500" : "text-gray-400"}`}>
              {expired ? "시간 만료 · 재발송 필요" : `남은 시간 ${formatTime(seconds)}`}
            </span>
          </div>

          <div className="flex gap-2" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="focus:border-primary-500 size-11 rounded-lg border border-gray-600 bg-gray-900 text-center text-lg text-white focus:outline-none"
              />
            ))}
          </div>

          <Button
            type="button"
            onClick={handleVerify}
            disabled={!isCodeComplete || verifying || expired}
            className="mt-1 w-full"
          >
            {verifying ? "확인 중…" : "확인"}
          </Button>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* 인증 성공 */}
      {verified && (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-400">
          ✓ 이메일 인증이 완료되었습니다.
        </p>
      )}
    </div>
  );
}
