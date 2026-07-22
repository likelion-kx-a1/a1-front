import { useId } from "react";
import Link from "next/link";
import type { ApprovalStatus } from "@/types/admin.types";

interface SignupPendingStatusProps {
  /** 회원가입 응답의 승인 상태 */
  approvalStatus: ApprovalStatus;
  /** 가입 신청 일시 */
  appliedAt: string;
}

const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  PENDING: "권한 승인 대기 중",
  APPROVED: "승인 완료",
  REJECTED: "승인 거절됨",
};

function formatAppliedAt(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

export default function SignupPendingStatus({
  approvalStatus,
  appliedAt,
}: SignupPendingStatusProps) {
  const headingId = useId();
  const { date, time } = formatAppliedAt(appliedAt);

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

      {/* 오른쪽 콘텐츠 */}
      <div className="bg-surface flex flex-col justify-center gap-10 px-[100px] py-[158px]">
        <div className="flex flex-col gap-4">
          <h2 id={headingId} className="text-[32px] leading-[1.2] font-semibold text-white">
            환영합니다!
            <br />
            이제 한 단계 남았습니다
          </h2>
          <p className="text-base leading-[1.5] tracking-[-0.32px] text-[#999]">
            관리자의 권한 승인을 대기해 주세요
            <br />
            권한 승인 후 서비스를 이용할 수 있습니다
          </p>
        </div>

        <div className="border-border flex w-full flex-col gap-10 rounded-lg border-2 p-6 backdrop-blur-[10px]">
          <div className="flex w-full flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className="text-base text-[#999]">권한 승인 여부</p>
              <p className="text-xl text-white">{APPROVAL_STATUS_LABEL[approvalStatus]}</p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-base text-[#999]">요청 시간</p>
              <div className="flex gap-4 text-xl text-white">
                <time dateTime={appliedAt}>{date}</time>
                <span aria-hidden>{time}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-center text-base leading-[1.5]">
            <div className="flex flex-col gap-2">
              <p className="text-[#999]">문의사항이 있으신가요?</p>
              <button type="button" className="text-primary-500 underline hover:text-primary-400">
                고객센터 문의하기
              </button>
            </div>
            <Link href="/" className="text-[#999] underline hover:text-white">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
