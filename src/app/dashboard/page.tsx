import { getPrisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
    <div className="w-full h-full flex flex-col z-10 relative overflow-hidden">
      <DashboardClient user={user} activePokemon={activePokemon} />
    </div>
  );
}

