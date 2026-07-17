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
  
  // Dynamically load data so we don't break server actions
  const { POKEMON_DATA } = await import("@/lib/pokemon-data");
  
  // Filter out any pokemon that is the result of an evolution
  const allEvolutions = new Set(
    Object.values(POKEMON_DATA)
      .map(p => p.evolution?.speciesId)
      .filter(Boolean)
  );

  const basePokemon = Object.values(POKEMON_DATA).filter(p => !allEvolutions.has(p.id));

  const commons = basePokemon.filter(p => p.rarity === "COMMON").map(p => p.id);
  const rares = basePokemon.filter(p => p.rarity === "RARE").map(p => p.id);
  const legendaries = basePokemon.filter(p => p.rarity === "LEGENDARY").map(p => p.id);

  // Weighted RNG: 70% Common, 25% Rare, 5% Legendary
  const roll = Math.random();
  let selectedPool = commons;
  let rarity = "COMMON";
  
  if (roll > 0.95 && legendaries.length > 0) {
    selectedPool = legendaries;
    rarity = "LEGENDARY";
  } else if (roll > 0.70 && rares.length > 0) {
    selectedPool = rares;
    rarity = "RARE";
  }

  const randomPokemonId = selectedPool[Math.floor(Math.random() * selectedPool.length)];
  const isShiny = Math.random() < 0.05; // 5% chance

  // Check if user already owns this Pokemon
  const existingPokemon = await prisma.userPokemon.findFirst({
    where: {
      userId,
      pokemonId: randomPokemonId
    }
  });

  if (existingPokemon) {
    // Dismantle duplicate into Oran Berry (Assuming Oran Berry shop item exists, we'll find its ID)
    const oranBerryShopItem = await prisma.shopItem.findFirst({
      where: { name: "Oran Berry" }
    });

    if (oranBerryShopItem) {
      const existingItem = await prisma.userItem.findUnique({
        where: { userId_shopItemId: { userId, shopItemId: oranBerryShopItem.id } }
      });

      if (existingItem) {
        await prisma.userItem.update({
          where: { id: existingItem.id },
          data: { quantity: { increment: 1 } }
        });
      } else {
        await prisma.userItem.create({
          data: { userId, shopItemId: oranBerryShopItem.id, quantity: 1 }
        });
      }
    }

    revalidatePath("/dashboard");
    return {
      success: true,
      gachaResult: {
        pokemonId: randomPokemonId,
        isShiny,
        isDuplicate: true,
        message: `Duplicate ${randomPokemonId} dismantled into an Oran Berry!`,
        rarity
      }
    };
  }

  // If not duplicate, create it
  await prisma.userPokemon.create({
    data: {
      userId,
      pokemonId: randomPokemonId,
      xp: 0,
      mood: "happy",
      isShiny
    }
  });

  revalidatePath("/dashboard");
  return { 
    success: true, 
    gachaResult: {
      pokemonId: randomPokemonId,
      isShiny,
      isDuplicate: false,
      message: `You got a ${isShiny ? 'SHINY ' : ''}${randomPokemonId}!`,
      rarity
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
