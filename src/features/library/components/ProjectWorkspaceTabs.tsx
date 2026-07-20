"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProjectWorkspaceTabsProps {
  projectId: number;
}

/** 프로젝트 보관함 / 채팅 목록 전환 */
export default function ProjectWorkspaceTabs({ projectId }: ProjectWorkspaceTabsProps) {
  const pathname = usePathname();
  const storageHref = `/library/${projectId}`;
  const chatsHref = `/library/${projectId}/chats`;
  const isStorage = pathname === storageHref;
  const isChats = pathname === chatsHref;

  const tabClass = (active: boolean) =>
    `flex h-12 items-center justify-center rounded-lg px-8 text-base ${
      active ? "bg-primary-500 text-white" : "bg-[#333] text-gray-300 hover:text-white"
    }`;

  return (
    <nav aria-label="프로젝트 보기 전환">
      <ul className="flex gap-4" role="tablist">
        <li role="presentation">
          <Link
            href={storageHref}
            role="tab"
            aria-selected={isStorage}
            aria-current={isStorage ? "page" : undefined}
            className={tabClass(isStorage)}
          >
            보관함
          </Link>
        </li>
        <li role="presentation">
          <Link
            href={chatsHref}
            role="tab"
            aria-selected={isChats}
            aria-current={isChats ? "page" : undefined}
            className={tabClass(isChats)}
          >
            채팅 목록
          </Link>
        </li>
      </ul>
    </nav>
  );
}
