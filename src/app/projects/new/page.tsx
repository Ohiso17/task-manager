"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "~/app/_components/project-form";
import { AuthButton } from "~/app/_components/auth-button";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/projects");
  };

  const handleCancel = () => {
    router.push("/projects");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Create New Project
            </h1>
            <p className="text-white/70">
              Start organizing your tasks with a new project
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/projects"
              className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
            >
              Back to Projects
            </Link>
            <AuthButton />
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
            <ProjectForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </div>
      </div>
    </div>
  );
}
