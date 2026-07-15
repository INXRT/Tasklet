"use server";

import { getPrisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

export async function selectStarterPokemon(pokemonId: string) {
  try {
    const prisma = getPrisma();
    let user = await prisma.user.findFirst();
    
    if (!user) {
      user = await prisma.user.create({
        data: {}
      });
    }

    // Create the UserPokemon
    const userPokemon = await prisma.userPokemon.create({
      data: {
        userId: user.id,
        pokemonId: pokemonId,
        xp: 0,
        mood: "happy",
        isShiny: false
      }
    });

    // Update user active pokemon
    await prisma.user.update({
      where: { id: user.id },
      data: { activePokemonId: userPokemon.id }
    });

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");
    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message || String(error) };
  }
}

