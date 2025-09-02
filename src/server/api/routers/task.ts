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
          OR: [
            { ownerId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id } } }
          ]
        }
      },
      include: {
        project: true,
        category: true,
        assignees: {
          include: {
            user: true,
          },
        },
        createdBy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return tasks;
  }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const task = await ctx.db.task.findFirst({
      where: { 
        project: {
          OR: [
            { ownerId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id } } }
          ]
        }
      },
      include: {
        project: true,
        category: true,
        assignees: {
          include: {
            user: true,
          },
        },
        createdBy: true,
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
      categoryId: z.string().optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
      dueDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          projectId: input.projectId,
          categoryId: input.categoryId,
          createdById: ctx.session.user.id,
        },
        include: {
          project: true,
          category: true,
          assignees: {
            include: {
              user: true,
            },
          },
          createdBy: true,
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
