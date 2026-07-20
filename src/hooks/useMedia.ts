import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { getMyMedia, saveMedia } from "@/lib/media";
import { useAuthStore } from "@/stores/authStore";
import type { MyMediaParams, SaveMediaPayload } from "@/types/media.types";

export const myMediaQueryKey = (params?: MyMediaParams) => ["myMedia", params ?? {}] as const;

/** GET /api/my/media */
export function useMyMedia(params?: MyMediaParams) {
  const isLoggedIn = useAuthStore((s) => !!s.user);
  return useQuery({
    queryKey: myMediaQueryKey(params),
    queryFn: () => getMyMedia(params),
    enabled: isLoggedIn,
  });
}

/** POST /api/media/{mediaId}/save */
export function useSaveMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mediaId, ...payload }: SaveMediaPayload & { mediaId: number }) =>
      saveMedia(mediaId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myMedia"] });
    },
  });
}

interface PendingSave {
  mediaId: number;
  displayName: string;
}

/**
 * 라이브러리 저장 — projectId가 있으면 바로 저장, 없으면 프로젝트 선택 모달을 연다.
 */
export function useSaveToLibrary(projectId?: number | null) {
  const saveMutation = useSaveMedia();
  const [pickerOpen, setPickerOpen] = useState(false);
  const pendingRef = useRef<PendingSave | null>(null);

  const save = useCallback(
    async (params: PendingSave) => {
      if (typeof projectId === "number" && !Number.isNaN(projectId)) {
        const res = await saveMutation.mutateAsync({ ...params, projectId });
        if (!res.success) {
          throw new Error(res.error.message);
        }
        return res;
      }
      pendingRef.current = params;
      setPickerOpen(true);
      return null;
    },
    [projectId, saveMutation],
  );

  const confirmProject = useCallback(
    async (selectedProjectId: number) => {
      const pending = pendingRef.current;
      if (!pending) {
        return null;
      }
      const res = await saveMutation.mutateAsync({ ...pending, projectId: selectedProjectId });
      pendingRef.current = null;
      setPickerOpen(false);
      if (!res.success) {
        throw new Error(res.error.message);
      }
      return res;
    },
    [saveMutation],
  );

  const cancelPicker = useCallback(() => {
    pendingRef.current = null;
    setPickerOpen(false);
  }, []);

  return {
    save,
    confirmProject,
    cancelPicker,
    pickerOpen,
    isPending: saveMutation.isPending,
  };
}
