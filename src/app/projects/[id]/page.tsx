import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ProjectDetail } from "~/app/_components/project-detail";
import { api, HydrateClient } from "~/trpc/server";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    redirect("/auth");
  }

  // Prefetch project data
  void api.project.getById.prefetch({ id });
  void api.task.getAll.prefetch();

  return (
    <HydrateClient>
      <ProjectDetail projectId={id} />
    </HydrateClient>
  );
}
