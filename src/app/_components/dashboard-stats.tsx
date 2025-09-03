"use client";

import { api } from "~/trpc/react";
import { useEffect } from "react";

export function DashboardStats() {
  const {
    data: stats,
    isLoading,
    isFetching,
    refetch,
  } = api.project.getStats.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale to ensure fresh updates
    refetchInterval: 30000, // Refetch every 30 seconds to keep data fresh
  });

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
      <div
        className={`rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-opacity ${isFetching ? "opacity-75" : ""}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Projects</h3>
          {isFetching && (
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
          )}
        </div>
        <p className="text-2xl font-bold text-white">
          {stats?.totalProjects ?? 0}
        </p>
        <p className="text-sm text-white/60">Total projects</p>
      </div>
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
          {stats?.totalTasks ?? 0}
        </p>
        <p className="text-sm text-white/60">All time</p>
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
          {stats?.completedThisWeek ?? 0}
        </p>
        <p className="text-sm text-white/60">This week</p>
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
          {stats?.inProgressTasks ?? 0}
        </p>
        <p className="text-sm text-white/60">Active tasks</p>
      </div>
    </div>
  );
}
