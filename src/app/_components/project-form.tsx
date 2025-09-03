"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { type RouterOutputs } from "~/trpc/react";

type Project = RouterOutputs["project"]["getById"];

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectForm({
  project,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [color, setColor] = useState(project?.color ?? "#3B82F6");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const utils = api.useUtils();
  const createProject = api.project.create.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      onSuccess?.();
    },
  });
  const updateProject = api.project.update.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      onSuccess?.();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (project) {
        await updateProject.mutateAsync({
          id: project.id,
          name,
          description: description || undefined,
          color,
        });
      } else {
        await createProject.mutateAsync({
          name,
          description: description || undefined,
          color,
        });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedColors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#84CC16", // Lime
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Project Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
          placeholder="Enter project name"
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
          placeholder="Enter project description"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Project Color
        </label>
        <div className="flex flex-wrap gap-2">
          {predefinedColors.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => setColor(colorOption)}
              className={`h-8 w-8 rounded-full border-2 transition-all ${
                color === colorOption
                  ? "scale-110 border-white"
                  : "border-white/30 hover:border-white/60"
              }`}
              style={{ backgroundColor: colorOption }}
            />
          ))}
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mt-2 h-8 w-16 rounded border-0 bg-transparent"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none disabled:opacity-50"
        >
          {isLoading
            ? project
              ? "Updating..."
              : "Creating..."
            : project
              ? "Update Project"
              : "Create Project"}
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
