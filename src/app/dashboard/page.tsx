import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { TaskList } from "~/app/_components/task";
import { ProjectList } from "~/app/_components/project-list";
import { AuthButton } from "~/app/_components/auth-button";
import { DashboardStats } from "~/app/_components/dashboard-stats";
import { UpcomingTasks } from "~/app/_components/upcoming-tasks";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  // Prefetch user's data
  void api.project.getStats.prefetch();
  void api.task.getAll.prefetch();
  void api.task.getUpcoming.prefetch();
  void api.project.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-white/70">
                Manage your tasks and stay organized
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <AuthButton />
            </div>
          </div>

          {/* Quick Stats */}
          <DashboardStats />

          {/* Quick Actions */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Link
              href="/projects/new"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              + New Project
            </Link>
            <Link
              href="/projects"
              className="rounded-lg bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
            >
              View All Projects
            </Link>
          </div>

          {/* Recent Projects */}
          <div className="mb-8 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Your Projects
              </h2>
              <Link
                href="/projects"
                className="text-blue-400 transition-colors hover:text-blue-300"
              >
                View All
              </Link>
            </div>
            <ProjectList />
          </div>

          {/* Upcoming Tasks */}
          <div className="mb-8 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Upcoming Tasks
              </h2>
              <Link
                href="/tasks"
                className="text-blue-400 transition-colors hover:text-blue-300"
              >
                View All
              </Link>
            </div>
            <UpcomingTasks />
          </div>

          {/* Recent Tasks */}
          <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
              <Link
                href="/tasks"
                className="text-blue-400 transition-colors hover:text-blue-300"
              >
                View All
              </Link>
            </div>
            <TaskList limit={5} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
