"use client";

import { useId, useState } from "react";
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
  "focus:border-primary-500 h-12 rounded-lg border-2 border-[#707070] px-4 text-base text-white placeholder:text-[#999] focus:outline-none";

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

  const headingId = useId();
  const userIdInputId = useId();
  const passwordInputId = useId();
  const confirmInputId = useId();
  const nameInputId = useId();
  const birthDateInputId = useId();
  const phoneInputId = useId();
  const agreedInputId = useId();

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
      <div className="bg-surface flex flex-col justify-center gap-10 px-[100px] py-10">
        <div className="flex flex-col gap-4">
          <span className="size-15 bg-[#6b6b6b]" aria-hidden />

          <h2 id={headingId} className="text-[32px] font-semibold text-white">
            회원가입
          </h2>
          <p className="text-base text-[#999]">이메일 인증 후 계정을 만들어 주세요</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {/* 아이디 + 중복확인 */}
          <div className="flex flex-col gap-2">
            <label htmlFor={userIdInputId} className="text-xl text-white">
              아이디
            </label>
            <div className="flex gap-2">
              <input
                id={userIdInputId}
                name="loginId"
                type="text"
                autoComplete="username"
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
                role="status"
                className={`text-xs font-normal ${
                  idMessage.ok ? "text-emerald-400" : "text-red-500"
                }`}
              >
                {idMessage.text}
              </span>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label htmlFor={passwordInputId} className="text-xl text-white">
              비밀번호
            </label>
            <input
              id={passwordInputId}
              name="new-password"
              type="password"
              autoComplete="new-password"
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
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-2">
            <label htmlFor={confirmInputId} className="text-xl text-white">
              비밀번호 확인
            </label>
            <input
              id={confirmInputId}
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputStyle}
            />
            {confirm && !isMatch && (
              <span role="alert" className="text-xs font-normal text-red-500">
                비밀번호가 일치하지 않습니다
              </span>
            )}
          </div>

          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <label htmlFor={nameInputId} className="text-xl text-white">
              이름
            </label>
            <input
              id={nameInputId}
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className={inputStyle}
            />
          </div>

          {/* 생년월일 */}
          <div className="flex flex-col gap-2">
            <label htmlFor={birthDateInputId} className="text-xl text-white">
              생년월일
            </label>
            <input
              id={birthDateInputId}
              name="bday"
              type="date"
              autoComplete="bday"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`[color-scheme:dark] ${inputStyle}`}
            />
          </div>

          {/* 전화번호 */}
          <div className="flex flex-col gap-2">
            <label htmlFor={phoneInputId} className="text-xl text-white">
              전화번호
            </label>
            <input
              id={phoneInputId}
              name="tel"
              type="tel"
              autoComplete="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="010-1234-5678"
              className={inputStyle}
            />
          </div>

          {/* 이메일 인증 */}
          <EmailVerification onVerified={setVerifiedEmail} />

          {/* 약관 동의 */}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input
              id={agreedInputId}
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="accent-primary-500 size-4"
            />
            <label htmlFor={agreedInputId}>(필수) 이용약관 및 개인정보 처리방침에 동의합니다</label>
          </div>

          {/* 회원가입 실패 메시지 */}
          {submitError && (
            <p role="alert" aria-live="polite" className="text-sm text-red-500">
              {submitError}
            </p>
          )}

          <Button type="submit" disabled={!canSubmit} className="mt-2 h-12 w-full text-xl">
            {submitting ? "신청 중…" : "가입하기"}
          </Button>
        </form>

        {/* 로그인 전환 */}
        <p className="text-center text-base text-[#999]">
          이미 계정이 있으신가요?{" "}
          <button type="button" onClick={onSwitchToLogin} className="underline hover:text-white">
            로그인
          </button>
        </p>
      </div>
    </section>
  );
}
