import LibraryProjectView from "@/features/library/components/LibraryProjectView";

interface LibraryProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function LibraryProjectPage({ params }: LibraryProjectPageProps) {
  const { projectId } = await params;
  return <LibraryProjectView projectId={Number(projectId)} />;
}
