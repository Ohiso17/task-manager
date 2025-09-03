import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: { 
        userId: ctx.session.user.id
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          }
        },
        _count: {
          select: {
            tasks: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return projects;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: { 
          id: input.id,
          userId: ctx.session.user.id
        },
        include: {
          tasks: {
            orderBy: [
              { dueDate: "asc" },
              { createdAt: "asc" }
            ]
          }
        }
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  create: protectedProcedure
    .input(z.object({ 
      name: z.string().min(1, "Project name is required"),
      description: z.string().optional(),
      color: z.string().optional().default("#3B82F6"),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          color: input.color,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      name: z.string().min(1, "Project name is required").optional(),
      description: z.string().optional(),
      color: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Verify ownership
      const existingProject = await ctx.db.project.findFirst({
        where: { 
          id,
          userId: ctx.session.user.id
        }
      });

      if (!existingProject) {
        throw new Error("Project not found");
      }

      return ctx.db.project.update({
        where: { id },
        data: updateData,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existingProject = await ctx.db.project.findFirst({
        where: { 
          id: input.id,
          userId: ctx.session.user.id
        }
      });

      if (!existingProject) {
        throw new Error("Project not found");
      }

      return ctx.db.project.delete({
        where: { id: input.id },
      });
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: { 
        userId: ctx.session.user.id
      },
      include: {
        tasks: {
          select: {
            status: true,
            completedAt: true,
            createdAt: true,
          }
        }
      }
    });

    const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);
    const inProgressTasks = projects.reduce((sum, project) => 
      sum + project.tasks.filter(task => task.status === "IN_PROGRESS").length, 0
    );

    // Tasks completed this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const completedThisWeek = projects.reduce((sum, project) => 
      sum + project.tasks.filter(task => 
        task.status === "DONE" && 
        task.completedAt && 
        task.completedAt >= oneWeekAgo
      ).length, 0
    );

    return {
      totalProjects: projects.length,
      totalTasks,
      inProgressTasks,
      completedThisWeek,
    };
  }),
});
