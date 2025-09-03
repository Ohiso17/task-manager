"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { type RouterOutputs } from "~/trpc/react";

type Project = RouterOutputs["project"]["getAll"][0];
type Task = RouterOutputs["task"]["getAll"][0];

interface TaskFormProps {
  projectId?: string;
  task?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TaskForm({
  projectId,
  task,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
    task?.priority ?? "MEDIUM",
  );
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">(
    task?.status ?? "TODO",
  );
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: projects } = api.project.getAll.useQuery();
  const utils = api.useUtils();

  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      void utils.task.getAll.invalidate();
      void utils.task.getUpcoming.invalidate();
      void utils.project.getStats.invalidate();
      void utils.project.getById.invalidate();
      onSuccess?.();
    },
  });

  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      void utils.task.getAll.invalidate();
      void utils.task.getUpcoming.invalidate();
      void utils.project.getStats.invalidate();
      void utils.project.getById.invalidate();
      onSuccess?.();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const taskData = {
        title,
        description: description || undefined,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      };

      if (task) {
        await updateTask.mutateAsync({
          id: task.id,
          ...taskData,
        });
      } else {
        if (!projectId) {
          throw new Error("Project is required");
        }
        await createTask.mutateAsync({
          ...taskData,
          projectId,
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-white">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-white"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-white"
          >
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
            }
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
          >
            <option value="LOW" className="bg-gray-800">
              Low
            </option>
            <option value="MEDIUM" className="bg-gray-800">
              Medium
            </option>
            <option value="HIGH" className="bg-gray-800">
              High
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-white"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "TODO" | "IN_PROGRESS" | "DONE")
            }
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
          >
            <option value="TODO" className="bg-gray-800">
              TODO
            </option>
            <option value="IN_PROGRESS" className="bg-gray-800">
              IN PROGRESS
            </option>
            <option value="DONE" className="bg-gray-800">
              DONE
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-white"
          >
            Due Date (Optional)
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none disabled:opacity-50"
        >
          {isLoading
            ? task
              ? "Updating..."
              : "Creating..."
            : task
              ? "Update Task"
              : "Create Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-white/10 px-4 py-3 font-semibold text-white transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
