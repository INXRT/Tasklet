"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(userId: string, title: string, dueDate: Date, durationMinutes: number = 60) {
  const task = await prisma.task.create({
    data: {
      userId,
      title,
      dueDate,
      duration: durationMinutes,
      isCompleted: false,
      urgency: "LOW", // will calculate dynamically later
    },
  });
  
  revalidatePath("/dashboard");
  return task;
}

export async function updateTask(id: string, data: any) {
  const task = await prisma.task.update({
    where: { id },
    data,
  });
  
  revalidatePath("/dashboard");
  return task;
}

export async function toggleTaskCompletion(id: string, currentStatus: boolean) {
  // Toggle completion status
  // Also, when completed, reward user with coins
  
  const task = await prisma.task.update({
    where: { id },
    data: { isCompleted: !currentStatus },
  });

  if (!currentStatus) {
    // If we just completed it, add some coins
    await prisma.user.update({
      where: { id: task.userId },
      data: { coins: { increment: 10 } }
    });
  } else {
    // If we unchecked it, remove coins (don't go below 0 though, logic for later)
    await prisma.user.update({
      where: { id: task.userId },
      data: { coins: { decrement: 10 } }
    });
  }
  
  revalidatePath("/dashboard");
  return task;
}

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id },
  });
  
  revalidatePath("/dashboard");
}
