import Button from "@/components/ui/Button";

const CODE_LENGTH = 6;

/** 이메일 인증 UI */
export default function EmailVerification() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* 이메일 + 인증코드 발송 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-200">이메일</label>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="you@example.com"
            className="focus:border-primary-500 min-w-0 flex-1 rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
          />
          <Button type="button" className="shrink-0 px-4">
            인증코드 발송
          </Button>
        </div>
      </div>

      {/* 인증코드 입력 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-200">인증코드</label>
        <div className="flex gap-2">
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <input
              key={i}
              inputMode="numeric"
              maxLength={1}
              className="focus:border-primary-500 size-11 rounded-lg border border-gray-600 bg-gray-900 text-center text-lg text-white focus:outline-none"
            />
          ))}
        </div>
        <Button type="button" className="mt-1 w-full">
          확인
        </Button>
      </div>
    </div>
  );
}