import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationRead } from "@/lib/notifications";
import { useAuthStore } from "@/stores/authStore";

/** 새 알림 확인을 위한 폴링 주기 */
const POLL_INTERVAL_MS = 30000;

/** 로그인 상태에서만 폴링하는 내 알림 목록 */
export function useNotifications() {
  const isLoggedIn = useAuthStore((s) => !!s.user);
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: isLoggedIn,
    refetchInterval: POLL_INTERVAL_MS,
  });
}

/** 알림 읽음 처리 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
