import { getPrisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardWrapper } from "./DashboardWrapper";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { processMissedTasks } from "@/actions/punishment";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  let userId = session?.user?.id;

  const prisma = getPrisma();

  if (!userId) {
    redirect("/login");
  }

  await processMissedTasks(userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tasks: {
        orderBy: { dueDate: "asc" }
      },
      pokemons: true,
      inventory: {
        include: { shopItem: true }
      }
    }
  });
  
  if (!user || !user.activePokemonId) {
    redirect("/onboarding");
  }

  const activePokemon = user.pokemons.find(p => p.id === user.activePokemonId);

  if (!activePokemon) {
    redirect("/onboarding");
  }

  return (
    <div className="w-full min-h-full lg:h-full flex flex-col z-10 relative lg:overflow-hidden">
      <DashboardWrapper user={user} activePokemon={activePokemon} />
    </div>
  );
}
