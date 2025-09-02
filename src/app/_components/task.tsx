"use client";

import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";

type Task = RouterOutputs["task"]["getAll"][0];

export function TaskList() {
  const { data: tasks, isLoading } = api.task.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="text-lg">No tasks found</div>
        <div className="text-sm text-white/70">
          Create your first task to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-white">
      <h3 className="text-xl font-bold">Your Latest Tasks</h3>
      <div className="flex w-full max-w-md flex-col gap-2">
        {tasks.slice(0, 3).map((task: Task) => (
          <div
            key={task.id}
            className="rounded-lg bg-white/10 p-4 transition-colors hover:bg-white/20"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{task.title}</h4>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  task.priority === "URGENT"
                    ? "bg-red-500/20 text-red-300"
                    : task.priority === "HIGH"
                      ? "bg-orange-500/20 text-orange-300"
                      : task.priority === "MEDIUM"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-green-500/20 text-green-300"
                }`}
              >
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className="mt-1 text-sm text-white/70">{task.description}</p>
            )}
            <div className="mt-2 flex items-center justify-between text-xs text-white/60">
              <span>Project: {task.project.name}</span>
              <span>{task.status}</span>
            </div>
          </div>
        ))}
      </div>
      {tasks.length > 3 && (
        <div className="text-sm text-white/70">
          And {tasks.length - 3} more tasks...
        </div>
      )}
    </div>
  );
}
