"use client";

import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";
import { useState } from "react";
import Link from "next/link";

type Project = RouterOutputs["project"]["getAll"][0];

export function ProjectList() {
  const { data: projects, isLoading } = api.project.getAll.useQuery();
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const utils = api.useUtils();
  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      setDeleteProjectId(null);
    },
  });

  const handleDelete = (projectId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this project? All tasks in this project will also be deleted.",
      )
    ) {
      deleteProject.mutate({ id: projectId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="text-lg">No projects found</div>
        <div className="text-sm text-white/70">
          Create your first project to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: Project) => (
        <div
          key={project.id}
          className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: project.color ?? "#3B82F6" }}
              />
              <h3 className="text-lg font-semibold text-white">
                {project.name}
              </h3>
            </div>
            <button
              onClick={() => handleDelete(project.id)}
              className="text-red-400 transition-colors hover:text-red-300"
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending && deleteProjectId === project.id
                ? "..."
                : "×"}
            </button>
          </div>

          {project.description && (
            <p className="mt-2 text-sm text-white/70">{project.description}</p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-white/60">
              {project._count.tasks}{" "}
              {project._count.tasks === 1 ? "task" : "tasks"}
            </div>
            <Link
              href={`/projects/${project.id}`}
              className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
