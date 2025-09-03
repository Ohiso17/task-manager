"use client";

import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";
import { TaskItem } from "./task-item";

type Task = RouterOutputs["task"]["getUpcoming"][0];

export function UpcomingTasks() {
  const { data: tasks, isLoading } = api.task.getUpcoming.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="text-lg">Loading upcoming tasks...</div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 text-white">
        <div className="text-lg">No upcoming tasks</div>
        <div className="text-sm text-white/70">
          All your tasks are up to date!
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {tasks.map((task: Task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
