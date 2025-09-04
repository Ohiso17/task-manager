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
      void utils.project.getStats.invalidate();
      void utils.task.getAll.invalidate();
      void utils.task.getUpcoming.invalidate();
      setDeleteProjectId(null);
    },
  });

  const handleDelete = (projectId: string) => {
    deleteProject.mutate({ id: projectId });
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
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="block overflow-hidden rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div
                className="h-4 w-4 flex-shrink-0 rounded-full"
                style={{ backgroundColor: project.color ?? "#3B82F6" }}
              />
              <h3 className="truncate text-lg font-semibold text-white">
                {project.name}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(project.id);
              }}
              className="text-red-400 transition-colors hover:text-red-300"
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending && deleteProjectId === project.id
                ? "..."
                : "×"}
            </button>
          </div>

          {project.description && (
            <p className="mt-2 line-clamp-2 text-sm text-white/70">
              {project.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-white/60">
              {project._count.tasks}{" "}
              {project._count.tasks === 1 ? "task" : "tasks"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
