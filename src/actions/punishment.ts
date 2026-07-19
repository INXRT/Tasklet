"use server";

import { getPrisma } from "@/lib/prisma";
import { startOfToday } from "date-fns";
import { revalidatePath } from "next/cache";

export async function processMissedTasks(userId: string) {
  const prisma = getPrisma();
  
  try {
    const today = startOfToday();

    // Find all missed tasks for this user
    const missedTasks = await prisma.task.findMany({
      where: {
        userId,
        isCompleted: false,
        isMissed: false,
        dueDate: {
          lt: today // Strictly before today means it's past due
        }
      }
    });

    if (missedTasks.length === 0) {
      return { success: true, processed: 0 };
    }

    // Mark them as missed
    await prisma.task.updateMany({
      where: {
        id: { in: missedTasks.map(t => t.id) }
      },
      data: {
        isMissed: true
      }
    });

    // Punish the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pokemons: true }
    });

    if (user) {
      // 1. Break the streak
      await prisma.user.update({
        where: { id: userId },
        data: { streak: 0 }
      });

      // 2. Make the active Pokemon sad
      if (user.activePokemonId) {
        await prisma.userPokemon.update({
          where: { id: user.activePokemonId },
          data: { mood: "sad" }
        });
      }
    }

    revalidatePath("/dashboard");
    return { success: true, processed: missedTasks.length };
  } catch (error) {
    console.error("Error processing missed tasks:", error);
    return { success: false, error: "Failed to process missed tasks" };
  }
}
