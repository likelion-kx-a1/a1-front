import ProjectStorageView from "@/features/library/components/ProjectStorageView";

interface ProjectStoragePageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectStoragePage({ params }: ProjectStoragePageProps) {
  const { projectId } = await params;
  return <ProjectStorageView projectId={Number(projectId)} />;
}
