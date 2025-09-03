import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.db.task.findMany({
      where: { 
        project: {
          userId: ctx.session.user.id
        }
      },
      include: {
        project: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return tasks;
  }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const task = await ctx.db.task.findFirst({
      where: { 
        project: {
          userId: ctx.session.user.id
        }
      },
      include: {
        project: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return task ?? null;
  }),

  create: protectedProcedure
    .input(z.object({ 
      title: z.string().min(1),
      description: z.string().optional(),
      projectId: z.string(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
      dueDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify project ownership
      const project = await ctx.db.project.findFirst({
        where: { 
          id: input.projectId,
          userId: ctx.session.user.id
        }
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          projectId: input.projectId,
        },
        include: {
          project: true,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
      dueDate: z.date().optional(),
      status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Verify task ownership through project
      const existingTask = await ctx.db.task.findFirst({
        where: { 
          id,
          project: {
            userId: ctx.session.user.id
          }
        }
      });

      if (!existingTask) {
        throw new Error("Task not found");
      }

      // If marking as done, set completedAt
      if (input.status === "DONE" && existingTask.status !== "DONE") {
        updateData.completedAt = new Date();
      } else if (input.status !== "DONE" && existingTask.status === "DONE") {
        updateData.completedAt = null;
      }

      return ctx.db.task.update({
        where: { id },
        data: updateData,
        include: {
          project: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify task ownership through project
      const existingTask = await ctx.db.task.findFirst({
        where: { 
          id: input.id,
          project: {
            userId: ctx.session.user.id
          }
        }
      });

      if (!existingTask) {
        throw new Error("Task not found");
      }

      return ctx.db.task.delete({
        where: { id: input.id },
      });
    }),

  updateStatus: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify task ownership through project
      const existingTask = await ctx.db.task.findFirst({
        where: { 
          id: input.id,
          project: {
            userId: ctx.session.user.id
          }
        }
      });

      if (!existingTask) {
        throw new Error("Task not found");
      }

      const updateData: any = { status: input.status };
      
      // Set completedAt when marking as done
      if (input.status === "DONE" && existingTask.status !== "DONE") {
        updateData.completedAt = new Date();
      } else if (input.status !== "DONE" && existingTask.status === "DONE") {
        updateData.completedAt = null;
      }

      return ctx.db.task.update({
        where: { id: input.id },
        data: updateData,
        include: {
          project: true,
        },
      });
    }),

  reorder: protectedProcedure
    .input(z.object({ 
      taskId: z.string(),
      newOrder: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify task ownership through project
      const existingTask = await ctx.db.task.findFirst({
        where: { 
          id: input.taskId,
          project: {
            userId: ctx.session.user.id
          }
        }
      });

      if (!existingTask) {
        throw new Error("Task not found");
      }

      return ctx.db.task.update({
        where: { id: input.taskId },
        data: { order: input.newOrder },
        include: {
          project: true,
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
