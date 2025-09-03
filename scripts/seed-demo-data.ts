import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding demo data...");

  // Create sample user if it doesn't exist
  const sampleUser = await prisma.user.upsert({
    where: { email: "sample@example.com" },
    update: {},
    create: {
      name: "Sample User",
      email: "sample@example.com",
      password: "password123", // In production, this should be hashed
    },
  });

  console.log("✅ Sample user created:", sampleUser.email);

  // Create demo projects
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: "demo-project-1" },
      update: {},
      create: {
        id: "demo-project-1",
        name: "Work Tasks",
        description: "Tasks related to my job and career development",
        color: "#3B82F6",
        userId: sampleUser.id,
      },
    }),
    prisma.project.upsert({
      where: { id: "demo-project-2" },
      update: {},
      create: {
        id: "demo-project-2",
        name: "Personal Projects",
        description: "Personal side projects and hobbies",
        color: "#10B981",
        userId: sampleUser.id,
      },
    }),
    prisma.project.upsert({
      where: { id: "demo-project-3" },
      update: {},
      create: {
        id: "demo-project-3",
        name: "Home & Life",
        description: "Household tasks and life management",
        color: "#F59E0B",
        userId: sampleUser.id,
      },
    }),
  ]);

  console.log("✅ Demo projects created:", projects.length);

  // Create demo tasks
  const tasks = await Promise.all([
    // Work Tasks
    prisma.task.upsert({
      where: { id: "demo-task-1" },
      update: {},
      create: {
        id: "demo-task-1",
        title: "Complete quarterly report",
        description: "Finish the Q4 performance report for the team",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        projectId: "demo-project-1",
        order: 1,
      },
    }),
    prisma.task.upsert({
      where: { id: "demo-task-2" },
      update: {},
      create: {
        id: "demo-task-2",
        title: "Schedule team meeting",
        description: "Plan and schedule the weekly team standup",
        status: "TODO",
        priority: "MEDIUM",
        projectId: "demo-project-1",
        order: 2,
      },
    }),
    prisma.task.upsert({
      where: { id: "demo-task-3" },
      update: {},
      create: {
        id: "demo-task-3",
        title: "Review code pull requests",
        description: "Go through pending PRs and provide feedback",
        status: "DONE",
        priority: "MEDIUM",
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        projectId: "demo-project-1",
        order: 3,
      },
    }),

    // Personal Projects
    prisma.task.upsert({
      where: { id: "demo-task-4" },
      update: {},
      create: {
        id: "demo-task-4",
        title: "Learn TypeScript",
        description: "Complete the TypeScript course on Udemy",
        status: "IN_PROGRESS",
        priority: "HIGH",
        projectId: "demo-project-2",
        order: 1,
      },
    }),
    prisma.task.upsert({
      where: { id: "demo-task-5" },
      update: {},
      create: {
        id: "demo-task-5",
        title: "Build portfolio website",
        description: "Create a personal portfolio website using Next.js",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        projectId: "demo-project-2",
        order: 2,
      },
    }),

    // Home & Life
    prisma.task.upsert({
      where: { id: "demo-task-6" },
      update: {},
      create: {
        id: "demo-task-6",
        title: "Grocery shopping",
        description: "Buy ingredients for this week's meals",
        status: "TODO",
        priority: "LOW",
        projectId: "demo-project-3",
        order: 1,
      },
    }),
    prisma.task.upsert({
      where: { id: "demo-task-7" },
      update: {},
      create: {
        id: "demo-task-7",
        title: "Clean the garage",
        description: "Organize and clean out the garage storage",
        status: "DONE",
        priority: "MEDIUM",
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        projectId: "demo-project-3",
        order: 2,
      },
    }),
    prisma.task.upsert({
      where: { id: "demo-task-8" },
      update: {},
      create: {
        id: "demo-task-8",
        title: "Book dentist appointment",
        description: "Schedule annual dental checkup",
        status: "TODO",
        priority: "LOW",
        projectId: "demo-project-3",
        order: 3,
      },
    }),
  ]);

  console.log("✅ Demo tasks created:", tasks.length);

  console.log("🎉 Sample data seeding completed!");
  console.log("\n📋 Sample Account:");
  console.log("Email: sample@example.com");
  console.log("Password: password123");
  console.log("\n📊 Created:");
  console.log(`- ${projects.length} projects`);
  console.log(`- ${tasks.length} tasks`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding demo data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
