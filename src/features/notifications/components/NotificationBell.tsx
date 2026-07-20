"use client";

import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import BellIcon from "@/components/icons/BellIcon";
import ImageIcon from "@/components/icons/ImageIcon";
import MegaphoneIcon from "@/components/icons/MegaphoneIcon";
import ReversePromptIcon from "@/components/icons/ReversePromptIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import { useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";
import type { AppNotification } from "@/types/notification.types";

/**
 * notificationType/title/content 키워드로 아이콘 결정.
 * 문서화된 값은 "GENERATION_DONE" 하나뿐이라, 어떤 생성인지는 title/content 텍스트로 구분.
 */
function getNotificationIcon(n: AppNotification): ComponentType<SVGProps<SVGSVGElement>> {
  const text = `${n.notificationType} ${n.title} ${n.content}`;
  if (/비디오|영상|VIDEO/i.test(text)) {
    return VideoIcon;
  }
  if (/역\s*프롬프트|REVERSE/i.test(text)) {
    return ReversePromptIcon;
  }
  if (/이미지|IMAGE/i.test(text)) {
    return ImageIcon;
  }
  if (/권한|승인|거절|공지|PERMISSION|NOTICE/i.test(text)) {
    return MegaphoneIcon;
  }
  return BellIcon;
}

/** 발생 시각 → "n분 전" 형태의 상대 시간 텍스트 */
function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return "방금 전";
  }
  if (minutes < 60) {
    return `${minutes}분 전`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}시간 전`;
  }
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

/** 헤더의 알림 버튼 + 펼침 목록 (로그인 상태에서만 렌더되는 AuthStatus 안에서만 사용) */
export default function NotificationBell() {
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const notifications = data?.success ? data.data : [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // 패널을 열면 그 시점의 안 읽은 알림을 전부 읽음 처리
  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        notifications
          .filter((n) => !n.isRead)
          .forEach((n) => markRead.mutate(n.notificationId));
      }
      return next;
    });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={unreadCount > 0 ? `알림 (안 읽은 알림 ${unreadCount}개)` : "알림"}
        className="relative flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-gray-900"
      >
        <BellIcon className="size-6 text-white" aria-hidden />
        {unreadCount > 0 && (
          <span
            aria-hidden
            className="bg-primary-500 absolute top-1.5 right-1.5 size-2 rounded-full"
          />
        )}
      </button>

      {open && (
        <div
          role="region"
          aria-label="알림 목록"
          className="border-border bg-surface modal-scroll absolute top-full right-0 z-20 mt-2 max-h-96 w-80 overflow-y-auto rounded-xl border shadow-lg"
        >
          {notifications.length === 0 ? (
            <p className="text-muted px-5 py-6 text-center text-sm">알림이 없습니다</p>
          ) : (
            <ul role="list" className="divide-border divide-y">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification);
                return (
                  <li
                    key={notification.notificationId}
                    role="listitem"
                    className="relative flex items-start gap-3 px-5 py-4"
                  >
                    {!notification.isRead && (
                      <span
                        aria-hidden
                        className="bg-primary-500 absolute top-4 left-2 size-1.5 rounded-full"
                      />
                    )}
                    <Icon className="size-6 shrink-0 text-white" aria-hidden />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-white">
                          {!notification.isRead && <span className="sr-only">안 읽음. </span>}
                          {notification.title}
                        </p>
                        <time
                          dateTime={notification.createdAt}
                          className="text-muted shrink-0 text-xs whitespace-nowrap"
                        >
                          {formatRelativeTime(notification.createdAt)}
                        </time>
                      </div>
                      <p className="text-muted truncate text-xs">{notification.content}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
