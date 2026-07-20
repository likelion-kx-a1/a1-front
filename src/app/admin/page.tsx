"use client";

/** 관리자 페이지 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  useAdminUsers,
  useApproveSignup,
  useRejectSignup,
  useSignupRequests,
  useUpdateUserStatus,
} from "@/hooks/useAdmin";
import { useAuthStore } from "@/stores/authStore";
import type { SignupRequest } from "@/types/admin.types";

const TABS = ["회원 관리", "토큰 통계"] as const;
type AdminTab = (typeof TABS)[number];

/** 탭 라벨 → HTML id에 쓸 슬러그 (id 속성엔 공백이 올 수 없어 별도로 관리) */
const TAB_SLUGS: Record<AdminTab, string> = {
  "회원 관리": "members",
  "토큰 통계": "tokens",
};

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("회원 관리");
  const user = useAuthStore((s) => s.user);
  const currentUserId = user?.id;

  // 새로고침 시 user는 localStorage에서 복원되므로, 복원 전엔 권한 판단을 미룸
  // (persist API는 서버 렌더링 중엔 없으므로 반드시 useEffect 안에서만 접근)
  const [checkedAuth, setCheckedAuth] = useState(false);
  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => setCheckedAuth(true));
    useAuthStore.persist.rehydrate();
    return unsubscribe;
  }, []);

  const isAdmin = checkedAuth && user?.role === "ADMIN";

  const signupRequestsQuery = useSignupRequests(0, 20, isAdmin);
  const activeUsersQuery = useAdminUsers({ accountStatus: "ACTIVE" }, isAdmin);

  const approveMutation = useApproveSignup();
  const rejectMutation = useRejectSignup();
  const statusMutation = useUpdateUserStatus();

  const [approveErrors, setApproveErrors] = useState<Record<number, string>>({});
  const [statusErrors, setStatusErrors] = useState<Record<number, string>>({});

  const [rejectTarget, setRejectTarget] = useState<SignupRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const pendingMembers = signupRequestsQuery.data?.success
    ? signupRequestsQuery.data.data.content
    : [];
  const activeMembers = activeUsersQuery.data?.success ? activeUsersQuery.data.data.content : [];

  const handleApprove = (userId: number) => {
    setApproveErrors((prev) => ({ ...prev, [userId]: "" }));
    approveMutation.mutate(userId, {
      onSuccess: (res) => {
        if (!res.success) {
          setApproveErrors((prev) => ({ ...prev, [userId]: res.error.message }));
        }
      },
      onError: () => {
        setApproveErrors((prev) => ({
          ...prev,
          [userId]: "승인 처리에 실패했습니다. 다시 시도해 주세요.",
        }));
      },
    });
  };

  const openRejectModal = (member: SignupRequest) => {
    setRejectTarget(member);
    setRejectReason("");
    setRejectError("");
  };

  const closeRejectModal = () => setRejectTarget(null);

  const handleConfirmReject = () => {
    if (!rejectTarget) {
      return;
    }
    setRejectError("");
    rejectMutation.mutate(
      { userId: rejectTarget.userId, reason: rejectReason.trim() },
      {
        onSuccess: (res) => {
          if (res.success) {
            setRejectTarget(null);
          } else {
            setRejectError(res.error.message);
          }
        },
        onError: () => setRejectError("거절 처리에 실패했습니다. 다시 시도해 주세요."),
      },
    );
  };

  const handleDeactivate = (userId: number) => {
    setStatusErrors((prev) => ({ ...prev, [userId]: "" }));
    statusMutation.mutate(
      { userId, accountStatus: "INACTIVE" },
      {
        onSuccess: (res) => {
          if (!res.success) {
            setStatusErrors((prev) => ({ ...prev, [userId]: res.error.message }));
          }
        },
        onError: () => {
          setStatusErrors((prev) => ({
            ...prev,
            [userId]: "상태 변경에 실패했습니다. 다시 시도해 주세요.",
          }));
        },
      },
    );
  };

  // 로그인 상태 복원 전에는 잠깐 대기
  if (!checkedAuth) {
    return null;
  }

  // 관리자 권한이 없으면 접근 차단
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="text-2xl font-medium text-white">접근 권한이 없습니다</h1>
        <p className="text-muted">관리자 계정으로 로그인해야 이 페이지를 이용할 수 있습니다.</p>
        <Link href="/" className="text-primary-500 underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-10">
      <h1 className="text-2xl font-medium text-white">관리자 페이지</h1>

      <div
        role="tablist"
        aria-label="관리자 메뉴"
        className="bg-surface flex w-fit gap-2 rounded-2xl p-2"
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`admin-tab-${TAB_SLUGS[t]}`}
            aria-selected={tab === t}
            aria-controls={`admin-panel-${TAB_SLUGS[t]}`}
            onClick={() => setTab(t)}
            className={twMerge(
              "w-40 rounded-lg py-3 text-xl",
              tab === t ? "bg-card border-border border-2 font-medium text-white" : "text-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "회원 관리" && (
        <div
          role="tabpanel"
          id={`admin-panel-${TAB_SLUGS["회원 관리"]}`}
          aria-labelledby={`admin-tab-${TAB_SLUGS["회원 관리"]}`}
          className="flex flex-col gap-10"
        >
          <section aria-labelledby="pending-members-heading" className="flex flex-col gap-4">
            <h2 id="pending-members-heading" className="text-2xl font-medium text-white">
              승인 대기 회원
            </h2>
            <div className="border-border rounded-xl border">
              <table className="w-full text-left text-base">
                <thead className="bg-card text-muted">
                  <tr>
                    <th scope="col" className="w-[120px] px-5 py-3.5 font-normal">
                      회원명
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-normal">
                      이메일
                    </th>
                    <th scope="col" className="w-[180px] px-5 py-3.5 text-center font-normal">
                      전화 번호
                    </th>
                    <th scope="col" className="w-[200px] px-5 py-3.5 text-center font-normal">
                      신청 시간
                    </th>
                    <th scope="col" className="w-[130px] px-5 py-3.5 text-center font-normal">
                      권한
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {signupRequestsQuery.isLoading && (
                    <tr>
                      <td colSpan={5} className="text-muted px-5 py-6 text-center">
                        불러오는 중…
                      </td>
                    </tr>
                  )}
                  {signupRequestsQuery.isError && (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-red-500">
                        목록을 불러오지 못했습니다.
                      </td>
                    </tr>
                  )}
                  {/* 승인 대기 회원은 최대 3명까지만 노출 */}
                  {pendingMembers.slice(0, 3).map((m) => (
                    <tr key={m.userId} className="bg-surface border-border border-t">
                      <td className="px-5 py-4 text-white">{m.name}</td>
                      <td className="text-muted px-5 py-4">{m.email}</td>
                      <td className="text-muted px-5 py-4 text-center">{m.phoneNumber}</td>
                      <td className="text-muted px-5 py-4 text-center">{m.createdAt}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleApprove(m.userId)}
                              disabled={
                                approveMutation.isPending &&
                                approveMutation.variables === m.userId
                              }
                              className="text-primary-500 underline disabled:opacity-50"
                            >
                              승인
                            </button>
                            <button
                              type="button"
                              onClick={() => openRejectModal(m)}
                              className="text-gray-500 underline"
                            >
                              거부
                            </button>
                          </div>
                          {approveErrors[m.userId] && (
                            <p role="alert" className="text-xs text-red-500">
                              {approveErrors[m.userId]}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!signupRequestsQuery.isLoading &&
                    !signupRequestsQuery.isError &&
                    pendingMembers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-muted px-5 py-6 text-center">
                          대기 중인 회원이 없습니다
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="active-members-heading" className="flex flex-col gap-4">
            <h2 id="active-members-heading" className="text-2xl font-medium text-white">
              활성 회원
            </h2>
            <div className="border-border modal-scroll max-h-96 overflow-y-auto rounded-xl border">
              <table className="w-full text-left text-base">
                <thead className="bg-card text-muted sticky top-0">
                  <tr>
                    <th scope="col" className="w-[120px] px-5 py-3.5 font-normal">
                      회원명
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-normal">
                      이메일
                    </th>
                    <th scope="col" className="w-[180px] px-5 py-3.5 text-center font-normal">
                      전화 번호
                    </th>
                    <th scope="col" className="w-[200px] px-5 py-3.5 text-center font-normal">
                      마지막 로그인
                    </th>
                    <th scope="col" className="w-[160px] px-5 py-3.5 text-center font-normal">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsersQuery.isLoading && (
                    <tr>
                      <td colSpan={5} className="text-muted px-5 py-6 text-center">
                        불러오는 중…
                      </td>
                    </tr>
                  )}
                  {activeUsersQuery.isError && (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-red-500">
                        목록을 불러오지 못했습니다.
                      </td>
                    </tr>
                  )}
                  {activeMembers.map((m) => {
                    const isSelf = m.userId === currentUserId;
                    return (
                      <tr key={m.userId} className="bg-surface border-border border-t">
                        <td className="px-5 py-4 text-white">{m.name}</td>
                        <td className="text-muted px-5 py-4">{m.email}</td>
                        <td className="text-muted px-5 py-4 text-center">-</td>
                        <td className="text-muted px-5 py-4 text-center">
                          {m.lastLoginAt ?? "-"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center justify-end gap-3">
                              <span className="text-primary-500 font-medium">활성</span>
                              <button
                                type="button"
                                onClick={() => handleDeactivate(m.userId)}
                                disabled={isSelf}
                                title={isSelf ? "본인 계정은 비활성화할 수 없습니다." : undefined}
                                className="text-gray-500 underline disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                활성 해제
                              </button>
                            </div>
                            {statusErrors[m.userId] && (
                              <p role="alert" className="text-xs text-red-500">
                                {statusErrors[m.userId]}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!activeUsersQuery.isLoading &&
                    !activeUsersQuery.isError &&
                    activeMembers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-muted px-5 py-6 text-center">
                          활성 회원이 없습니다
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {tab === "토큰 통계" && (
        <div
          role="tabpanel"
          id={`admin-panel-${TAB_SLUGS["토큰 통계"]}`}
          aria-labelledby={`admin-tab-${TAB_SLUGS["토큰 통계"]}`}
          className="text-muted"
        >
          준비 중입니다.
        </div>
      )}

      {/* 회원가입 거절 확인 모달 */}
      <Modal open={!!rejectTarget} onClose={closeRejectModal} label="회원가입 거절">
        <div className="flex flex-col gap-6 p-6">
          <h2 className="text-xl font-semibold text-white">회원가입 거절</h2>
          <p className="text-muted">
            <span className="text-white">{rejectTarget?.name}</span>님의 가입 신청을
            거절합니다. 사유를 입력해 주세요.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="거절 사유를 입력하세요"
            className="border-border bg-surface h-24 resize-none rounded-lg border p-3 text-white placeholder:text-muted focus:outline-none"
          />
          {rejectError && (
            <p role="alert" className="text-sm text-red-500">
              {rejectError}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeRejectModal}
              className="h-12 flex-1"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReject}
              disabled={rejectMutation.isPending}
              className="h-12 flex-1"
            >
              {rejectMutation.isPending ? "처리 중…" : "거절하기"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

