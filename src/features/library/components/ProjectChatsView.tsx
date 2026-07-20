"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useChats } from "@/hooks/useChats";
import { resolveChatListTitle, sortChatsByCreatedAt } from "@/lib/chats";

interface ProjectChatsViewProps {
  projectId: number;
}

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR");
}

/** 프로젝트 채팅 목록 */
export default function ProjectChatsView({ projectId }: ProjectChatsViewProps) {
  const chatsQuery = useChats({ projectId });

  const chats = useMemo(() => {
    const list = chatsQuery.data?.success ? (chatsQuery.data.data ?? []) : [];
    return sortChatsByCreatedAt(list);
  }, [chatsQuery.data]);

  return (
    <section aria-labelledby="project-chats-heading" className="flex flex-col gap-6">
      <h2 id="project-chats-heading" className="sr-only">
        채팅 목록
      </h2>

      {chatsQuery.isLoading ? (
        <p className="text-gray-400">채팅 목록 불러오는 중…</p>
      ) : chatsQuery.data && !chatsQuery.data.success ? (
        <p role="alert" className="text-red-400">
          {chatsQuery.data.error.message}
        </p>
      ) : chats.length === 0 ? (
        <p className="text-gray-400">아직 채팅이 없습니다. 이미지·비디오 생성을 시작해 보세요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {chats.map((chat, index) => {
            const title = resolveChatListTitle(chat, index + 1);
            return (
              <li key={chat.chatId}>
                <article className="bg-surface flex items-center justify-between gap-4 rounded-xl px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg text-white">{title}</h3>
                    <p className="text-sm text-gray-500">
                      마지막 수정 {formatUpdatedAt(chat.updatedAt)}
                      {chat.isGenerating ? " · 생성 중" : ""}
                    </p>
                  </div>
                  <Link
                    href={`/project/${projectId}/image`}
                    className="bg-primary-500 shrink-0 rounded-lg px-4 py-2 text-sm text-white hover:opacity-90"
                  >
                    열기
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
