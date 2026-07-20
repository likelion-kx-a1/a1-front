import ProjectChatsView from "@/features/library/components/ProjectChatsView";

interface ProjectChatsPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectChatsPage({ params }: ProjectChatsPageProps) {
  const { projectId } = await params;
  return <ProjectChatsView projectId={Number(projectId)} />;
}
