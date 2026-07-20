"use client";

/** 프로젝트에 속한 이미지 생성 페이지 — 여기서 생성한 채팅은 이 projectId에 연결됨 */

import { useParams } from "next/navigation";
import ImageGenerationView from "@/features/image-generation/components/ImageGenerationView";

export default function ProjectImageGenerationPage() {
  const { projectId } = useParams<{ projectId: string }>();
  return <ImageGenerationView projectId={Number(projectId)} />;
}
