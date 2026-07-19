import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "inxrtmusic@gmail.com";
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { inventory: true, pokemons: true }
  });

  if (!user) {
    console.log("User not found!");
    return;
  }

  // 1. Delete all tasks
  await prisma.task.deleteMany({
    where: { userId: user.id }
  });

  // 2. Set coins to enough for 2 pokeballs (100 each) and a bit of food
  await prisma.user.update({
    where: { id: user.id },
    data: {
      coins: 250, // Enough to show off purchasing a couple items
      karma: 0,
      streak: 0,
    }
  });

  // 3. Clear inventory
  await prisma.userItem.deleteMany({
    where: { userId: user.id }
  });

  // 3. Clear inventory completely
  await prisma.userItem.deleteMany({
    where: { userId: user.id }
  });

  // 4. Delete all Pokemon so they have to choose a starter again
  await prisma.userPokemon.deleteMany({
    where: { userId: user.id }
  });

  // 5. Clear active pokemon ID
  await prisma.user.update({
    where: { id: user.id },
    data: { activePokemonId: null }
  });

  console.log("Data successfully purged! Onboarding flow is ready for recording!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
