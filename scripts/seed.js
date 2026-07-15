const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.shopItem.deleteMany({});
  
  await prisma.shopItem.createMany({
    data: [
      {
        name: "Pokéball Gacha",
        description: "Open a Pokéball to find a random new Pokémon! (Small chance for shiny)",
        price: 100,
        type: "gacha",
        imageUrl: "/items/poke-ball.png"
      },
      {
        name: "Oran Berry",
        description: "Restores mood to happy immediately.",
        price: 20,
        type: "food",
        imageUrl: "/items/oran-berry.png"
      },
      {
        name: "Rare Candy",
        description: "Instantly levels up your Pokémon.",
        price: 150,
        type: "food",
        imageUrl: "/items/rare-candy.png"
      }
    ]
  });
  
  console.log("Seeded shop items successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
