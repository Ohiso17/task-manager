"use client";

import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";
import { useState } from "react";
import { TaskForm } from "./task-form";

type Task = RouterOutputs["task"]["getAll"][0];

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const utils = api.useUtils();
  const updateStatus = api.task.updateStatus.useMutation({
    onSuccess: () => {
      void utils.task.getAll.invalidate();
      void utils.project.getStats.invalidate();
      setIsUpdating(false);
    },
    onError: (error) => {
      console.error("Failed to update task status:", error);
      setIsUpdating(false);
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      void utils.task.getAll.invalidate();
      void utils.project.getStats.invalidate();
    },
  });

  const handleStatusChange = (newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    if (newStatus === task.status) return;

    console.log(`Updating task ${task.id} from ${task.status} to ${newStatus}`);
    setIsUpdating(true);
    updateStatus.mutate({ id: task.id, status: newStatus });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate({ id: task.id });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    } else {
      setShowEditForm(true);
    }
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/20 text-red-300";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-300";
      case "LOW":
        return "bg-green-500/20 text-green-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-500/20 text-green-300";
      case "IN_PROGRESS":
        return "bg-blue-500/20 text-blue-300";
      case "TODO":
        return "bg-gray-500/20 text-gray-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString();
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE";

  return (
    <div
      className={`rounded-lg bg-white/10 p-4 transition-colors hover:bg-white/20 ${
        task.status === "DONE" ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.status === "DONE"}
              onChange={(e) =>
                handleStatusChange(e.target.checked ? "DONE" : "TODO")
              }
              disabled={isUpdating}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <h4
              className={`font-semibold ${task.status === "DONE" ? "text-white/60 line-through" : "text-white"}`}
            >
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p
              className={`mt-1 text-sm ${task.status === "DONE" ? "text-white/50" : "text-white/70"}`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </span>
            <select
              value={task.status}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as "TODO" | "IN_PROGRESS" | "DONE",
                )
              }
              disabled={isUpdating}
              className={`rounded-full border-0 bg-transparent px-2 py-1 text-xs font-medium ${getStatusColor(task.status)} focus:ring-2 focus:ring-blue-500 focus:outline-none ${isUpdating ? "opacity-50" : ""}`}
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
            {isUpdating && (
              <span className="text-xs text-blue-400">Updating...</span>
            )}
            {task.dueDate && (
              <span
                className={`text-xs ${isOverdue ? "text-red-400" : "text-white/60"}`}
              >
                Due: {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="text-blue-400 transition-colors hover:text-blue-300"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-400 transition-colors hover:text-red-300"
            disabled={deleteTask.isPending}
          >
            {deleteTask.isPending ? "..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-2xl rounded-lg bg-slate-800 p-6">
            <h3 className="mb-4 text-xl font-semibold text-white">Edit Task</h3>
            <TaskForm
              task={task}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
