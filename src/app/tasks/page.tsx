import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { TaskList } from "~/app/_components/task";
import { AuthButton } from "~/app/_components/auth-button";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";

export default async function TasksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  // Prefetch user's tasks
  void api.task.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">All Tasks</h1>
              <p className="text-white/70">
                View and manage all your tasks across projects
              </p>
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

          {/* Tasks List */}
          <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <TaskList />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
