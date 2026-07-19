"use client";

import { usePathname } from "next/navigation";
import AuthStatus from "@/features/auth/components/AuthStatus";
import { useChats } from "@/hooks/useChats";
import { useProject, useProjects } from "@/hooks/useProjects";
import { formatChatSequenceTitle, isPlaceholderChatTitle } from "@/lib/chats";
import type { Chat } from "@/types/chat.types";

/** /project/{projectId}/... 경로에서 projectId 추출 */
function useRouteProjectId(): number | null {
  const pathname = usePathname();
  const match = pathname.match(/^\/project\/(\d+)/);
  if (!match) {
    return null;
  }
  const id = Number(match[1]);
  return Number.isNaN(id) ? null : id;
}

/** 최근 수정 시각 기준 가장 최신 채팅 */
function getLatestChat(chats: Chat[]): Chat | null {
  if (chats.length === 0) {
    return null;
  }
  return [...chats].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];
}

/** 헤더용 채팅 표시명 */
function resolveChatDisplayTitle(chats: Chat[], latest: Chat | null): string {
  if (!latest) {
    return formatChatSequenceTitle(1);
  }
  if (isPlaceholderChatTitle(latest.title)) {
    const index = Math.max(
      1,
      chats.findIndex((c) => c.chatId === latest.chatId) + 1,
    );
    return formatChatSequenceTitle(index);
  }
  return latest.title.trim();
}

export default function Header() {
  const projectId = useRouteProjectId();
  const projectQuery = useProject(projectId);
  const projectsQuery = useProjects();
  const chatsQuery = useChats(
    projectId !== null ? { projectId } : {},
    projectId !== null,
  );

  const nameFromDetail =
    projectQuery.data?.success && projectId !== null ? projectQuery.data.data.name : null;
  const nameFromList =
    projectsQuery.data?.success && projectId !== null
      ? (projectsQuery.data.data.find((p) => p.projectId === projectId)?.name ?? null)
      : null;
  const projectName = nameFromDetail ?? nameFromList;

  const chats = chatsQuery.data?.success ? chatsQuery.data.data : [];
  const latestChat = getLatestChat(chats);
  const chatTitle = resolveChatDisplayTitle(chats, latestChat);

  const title = projectName ? `${projectName}_${chatTitle}` : null;

  return (
    <header className="flex items-center justify-between gap-4 px-8 py-5">
      <div className="min-w-0 flex-1">
        {title && (
          <p className="truncate text-base text-white" aria-label="현재 프로젝트 채팅">
            {title}
          </p>
        )}
      </div>
      <AuthStatus />
    </header>
  );
}
