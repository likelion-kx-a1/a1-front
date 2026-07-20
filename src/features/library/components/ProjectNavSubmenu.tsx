"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useChats } from "@/hooks/useChats";
import { resolveChatListTitle, sortChatsByCreatedAt } from "@/lib/chats";

const subItemStyle =
  "flex h-10 w-full items-center rounded-lg px-4 text-sm text-gray-300 hover:bg-gray-900 hover:text-white";
const activeSubItemStyle = "bg-gray-900 text-white";

interface ProjectNavSubmenuProps {
  projectId: number;
}

/** 프로젝트 펼침 시 — 채팅 미리보기, 모든 채팅 보기, 보관함 */
export default function ProjectNavSubmenu({ projectId }: ProjectNavSubmenuProps) {
  const pathname = usePathname();
  const chatsQuery = useChats({ projectId });

  const sortedChats = useMemo(() => {
    const chats = chatsQuery.data?.success ? (chatsQuery.data.data ?? []) : [];
    return sortChatsByCreatedAt(chats);
  }, [chatsQuery.data]);

  const previewChats = sortedChats.slice(0, 2);
  const storageHref = `/library/${projectId}`;
  const allChatsHref = `/library/${projectId}/chats`;
  const isStorageActive = pathname === storageHref;
  const isAllChatsActive = pathname === allChatsHref;

  return (
    <ul className="mt-1 flex flex-col gap-1 pl-4" aria-label={`${projectId}번 프로젝트 메뉴`}>
      {chatsQuery.isLoading && (
        <li>
          <span className="px-4 text-xs text-gray-500">채팅 불러오는 중…</span>
        </li>
      )}

      {previewChats.map((chat, index) => {
        const title = resolveChatListTitle(chat, index + 1);
        const href = `/project/${projectId}/image`;
        return (
          <li key={chat.chatId}>
            <Link href={href} className={subItemStyle}>
              {title}
            </Link>
          </li>
        );
      })}

      <li>
        <Link
          href={allChatsHref}
          aria-current={isAllChatsActive ? "page" : undefined}
          className={`${subItemStyle} ${isAllChatsActive ? activeSubItemStyle : ""}`}
        >
          모든 채팅 보기
        </Link>
      </li>

      <li>
        <Link
          href={storageHref}
          aria-current={isStorageActive ? "page" : undefined}
          className={`${subItemStyle} ${isStorageActive ? activeSubItemStyle : ""}`}
        >
          보관함
        </Link>
      </li>
    </ul>
  );
}
