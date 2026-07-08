"use client";

import Button from "@/components/ui/Button";

const socialProviders = ["카카오", "구글", "네이버"];

interface LoginFormProps {
  /** 회원가입 화면으로 전환 */
  onSwitchToSignup: () => void;
}

/** 로그인 폼*/
export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  return (
    <>
      <span className="size-10 rounded-md bg-gray-300" aria-hidden />

      <h2 className="mt-2 text-2xl font-bold text-white">어서오세요</h2>
      <p className="mt-2 text-sm text-gray-400">
        계정을 액세스 하고 원하는 결과물을 창작하세요
      </p>

      <form className="mt-4 flex flex-col gap-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          아이디
          <input
            type="text"
            className="focus:border-primary-500 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
          비밀번호
          <input
            type="password"
            className="focus:border-primary-500 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
        </label>

        <Button type="submit" className="mt-2 w-full">
          로그인
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