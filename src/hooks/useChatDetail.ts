import { useQuery } from "@tanstack/react-query";
import { getChatDetail } from "@/lib/chats";
import { useAuthStore } from "@/stores/authStore";

export const chatDetailQueryKey = (chatId: number) => ["chatDetail", chatId] as const;

/** 채팅 상세 조회 — GET /api/chats/{chatId} */
export function useChatDetail(chatId: number | null, enabled = true) {
  const isLoggedIn = useAuthStore((s) => !!s.user);

  return useQuery({
    queryKey: chatId !== null ? chatDetailQueryKey(chatId) : ["chatDetail", "none"],
    queryFn: async () => {
      if (chatId === null) {
        throw new Error("chatId is required");
      }
      const res = await getChatDetail(chatId);
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res.data;
    },
    enabled: isLoggedIn && enabled && chatId !== null,
  });
}
