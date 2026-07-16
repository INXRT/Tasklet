"use server";

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createTask(userId: string, title: string, dueDate: Date, durationMinutes: number = 60) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const prisma = getPrisma();
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

export async function createRecurringTasks(userId: string, title: string, dueDates: Date[], durationMinutes: number = 60, recurrenceRule: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const prisma = getPrisma();
  const parentTaskId = Math.random().toString(36).substring(2, 15); // Simple unique ID for grouping

  const tasksData = dueDates.map(dueDate => ({
    userId,
    title,
    dueDate,
    duration: durationMinutes,
    isCompleted: false,
    urgency: "LOW",
    recurrenceRule,
    parentTaskId
  }));

  await prisma.task.createMany({
    data: tasksData
  });
  
  revalidatePath("/dashboard");
  return { success: true, count: dueDates.length };
}

export async function updateTask(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const prisma = getPrisma();
  
  // Verify ownership
  const existingTask = await prisma.task.findUnique({ where: { id } });
  if (!existingTask || existingTask.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.update({
    where: { id },
    data,
  });
  
  revalidatePath("/dashboard");
  return task;
}

export async function toggleTaskCompletion(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const prisma = getPrisma();
  
  // Verify ownership
  const existingTask = await prisma.task.findUnique({ where: { id } });
  if (!existingTask || existingTask.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }
  
  const task = await prisma.task.update({
    where: { id },
    data: { isCompleted: !currentStatus },
  });

  const user = await prisma.user.findUnique({
    where: { id: task.userId },
    include: { pokemons: true }
  });

  if (!user || !user.activePokemonId) {
    revalidatePath("/dashboard");
    return task;
  }

  const activePokemon = user.pokemons.find(p => p.id === user.activePokemonId);
  if (!activePokemon) {
    revalidatePath("/dashboard");
    return task;
  }

  if (!currentStatus) {
    // If we just completed it: +10 coins, +5 karma, +25 XP
    const newXp = activePokemon.xp + 25;
    
    // We can't import checkEvolution cleanly in a server action if it uses client code, 
    // but lib/pokemon-data.ts is pure TS so it's fine.
    const { checkEvolution } = await import("@/lib/pokemon-data");
    const evolutionId = checkEvolution(activePokemon.pokemonId, newXp);

    await prisma.user.update({
      where: { id: task.userId },
      data: { 
        coins: { increment: 10 },
        karma: { increment: 5 }
      }
    });

    await prisma.userPokemon.update({
      where: { id: activePokemon.id },
      data: {
        xp: newXp,
        pokemonId: evolutionId || activePokemon.pokemonId,
        mood: "happy" // completing tasks makes them happy
      }
    });
  } else {
    // If we unchecked it: -10 coins, -5 karma, -25 xp (minimum 0)
    const newXp = Math.max(0, activePokemon.xp - 25);

    await prisma.user.update({
      where: { id: task.userId },
      data: { 
        coins: { decrement: 10 },
        karma: { decrement: 5 }
      }
    });

    await prisma.userPokemon.update({
      where: { id: activePokemon.id },
      data: {
        xp: newXp,
        mood: "idle"
      }
    });
  }
  
  revalidatePath("/dashboard");
  return task;
}

export async function deleteTask(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const prisma = getPrisma();
  
  // Verify ownership
  const existingTask = await prisma.task.findUnique({ where: { id } });
  if (!existingTask || existingTask.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.task.delete({
    where: { id },
  });
  
  revalidatePath("/dashboard");
}
