"use client";

import { usePathname } from "next/navigation";
import AuthStatus from "@/features/auth/components/AuthStatus";
import { useChats } from "@/hooks/useChats";
import { useProject, useProjects } from "@/hooks/useProjects";
import { formatChatSequenceTitle, isPlaceholderChatTitle } from "@/lib/chats";
import type { Chat } from "@/types/chat.types";

function parseRouteContext(pathname: string): {
  projectId: number | null;
  section: "storage" | "chats" | "generation" | null;
} {
  const libraryStorage = pathname.match(/^\/library\/(\d+)\/?$/);
  if (libraryStorage) {
    return { projectId: Number(libraryStorage[1]), section: "storage" };
  }

  const libraryChats = pathname.match(/^\/library\/(\d+)\/chats\/?$/);
  if (libraryChats) {
    return { projectId: Number(libraryChats[1]), section: "chats" };
  }

  const projectGeneration = pathname.match(/^\/project\/(\d+)/);
  if (projectGeneration) {
    return { projectId: Number(projectGeneration[1]), section: "generation" };
  }

  return { projectId: null, section: null };
}

function getLatestChat(chats: Chat[]): Chat | null {
  if (chats.length === 0) {
    return null;
  }
  return [...chats].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];
}

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
  const pathname = usePathname();
  const { projectId, section } = parseRouteContext(pathname);

  const projectQuery = useProject(projectId);
  const projectsQuery = useProjects();
  const chatsQuery = useChats({ projectId: projectId ?? undefined }, projectId !== null);

  const nameFromDetail =
    projectQuery.data?.success && projectId !== null ? projectQuery.data.data.name : null;
  const nameFromList =
    projectsQuery.data?.success && projectId !== null
      ? (projectsQuery.data.data.find((p) => p.projectId === projectId)?.name ?? null)
      : null;
  const projectName = nameFromDetail ?? nameFromList;

  const chats = chatsQuery.data?.success ? (chatsQuery.data.data ?? []) : [];
  const latestChat = getLatestChat(chats);
  const chatTitle = resolveChatDisplayTitle(chats, latestChat);

  let suffix: string | null = null;
  if (section === "storage") {
    suffix = "보관함";
  } else if (section === "chats") {
    suffix = "채팅 목록";
  } else if (section === "generation") {
    suffix = chatTitle;
  }

  const title = projectName && suffix ? `${projectName}_${suffix}` : null;

  return (
    <header className="flex items-center justify-between gap-4 px-8 py-5">
      <div className="min-w-0 flex-1">
        {title && (
          <p className="truncate text-base text-white" aria-label="현재 위치">
            {title}
          </p>
        )}
      </div>
      <AuthStatus />
    </header>
  );
}
