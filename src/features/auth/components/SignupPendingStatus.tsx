import type { ReactNode } from "react";

interface SignupPendingStatusProps {
  /** 가입 신청 일시 */
  appliedAt: string;
}

function formatAppliedAt(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SignupPendingStatus({
  appliedAt,
}: SignupPendingStatusProps) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      {/* 아이콘 */}
      <div className="relative mb-6 flex size-40 shrink-0 items-center justify-center">
        {/* 장식 점 */}
        <span
          className="bg-primary-300 absolute top-2 left-6 size-2 rounded-full"
          aria-hidden
        />
        <span
          className="absolute top-14 -left-2 size-1.5 rounded-full bg-emerald-400"
          aria-hidden
        />
        <span
          className="absolute bottom-4 left-2 size-2 rounded-full bg-amber-300"
          aria-hidden
        />
        <span
          className="bg-primary-300 absolute top-4 right-2 size-1.5 rounded-full"
          aria-hidden
        />
        <span
          className="absolute top-16 right-0 text-lg text-gray-300"
          aria-hidden
        >
          ✦
        </span>

        {/* 원형 배경 */}
        <div className="bg-primary-50 absolute size-32 rounded-full" />

        {/* 클립보드 아이콘 */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary-300 relative size-16"
        >
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <rect
            x="9"
            y="1.5"
            width="6"
            height="3"
            rx="1"
            fill="currentColor"
            stroke="none"
          />
          <circle cx="12" cy="10" r="2" />
          <path d="M9 15h6M9 17.5h4" strokeLinecap="round" />
        </svg>

        {/* 시계 배지 */}
        <span className="bg-primary-500 absolute right-1 bottom-1 flex size-9 items-center justify-center rounded-full text-white shadow-md">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        가입 승인 대기 중입니다
      </h2>
      <p className="mt-3 text-sm leading-6 text-gray-500">
        입력하신 정보가 정상적으로 접수되었습니다.
        <br />
        관리자의 승인 후 서비스 이용이 가능합니다.
      </p>

      {/* 상태 카드 */}
      <div className="mt-8 w-full divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white text-left">
        <StatusRow icon={<ClockIcon />} label="현재 상태">
          <span className="text-primary-500 font-medium">승인 대기 중</span>
        </StatusRow>
        <StatusRow icon={<UserIcon />} label="신청 일시">
          <span className="text-gray-900">{formatAppliedAt(appliedAt)}</span>
        </StatusRow>
        <StatusRow icon={<MailIcon />} label="안내">
          <span className="text-gray-900">
            승인 완료 시 등록하신 이메일로 안내드리겠습니다.
          </span>
        </StatusRow>
      </div>

      {/* 고객센터 */}
      <p className="mt-8 text-sm text-gray-400">
        궁금한 점이 있으시면 고객센터로 문의해주세요.
      </p>
      <a
        href="#"
        className="text-primary-500 mt-1 text-sm font-medium hover:underline"
      >
        고객센터 바로가기 &gt;
      </a>
    </div>
  );
}

interface StatusRowProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

function StatusRow({ icon, label, children }: StatusRowProps) {
  return (
    <div className="flex items-start gap-3 px-5 py-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        {icon}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm">{children}</span>
      </span>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-5"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}