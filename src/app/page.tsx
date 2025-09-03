import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.task.hello({ text: "from tRPC" });
  const session = await auth();

  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-blue-900 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Task <span className="text-blue-400">Manager</span>
          </h1>

          <p className="max-w-2xl text-center text-xl text-white/80">
            Organize your life with a simple, powerful task management system.
            Create projects, add tasks, and track your progress.
          </p>

          <div className="flex flex-col items-center gap-4">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <Link
                href="/auth"
                className="rounded-full bg-blue-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-blue-700"
              >
                Get Started
              </Link>
              <p className="text-center text-sm text-white/60">
                Sign in to start managing your tasks
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-6 transition-colors hover:bg-white/20">
              <h3 className="text-xl font-bold">📋 Simple Tasks</h3>
              <div className="text-sm text-white/80">
                Create and manage tasks with ease. Mark them as done, set
                priorities, and track progress.
              </div>
            </div>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-6 transition-colors hover:bg-white/20">
              <h3 className="text-xl font-bold">📁 Projects</h3>
              <div className="text-sm text-white/80">
                Organize your tasks into projects. Keep your work, personal, and
                other areas separate.
              </div>
            </div>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-6 transition-colors hover:bg-white/20">
              <h3 className="text-xl font-bold">⚡ Fast & Secure</h3>
              <div className="text-sm text-white/80">
                Built with modern technology. Your data is secure and the app is
                lightning fast.
              </div>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
