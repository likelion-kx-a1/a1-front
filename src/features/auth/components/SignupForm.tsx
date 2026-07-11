"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useCheckLoginId, useSignup } from "@/hooks/useSignup";
import EmailVerification from "./EmailVerification";

interface SignupFormProps {
  /** 로그인 화면으로 전환 */
  onSwitchToLogin: () => void;
  /** 가입 신청 완료 시 호출 */
  onSubmitted: (appliedAt: string) => void;
}

const inputStyle =
  "focus:border-primary-500 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none";

export default function SignupForm({ onSwitchToLogin, onSubmitted }: SignupFormProps) {
  const [userId, setUserId] = useState("");
  const [idChecked, setIdChecked] = useState(false); // 중복확인 통과 여부
  const [idMessage, setIdMessage] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);

  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const { mutate: checkIdMutate, isPending: idChecking } = useCheckLoginId();
  const { mutate: signupMutate, isPending: submitting } = useSignup();

  const isPasswordValid =
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9\s]/.test(password);
  const isMatch = confirm !== "" && password === confirm;
  const emailVerified = verifiedEmail !== "";
  const canSubmit =
    idChecked &&
    emailVerified &&
    isPasswordValid &&
    isMatch &&
    name.trim() !== "" &&
    birthDate !== "" &&
    phoneNumber.trim() !== "" &&
    agreed &&
    !submitting;

  // 아이디 변경 시 중복확인 결과 초기화
  const handleIdChange = (value: string) => {
    setUserId(value);
    setIdChecked(false);
    setIdMessage(null);
  };

  // 아이디 중복확인
  const handleCheckId = () => {
    checkIdMutate(userId, {
      onSuccess: (available) => {
        setIdChecked(available);
        setIdMessage({
          text: available ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.",
          ok: available,
        });
      },
      onError: () => setIdMessage({ text: "중복 확인에 실패했습니다.", ok: false }),
    });
  };

  // 회원가입 신청
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    signupMutate(
      { loginId: userId, email: verifiedEmail, password, name, birthDate, phoneNumber },
      {
        onSuccess: (res) => {
          if (res.success) {
            onSubmitted(new Date().toISOString());
          } else {
            setSubmitError(res.error.message);
          }
        },
        onError: () => setSubmitError("회원가입에 실패했습니다. 다시 시도해 주세요."),
      },
    );
  };

  return (
    <>
      {/* 로고 자리표시자 */}
      <span className="size-10 rounded-md bg-gray-300" aria-hidden />

      <h2 className="mt-2 text-2xl font-bold text-white">회원가입</h2>
      <p className="mt-2 text-sm text-gray-400">이메일 인증 후 계정을 만들어 주세요</p>

      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
        {/* 아이디 + 중복확인 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          아이디
          <div className="flex gap-2">
            <input
              type="text"
              value={userId}
              onChange={(e) => handleIdChange(e.target.value)}
              placeholder="사용할 아이디를 입력하세요"
              className={`min-w-0 flex-1 ${inputStyle}`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckId}
              disabled={userId.trim() === "" || idChecking}
              className="shrink-0 px-4"
            >
              {idChecking ? "확인 중…" : "중복확인"}
            </Button>
          </div>
          {idMessage && (
            <span
              className={`text-xs font-normal ${
                idMessage.ok ? "text-emerald-400" : "text-red-500"
              }`}
            >
              {idMessage.text}
            </span>
          )}
        </label>

        {/* 비밀번호 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputStyle}
          />
          <span
            className={`text-xs font-normal ${
              password && !isPasswordValid ? "text-red-500" : "text-gray-500"
            }`}
          >
            영문·숫자·특수문자 포함 8자 이상
          </span>
        </label>

        {/* 비밀번호 확인 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          비밀번호 확인
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputStyle}
          />
          {confirm && !isMatch && (
            <span className="text-xs font-normal text-red-500">비밀번호가 일치하지 않습니다</span>
          )}
        </label>

        {/* 이름 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          이름
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className={inputStyle}
          />
        </label>

        {/* 생년월일 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          생년월일
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={`[color-scheme:dark] ${inputStyle}`}
          />
        </label>

        {/* 전화번호 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          전화번호
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="010-1234-5678"
            className={inputStyle}
          />
        </label>

        {/* 이메일 인증 */}
        <EmailVerification onVerified={setVerifiedEmail} />

        {/* 약관 동의 */}
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="accent-primary-500 size-4"
          />
          <span>(필수) 이용약관 및 개인정보 처리방침에 동의합니다</span>
        </label>

        {/* 회원가입 실패 메시지 */}
        {submitError && <p className="text-sm text-red-500">{submitError}</p>}

        <Button type="submit" disabled={!canSubmit} className="mt-2 w-full">
          {submitting ? "신청 중…" : "가입하기"}
        </Button>
      </form>

      {/* 로그인 전환 */}
      <p className="mt-6 text-center text-sm text-gray-400">
        이미 계정이 있으신가요?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary-300 font-medium hover:underline"
        >
          로그인
        </button>
      </p>
    </>
  );
}
