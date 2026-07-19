import { useQuery } from "@tanstack/react-query";
import { getChats } from "@/lib/chats";
import { useAuthStore } from "@/stores/authStore";
import type { ChatListParams } from "@/types/chat.types";

/** 채팅 목록 조회 — GET /api/chats */
export function useChats(params: ChatListParams = {}, enabled = true) {
  const isLoggedIn = useAuthStore((s) => !!s.user);
  return useQuery({
    queryKey: ["chats", params],
    queryFn: () => getChats(params),
    enabled: isLoggedIn && enabled,
  });
}
