"use client";

import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";
import { TaskItem } from "./task-item";

type Task = RouterOutputs["task"]["getAll"][0];
type ProjectTask = RouterOutputs["project"]["getById"]["tasks"][0];

interface TaskListProps {
  projectId?: string;
  limit?: number;
  showProject?: boolean;
}

export function TaskList({
  projectId,
  limit,
  showProject: _showProject = true,
}: TaskListProps) {
  const { data: tasks, isLoading } = api.task.getAll.useQuery();
  const { data: project } = api.project.getById.useQuery(
    { id: projectId! },
    { enabled: !!projectId },
  );

  if (isLoading || (projectId && !project)) {
    return (
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  if (
    (!projectId && (!tasks || tasks.length === 0)) ||
    (projectId && (!project || project.tasks.length === 0))
  ) {
    return (
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="text-lg">No tasks found</div>
        <div className="text-sm text-white/70">
          Create your first task to get started!
        </div>
      </div>
    );
  }

  // Use project tasks if projectId is provided, otherwise use all tasks
  const filteredTasks: (Task | ProjectTask)[] =
    projectId && project ? project.tasks : tasks ?? [];

  const displayTasks = limit ? filteredTasks.slice(0, limit) : filteredTasks;

  if (displayTasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="text-lg">No tasks found</div>
        <div className="text-sm text-white/70">
          {projectId
            ? "Create your first task in this project!"
            : "Create your first task to get started!"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 text-white">
      {!projectId && (
        <h3 className="text-xl font-bold">
          {limit ? "Your Latest Tasks" : "All Tasks"}
        </h3>
      )}
      <div className="flex w-full flex-col gap-2">
        {displayTasks.map((task: Task | ProjectTask) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      {limit && filteredTasks.length > limit && (
        <div className="text-sm text-white/70">
          And {filteredTasks.length - limit} more tasks...
        </div>
      )}
    </div>
  );
}
