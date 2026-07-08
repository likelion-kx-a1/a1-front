"use client";

import Button from "@/components/ui/Button";
import EmailVerification from "./EmailVerification";

interface SignupFormProps {
  /** 로그인 화면으로 전환 */
  onSwitchToLogin: () => void;
}

const inputStyle =
  "focus:border-primary-500 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none";

/** 회원가입 폼*/
export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  return (
    <>
      <span className="size-10 rounded-md bg-gray-300" aria-hidden />

      <h2 className="mt-2 text-2xl font-bold text-white">회원가입</h2>
      <p className="mt-2 text-sm text-gray-400">
        이메일 인증 후 계정을 만들어 주세요
      </p>

      <form className="mt-4 flex flex-col gap-3">
        {/* 아이디 + 중복확인 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          아이디
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="사용할 아이디를 입력하세요"
              className={`min-w-0 flex-1 ${inputStyle}`}
            />
            <Button type="button" variant="outline" className="shrink-0 px-4">
              중복확인
            </Button>
          </div>
        </label>

        {/* 이메일 인증 */}
        <EmailVerification />

        {/* 비밀번호 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          비밀번호
          <input type="password" className={inputStyle} />
          <span className="text-xs font-normal text-gray-500">
            영문·숫자·특수문자 포함 8자 이상
          </span>
        </label>

        {/* 비밀번호 확인 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          비밀번호 확인
          <input type="password" className={inputStyle} />
        </label>

        {/* 이름 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          이름
          <input
            type="text"
            placeholder="이름을 입력하세요"
            className={inputStyle}
          />
        </label>

        {/* 생년월일 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          생년월일
          <input type="date" className={`[color-scheme:dark] ${inputStyle}`} />
        </label>

        {/* 전화번호 */}
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          전화번호
          <input
            type="tel"
            placeholder="010-1234-5678"
            className={inputStyle}
          />
        </label>

        {/* 약관 동의 */}
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" className="accent-primary-500 size-4" />
          <span>(필수) 이용약관 및 개인정보 처리방침에 동의합니다</span>
        </label>

        <Button type="submit" className="mt-2 w-full">
          가입하기
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