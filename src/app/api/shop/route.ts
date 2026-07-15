import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prisma = getPrisma();
    let items = await prisma.shopItem.findMany();
    
    // Auto-seed if the database is freshly migrated or empty
    if (items.length === 0) {
      const seedItems = [
        {
          name: "Poké Ball",
          description: "A mysterious ball that grants a random new Pokémon companion.",
          price: 50,
          type: "gacha",
          imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
        },
        {
          name: "Rare Candy",
          description: "Instantly levels up your active Pokémon by a massive amount.",
          price: 150,
          type: "food",
          imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png"
        },
        {
          name: "Oran Berry",
          description: "A tasty berry that slightly increases your Pokémon's mood and XP.",
          price: 25,
          type: "food",
          imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png"
        }
      ];
      
      await prisma.shopItem.createMany({ data: seedItems });
      items = await prisma.shopItem.findMany(); // Re-fetch
    }
    
    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
