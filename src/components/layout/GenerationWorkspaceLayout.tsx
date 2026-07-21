import GenerationHistoryPanel from "@/features/generation/components/GenerationHistoryPanel";

interface GenerationWorkspaceLayoutProps {
  projectId?: number;
  children: React.ReactNode;
}

/** 이미지·비디오·역프롬프트 생성 화면 공통 — 우측 생성 기록 패널 */
export default function GenerationWorkspaceLayout({
  projectId,
  children,
}: GenerationWorkspaceLayoutProps) {
  return (
    <div className="relative min-h-[calc(100dvh-10rem)] w-full">
      <div className="min-w-0">{children}</div>
      <GenerationHistoryPanel projectId={projectId} />
    </div>
  );
}
