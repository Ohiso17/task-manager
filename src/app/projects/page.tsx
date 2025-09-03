import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { ProjectList } from "~/app/_components/project-list";
import { AuthButton } from "~/app/_components/auth-button";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";
import Image from "next/image";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  // Prefetch user's projects
  void api.project.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.svg"
                alt="TaskFlow"
                width={125}
                height={40}
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">Projects</h1>
                <p className="text-white/70">
                  Organize your tasks into flowing projects
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
              >
                Dashboard
              </Link>
              <AuthButton />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Link
              href="/projects/new"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              + New Project
            </Link>
          </div>

          {/* Projects List */}
          <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <ProjectList />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
