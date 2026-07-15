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
