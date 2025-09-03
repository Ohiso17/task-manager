"use client";

import { api } from "~/trpc/react";

export function DashboardStats() {
  const { data: stats, isLoading } = api.project.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-2 h-6 w-20 animate-pulse rounded bg-white/20"></div>
            <div className="mb-1 h-8 w-12 animate-pulse rounded bg-white/20"></div>
            <div className="h-4 w-16 animate-pulse rounded bg-white/20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white">Projects</h3>
        <p className="text-2xl font-bold text-white">
          {stats?.totalProjects ?? 0}
        </p>
        <p className="text-sm text-white/60">Total projects</p>
      </div>
      <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white">Total Tasks</h3>
        <p className="text-2xl font-bold text-white">
          {stats?.totalTasks ?? 0}
        </p>
        <p className="text-sm text-white/60">All time</p>
      </div>
      <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white">Completed</h3>
        <p className="text-2xl font-bold text-green-400">
          {stats?.completedThisWeek ?? 0}
        </p>
        <p className="text-sm text-white/60">This week</p>
      </div>
      <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white">In Progress</h3>
        <p className="text-2xl font-bold text-yellow-400">
          {stats?.inProgressTasks ?? 0}
        </p>
        <p className="text-sm text-white/60">Active tasks</p>
      </div>
    </div>
  );
}
