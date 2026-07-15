"use server";

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function purchaseItem(userId: string, shopItemId: string) {
  const prisma = getPrisma();
  
  const shopItem = await prisma.shopItem.findUnique({
    where: { id: shopItemId }
  });

  if (!shopItem) throw new Error("Item not found");

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || user.coins < shopItem.price) {
    throw new Error("Not enough coins");
  }

  // Deduct coins
  await prisma.user.update({
    where: { id: userId },
    data: { coins: { decrement: shopItem.price } }
  });

  // If it's a gacha item (Pokeball), open it immediately
  if (shopItem.type === "gacha") {
    return await openGacha(userId);
  }

  // Otherwise, add to inventory
  const existingItem = await prisma.userItem.findUnique({
    where: {
      userId_shopItemId: {
        userId,
        shopItemId
      }
    }
  });

  if (existingItem) {
    await prisma.userItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: 1 } }
    });
  } else {
    await prisma.userItem.create({
      data: {
        userId,
        shopItemId,
        quantity: 1
      }
    });
  }

  revalidatePath("/dashboard");
  return { success: true, message: `Purchased ${shopItem.name}` };
}

async function openGacha(userId: string) {
  const prisma = getPrisma();
  
  // Random starter pokemon
  const starters = ["bulbasaur", "charmander", "pichu"];
  const randomPokemon = starters[Math.floor(Math.random() * starters.length)];
  
  // Random chance for shiny
  const isShiny = Math.random() < 0.05; // 5% chance

  const newPokemon = await prisma.userPokemon.create({
    data: {
      userId,
      pokemonId: randomPokemon,
      xp: 0,
      mood: "happy",
      isShiny
    }
  });

  revalidatePath("/dashboard");
  return { 
    success: true, 
    gachaResult: {
      pokemonId: randomPokemon,
      isShiny,
      message: `You got a ${isShiny ? 'SHINY ' : ''}${randomPokemon}!`
    }
  };
}

export async function consumeItem(userId: string, userItemId: string) {
  const prisma = getPrisma();
  
  const userItem = await prisma.userItem.findUnique({
    where: { id: userItemId },
    include: { shopItem: true }
  });

  if (!userItem || userItem.userId !== userId) {
    throw new Error("Item not found in your inventory.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { pokemons: true }
  });

  if (!user || !user.activePokemonId) {
    throw new Error("No active Pokémon to feed.");
  }

  const activePokemon = user.pokemons.find(p => p.id === user.activePokemonId);
  if (!activePokemon) throw new Error("Active Pokémon not found.");

  // Apply effect
  let newXp = activePokemon.xp;
  let newMood = activePokemon.mood;

  if (userItem.shopItem.name === "Rare Candy") {
    newXp += 500;
    newMood = "happy";
  } else if (userItem.shopItem.name === "Oran Berry") {
    newXp += 50;
    newMood = "happy";
  } else {
    newXp += 10;
  }

  const { checkEvolution } = await import("@/lib/pokemon-data");
  const evolutionId = checkEvolution(activePokemon.pokemonId, newXp);

  await prisma.userPokemon.update({
    where: { id: activePokemon.id },
    data: {
      xp: newXp,
      mood: newMood,
      pokemonId: evolutionId || activePokemon.pokemonId
    }
  });

  // Decrement or delete item
  if (userItem.quantity > 1) {
    await prisma.userItem.update({
      where: { id: userItem.id },
      data: { quantity: { decrement: 1 } }
    });
  } else {
    await prisma.userItem.delete({
      where: { id: userItem.id }
    });
  }

  revalidatePath("/dashboard");
  return { 
    success: true, 
    message: evolutionId && evolutionId !== activePokemon.pokemonId 
      ? `What? Your Pokémon is evolving into ${evolutionId}!` 
      : `You used ${userItem.shopItem.name}. Your Pokémon is happy!` 
  };
}
