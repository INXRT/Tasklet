import { getPrisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const prisma = getPrisma();
  const user = await prisma.user.findFirst({
    include: {
      tasks: {
        orderBy: { dueDate: "asc" }
      },
      pokemons: true
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
    <div className="w-full h-full flex flex-col z-10 relative overflow-hidden">
      <DashboardClient user={user} activePokemon={activePokemon} />
    </div>
  );
}

