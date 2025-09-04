"use client";

import { api } from "~/trpc/react";
import { useState, useEffect } from "react";
import { TaskList } from "./task";
import { TaskForm } from "./task-form";
import { ProjectForm } from "./project-form";
import { AuthButton } from "./auth-button";
import Link from "next/link";

import { type RouterOutputs } from "~/trpc/react";

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingTask, setEditingTask] = useState<
    RouterOutputs["task"]["getAll"][0] | undefined
  >(undefined);

  const {
    data: project,
    isLoading,
    isFetching,
    refetch,
  } = api.project.getById.useQuery(
    {
      id: projectId,
    },
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0, // Always consider data stale to ensure fresh updates
    },
  );

  // Listen for focus events to refresh data when user returns to tab
  useEffect(() => {
    const handleFocus = () => {
      void refetch();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <div className="text-xl">Loading project...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <div className="text-xl">Project not found</div>
            <Link
              href="/projects"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleTaskSuccess = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleTaskCancel = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleProjectSuccess = () => {
    setShowProjectForm(false);
  };

  const handleProjectCancel = () => {
    setShowProjectForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: project.color ?? "#3B82F6" }}
            />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-3xl font-bold text-white">
                {project.name}
              </h1>
              {project.description && (
                <p className="line-clamp-2 text-white/70">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowProjectForm(true)}
              className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
            >
              Edit Project
            </button>
            <Link
              href="/projects"
              className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
            >
              Back to Projects
            </Link>
            <AuthButton />
          </div>
        </div>

        {/* Project Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            className={`rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-opacity ${isFetching ? "opacity-75" : ""}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Total Tasks</h3>
              {isFetching && (
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
              )}
            </div>
            <p className="text-2xl font-bold text-white">
              {project.tasks.length}
            </p>
          </div>
          <div
            className={`rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-opacity ${isFetching ? "opacity-75" : ""}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Completed</h3>
              {isFetching && (
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
              )}
            </div>
            <p className="text-2xl font-bold text-green-400">
              {project.tasks.filter((task) => task.status === "DONE").length}
            </p>
          </div>
          <div
            className={`rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-opacity ${isFetching ? "opacity-75" : ""}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">In Progress</h3>
              {isFetching && (
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
              )}
            </div>
            <p className="text-2xl font-bold text-yellow-400">
              {
                project.tasks.filter((task) => task.status === "IN_PROGRESS")
                  .length
              }
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => setShowTaskForm(true)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            + New Task
          </button>
        </div>

        {/* Tasks */}
        <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-semibold text-white">Tasks</h2>
          <TaskList projectId={projectId} />
        </div>

        {/* Modals */}
        {showTaskForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-full max-w-2xl rounded-lg bg-slate-800 p-6">
              <h3 className="mb-4 text-xl font-semibold text-white">
                {editingTask ? "Edit Task" : "Create New Task"}
              </h3>
              <TaskForm
                projectId={projectId}
                task={editingTask}
                onSuccess={handleTaskSuccess}
                onCancel={handleTaskCancel}
              />
            </div>
          </div>
        )}

        {showProjectForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-full max-w-2xl rounded-lg bg-slate-800 p-6">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Edit Project
              </h3>
              <ProjectForm
                project={project}
                onSuccess={handleProjectSuccess}
                onCancel={handleProjectCancel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
