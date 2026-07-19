"use client";

/** 프로젝트에 속한 비디오 생성 페이지 — 여기서 생성한 채팅은 이 projectId에 연결 */

import { useParams } from "next/navigation";
import VideoGenerationView from "@/features/video-generation/components/VideoGenerationView";

export default function ProjectVideoGenerationPage() {
  const { projectId } = useParams<{ projectId: string }>();
  return <VideoGenerationView projectId={Number(projectId)} />;
}
