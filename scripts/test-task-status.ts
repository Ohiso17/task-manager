import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testTaskStatus() {
  console.log("🧪 Testing task status functionality...");

  try {
    // Find a sample task
    const task = await prisma.task.findFirst({
      where: {
        title: {
          contains: "Complete quarterly report"
        }
      },
      include: {
        project: true
      }
    });

    if (!task) {
      console.log("❌ No sample task found. Please run the seed script first.");
      return;
    }

    console.log(`✅ Found task: "${task.title}"`);
    console.log(`   Current status: ${task.status}`);
    console.log(`   Project: ${task.project.name}`);

    // Test status update
    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: { 
        status: "DONE",
        completedAt: new Date()
      }
    });

    console.log(`✅ Updated task status to: ${updatedTask.status}`);
    console.log(`   Completed at: ${updatedTask.completedAt}`);

    // Test stats calculation
    const projects = await prisma.project.findMany({
      where: { 
        userId: task.project.userId
      },
      include: {
        tasks: {
          select: {
            status: true,
            completedAt: true,
          }
        }
      }
    });

    const totalTasks = projects.reduce((sum, project) => sum + project.tasks.length, 0);
    const completedTasks = projects.reduce((sum, project) => 
      sum + project.tasks.filter(task => task.status === "DONE").length, 0
    );
    const inProgressTasks = projects.reduce((sum, project) => 
      sum + project.tasks.filter(task => task.status === "IN_PROGRESS").length, 0
    );

    console.log("📊 Project Stats:");
    console.log(`   Total tasks: ${totalTasks}`);
    console.log(`   Completed tasks: ${completedTasks}`);
    console.log(`   In progress tasks: ${inProgressTasks}`);

    // Reset task status for testing
    await prisma.task.update({
      where: { id: task.id },
      data: { 
        status: "IN_PROGRESS",
        completedAt: null
      }
    });

    console.log("✅ Reset task status to IN_PROGRESS for testing");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testTaskStatus();
