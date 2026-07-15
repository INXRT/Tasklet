"use server";

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setActivePokemon(userId: string, pokemonId: string) {
  const prisma = getPrisma();
  
  await prisma.user.update({
    where: { id: userId },
    data: { activePokemonId: pokemonId }
  });

  revalidatePath("/dashboard");
}
